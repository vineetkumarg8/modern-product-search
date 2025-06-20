package com.productapi.service;

import com.productapi.dto.external.ExternalProductResponse;
import com.productapi.entity.Product;
import com.productapi.exception.DataLoadException;
import com.productapi.repository.ProductRepository;
import com.productapi.repository.ProductSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service for orchestrating data loading from external APIs.
 */
@Service
public class DataLoadService {

    private static final Logger logger = LoggerFactory.getLogger(DataLoadService.class);
    private static final int BATCH_SIZE = 50;

    private final ExternalApiService externalApiService;
    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;
    private final ProductMappingService mappingService;

    private final AtomicInteger loadingProgress = new AtomicInteger(0);
    private volatile boolean isLoading = false;
    private volatile String loadingStatus = "Not started";

    public DataLoadService(ExternalApiService externalApiService,
                          ProductRepository productRepository,
                          ProductSearchRepository productSearchRepository,
                          ProductMappingService mappingService) {
        this.externalApiService = externalApiService;
        this.productRepository = productRepository;
        this.productSearchRepository = productSearchRepository;
        this.mappingService = mappingService;
    }

    /**
     * Load all products from external API into the database.
     * This method is idempotent - it will update existing products and add new ones.
     *
     * @return CompletableFuture containing the load result
     */
    @Transactional
    public CompletableFuture<DataLoadResult> loadAllProducts() {
        if (isLoading) {
            return CompletableFuture.completedFuture(
                    new DataLoadResult(false, "Data loading is already in progress", 0, 0, 0));
        }

        isLoading = true;
        loadingProgress.set(0);
        loadingStatus = "Starting data load...";

        logger.info("Starting to load all products from external API");

        return externalApiService.getAllProducts()
                .thenCompose(this::processExternalProducts)
                .thenCompose(result -> rebuildSearchIndex().thenApply(indexResult -> {
                    if (indexResult) {
                        logger.info("Search index rebuilt successfully");
                        return result;
                    } else {
                        logger.warn("Search index rebuild failed, but data load was successful");
                        return new DataLoadResult(true, 
                                result.getMessage() + " (Warning: Search index rebuild failed)", 
                                result.getTotalProducts(), result.getNewProducts(), result.getUpdatedProducts());
                    }
                }))
                .exceptionally(throwable -> {
                    logger.error("Error during data loading", throwable);
                    isLoading = false;
                    loadingStatus = "Failed: " + throwable.getMessage();
                    return new DataLoadResult(false, "Data loading failed: " + throwable.getMessage(), 0, 0, 0);
                })
                .whenComplete((result, throwable) -> {
                    isLoading = false;
                    if (result != null && result.isSuccess()) {
                        loadingStatus = "Completed successfully";
                        logger.info("Data loading completed: {}", result);
                    } else {
                        loadingStatus = "Failed";
                    }
                });
    }

    /**
     * Load a specific product by external ID.
     *
     * @param externalId the external product ID
     * @return CompletableFuture containing the load result
     */
    @Transactional
    public CompletableFuture<DataLoadResult> loadProductById(Long externalId) {
        logger.info("Loading product with external ID: {}", externalId);

        return externalApiService.getProductById(externalId)
                .thenApply(externalProduct -> {
                    try {
                        Product product = mappingService.mapToEntity(externalProduct);
                        
                        // Check if product already exists
                        boolean isNew = !productRepository.existsByExternalId(externalId);
                        
                        if (!isNew) {
                            // Update existing product
                            Product existingProduct = productRepository.findByExternalId(externalId)
                                    .orElseThrow(() -> new DataLoadException("Product not found during update"));
                            product = mappingService.updateEntity(existingProduct, externalProduct);
                        }
                        
                        productRepository.save(product);
                        
                        int newProducts = isNew ? 1 : 0;
                        int updatedProducts = isNew ? 0 : 1;
                        
                        logger.info("Successfully {} product with external ID: {}", 
                                isNew ? "created" : "updated", externalId);
                        
                        return new DataLoadResult(true, 
                                "Product " + (isNew ? "created" : "updated") + " successfully", 
                                1, newProducts, updatedProducts);
                                
                    } catch (Exception e) {
                        logger.error("Error processing product with external ID: {}", externalId, e);
                        throw DataLoadException.productMappingFailed(externalId, e);
                    }
                })
                .exceptionally(throwable -> {
                    logger.error("Error loading product with external ID: {}", externalId, throwable);
                    return new DataLoadResult(false, "Failed to load product: " + throwable.getMessage(), 0, 0, 0);
                });
    }

    /**
     * Clear all products from the database.
     *
     * @return CompletableFuture containing the clear result
     */
    @Transactional
    public CompletableFuture<DataLoadResult> clearAllProducts() {
        logger.info("Clearing all products from database");

        return CompletableFuture.supplyAsync(() -> {
            try {
                long count = productRepository.count();
                productRepository.deleteAll();
                logger.info("Successfully cleared {} products from database", count);
                
                loadingStatus = "Database cleared";
                return new DataLoadResult(true, "Successfully cleared " + count + " products", (int) count, 0, 0);
                
            } catch (Exception e) {
                logger.error("Error clearing products from database", e);
                return new DataLoadResult(false, "Failed to clear products: " + e.getMessage(), 0, 0, 0);
            }
        });
    }

    /**
     * Get current loading status.
     *
     * @return loading status information
     */
    public LoadingStatus getLoadingStatus() {
        return new LoadingStatus(isLoading, loadingStatus, loadingProgress.get());
    }

    /**
     * Check if external API is available.
     *
     * @return CompletableFuture containing availability status
     */
    public CompletableFuture<Boolean> checkExternalApiAvailability() {
        return externalApiService.isApiAvailable();
    }

    /**
     * Rebuild search index manually.
     *
     * @return CompletableFuture containing rebuild result
     */
    public CompletableFuture<Boolean> rebuildSearchIndex() {
        logger.info("Rebuilding search index");
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                productSearchRepository.rebuildIndex();
                logger.info("Search index rebuilt successfully");
                return true;
            } catch (Exception e) {
                logger.error("Error rebuilding search index", e);
                return false;
            }
        });
    }

    private CompletableFuture<DataLoadResult> processExternalProducts(ExternalProductResponse response) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                if (response == null || response.getProducts() == null) {
                    throw new DataLoadException("No products received from external API");
                }

                List<ExternalProductResponse.ExternalProduct> externalProducts = response.getProducts();
                int totalProducts = externalProducts.size();
                int newProducts = 0;
                int updatedProducts = 0;

                logger.info("Processing {} products from external API", totalProducts);
                loadingStatus = "Processing products...";

                // Process products in batches
                List<Product> batch = new ArrayList<>();
                
                for (int i = 0; i < externalProducts.size(); i++) {
                    ExternalProductResponse.ExternalProduct externalProduct = externalProducts.get(i);
                    
                    try {
                        Product product = mappingService.mapToEntity(externalProduct);
                        
                        // Check if product already exists
                        boolean isNew = !productRepository.existsByExternalId(externalProduct.getId());
                        
                        if (!isNew) {
                            // Update existing product
                            Product existingProduct = productRepository.findByExternalId(externalProduct.getId())
                                    .orElseThrow(() -> new DataLoadException("Product not found during update"));
                            product = mappingService.updateEntity(existingProduct, externalProduct);
                            updatedProducts++;
                        } else {
                            newProducts++;
                        }
                        
                        batch.add(product);
                        
                        // Save batch when it reaches the batch size or at the end
                        if (batch.size() >= BATCH_SIZE || i == externalProducts.size() - 1) {
                            productRepository.saveAll(batch);
                            batch.clear();
                            
                            int processed = i + 1;
                            loadingProgress.set((processed * 100) / totalProducts);
                            loadingStatus = String.format("Processed %d/%d products", processed, totalProducts);
                            
                            logger.debug("Processed {}/{} products", processed, totalProducts);
                        }
                        
                    } catch (Exception e) {
                        logger.error("Error processing product with external ID: {}", externalProduct.getId(), e);
                        // Continue processing other products
                    }
                }

                String message = String.format("Successfully processed %d products (%d new, %d updated)", 
                        totalProducts, newProducts, updatedProducts);
                
                logger.info(message);
                return new DataLoadResult(true, message, totalProducts, newProducts, updatedProducts);
                
            } catch (Exception e) {
                logger.error("Error processing external products", e);
                throw new DataLoadException("Failed to process external products", e);
            }
        });
    }

    /**
     * Data load result DTO.
     */
    public static class DataLoadResult {
        private final boolean success;
        private final String message;
        private final int totalProducts;
        private final int newProducts;
        private final int updatedProducts;

        public DataLoadResult(boolean success, String message, int totalProducts, int newProducts, int updatedProducts) {
            this.success = success;
            this.message = message;
            this.totalProducts = totalProducts;
            this.newProducts = newProducts;
            this.updatedProducts = updatedProducts;
        }

        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public int getTotalProducts() { return totalProducts; }
        public int getNewProducts() { return newProducts; }
        public int getUpdatedProducts() { return updatedProducts; }

        @Override
        public String toString() {
            return String.format("DataLoadResult{success=%s, message='%s', total=%d, new=%d, updated=%d}",
                    success, message, totalProducts, newProducts, updatedProducts);
        }
    }

    /**
     * Loading status DTO.
     */
    public static class LoadingStatus {
        private final boolean loading;
        private final String status;
        private final int progress;

        public LoadingStatus(boolean loading, String status, int progress) {
            this.loading = loading;
            this.status = status;
            this.progress = progress;
        }

        // Getters
        public boolean isLoading() { return loading; }
        public String getStatus() { return status; }
        public int getProgress() { return progress; }
    }
}
