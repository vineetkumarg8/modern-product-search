package com.productapi.service;

import com.productapi.dto.response.PagedResponse;
import com.productapi.dto.response.ProductResponse;
import com.productapi.entity.Product;
import com.productapi.exception.ProductNotFoundException;
import com.productapi.repository.ProductRepository;
import com.productapi.repository.ProductSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * Service for product-related business operations.
 */
@Service
@Transactional(readOnly = true)
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;
    private final ProductMappingService mappingService;

    public ProductService(ProductRepository productRepository,
                         ProductSearchRepository productSearchRepository,
                         ProductMappingService mappingService) {
        this.productRepository = productRepository;
        this.productSearchRepository = productSearchRepository;
        this.mappingService = mappingService;
    }

    /**
     * Find product by internal ID.
     *
     * @param id the internal product ID
     * @return the product response DTO
     * @throws ProductNotFoundException if product is not found
     */
    public ProductResponse findById(Long id) {
        logger.debug("Finding product by ID: {}", id);
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ProductNotFoundException.byId(id));
        
        return mappingService.mapToResponse(product);
    }

    /**
     * Find product by external ID.
     *
     * @param externalId the external product ID
     * @return the product response DTO
     * @throws ProductNotFoundException if product is not found
     */
    public ProductResponse findByExternalId(Long externalId) {
        logger.debug("Finding product by external ID: {}", externalId);
        
        Product product = productRepository.findByExternalId(externalId)
                .orElseThrow(() -> ProductNotFoundException.byExternalId(externalId));
        
        return mappingService.mapToResponse(product);
    }

    /**
     * Find product by SKU.
     *
     * @param sku the product SKU
     * @return the product response DTO
     * @throws ProductNotFoundException if product is not found
     */
    public ProductResponse findBySku(String sku) {
        logger.debug("Finding product by SKU: {}", sku);
        
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> ProductNotFoundException.bySku(sku));
        
        return mappingService.mapToResponse(product);
    }

    /**
     * Search products using free text search on title and description.
     *
     * @param searchText the text to search for
     * @param pageable pagination information
     * @return paginated search results
     */
    public PagedResponse<ProductResponse> searchProducts(String searchText, Pageable pageable) {
        logger.debug("Searching products with text: '{}', page: {}, size: {}", 
                searchText, pageable.getPageNumber(), pageable.getPageSize());

        if (!StringUtils.hasText(searchText)) {
            return findAllProducts(pageable);
        }

        Page<Product> productPage = productSearchRepository.searchProducts(searchText.trim(), pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Search products using fuzzy matching.
     *
     * @param searchText the text to search for
     * @param pageable pagination information
     * @return paginated search results with fuzzy matching
     */
    public PagedResponse<ProductResponse> searchProductsFuzzy(String searchText, Pageable pageable) {
        logger.debug("Fuzzy searching products with text: '{}', page: {}, size: {}", 
                searchText, pageable.getPageNumber(), pageable.getPageSize());

        if (!StringUtils.hasText(searchText)) {
            return findAllProducts(pageable);
        }

        Page<Product> productPage = productSearchRepository.searchProductsFuzzy(searchText.trim(), pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Search products within a specific category.
     *
     * @param searchText the text to search for
     * @param category the category to filter by
     * @param pageable pagination information
     * @return paginated search results within the category
     */
    public PagedResponse<ProductResponse> searchProductsByCategory(String searchText, String category, Pageable pageable) {
        logger.debug("Searching products in category '{}' with text: '{}', page: {}, size: {}", 
                category, searchText, pageable.getPageNumber(), pageable.getPageSize());

        if (!StringUtils.hasText(searchText)) {
            return findProductsByCategory(category, pageable);
        }

        Page<Product> productPage = productSearchRepository.searchProductsByCategory(searchText.trim(), category, pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Search products from a specific brand.
     *
     * @param searchText the text to search for
     * @param brand the brand to filter by
     * @param pageable pagination information
     * @return paginated search results from the brand
     */
    public PagedResponse<ProductResponse> searchProductsByBrand(String searchText, String brand, Pageable pageable) {
        logger.debug("Searching products from brand '{}' with text: '{}', page: {}, size: {}", 
                brand, searchText, pageable.getPageNumber(), pageable.getPageSize());

        if (!StringUtils.hasText(searchText)) {
            return findProductsByBrand(brand, pageable);
        }

        Page<Product> productPage = productSearchRepository.searchProductsByBrand(searchText.trim(), brand, pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Find all products with pagination.
     *
     * @param pageable pagination information
     * @return paginated list of all products
     */
    public PagedResponse<ProductResponse> findAllProducts(Pageable pageable) {
        logger.debug("Finding all products, page: {}, size: {}", 
                pageable.getPageNumber(), pageable.getPageSize());

        Page<Product> productPage = productRepository.findAll(pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Find products by category.
     *
     * @param category the product category
     * @param pageable pagination information
     * @return paginated list of products in the category
     */
    public PagedResponse<ProductResponse> findProductsByCategory(String category, Pageable pageable) {
        logger.debug("Finding products by category: '{}', page: {}, size: {}", 
                category, pageable.getPageNumber(), pageable.getPageSize());

        Page<Product> productPage = productRepository.findByCategory(category, pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Find products by brand.
     *
     * @param brand the product brand
     * @param pageable pagination information
     * @return paginated list of products from the brand
     */
    public PagedResponse<ProductResponse> findProductsByBrand(String brand, Pageable pageable) {
        logger.debug("Finding products by brand: '{}', page: {}, size: {}", 
                brand, pageable.getPageNumber(), pageable.getPageSize());

        Page<Product> productPage = productRepository.findByBrand(brand, pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Find products by availability status.
     *
     * @param availabilityStatus the availability status
     * @param pageable pagination information
     * @return paginated list of products with the availability status
     */
    public PagedResponse<ProductResponse> findProductsByAvailabilityStatus(String availabilityStatus, Pageable pageable) {
        logger.debug("Finding products by availability status: '{}', page: {}, size: {}", 
                availabilityStatus, pageable.getPageNumber(), pageable.getPageSize());

        Page<Product> productPage = productRepository.findByAvailabilityStatus(availabilityStatus, pageable);
        List<ProductResponse> productResponses = mappingService.mapToResponseList(productPage.getContent());

        return new PagedResponse<>(
                productResponses,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
        );
    }

    /**
     * Get search suggestions based on partial text.
     *
     * @param partialText the partial text to get suggestions for
     * @param maxSuggestions maximum number of suggestions to return
     * @return list of suggested search terms
     */
    public List<String> getSearchSuggestions(String partialText, int maxSuggestions) {
        logger.debug("Getting search suggestions for: '{}', max: {}", partialText, maxSuggestions);

        if (!StringUtils.hasText(partialText)) {
            return List.of();
        }

        return productSearchRepository.getSearchSuggestions(partialText.trim(), maxSuggestions);
    }

    /**
     * Get all distinct categories.
     *
     * @return list of distinct categories
     */
    public List<String> getDistinctCategories() {
        logger.debug("Getting distinct categories");
        return productRepository.findDistinctCategories();
    }

    /**
     * Get all distinct brands.
     *
     * @return list of distinct brands
     */
    public List<String> getDistinctBrands() {
        logger.debug("Getting distinct brands");
        return productRepository.findDistinctBrands();
    }

    /**
     * Get all distinct availability statuses.
     *
     * @return list of distinct availability statuses
     */
    public List<String> getDistinctAvailabilityStatuses() {
        logger.debug("Getting distinct availability statuses");
        return productRepository.findDistinctAvailabilityStatuses();
    }

    /**
     * Get total product count.
     *
     * @return total number of products
     */
    public long getTotalProductCount() {
        return productRepository.countAllProducts();
    }

    /**
     * Check if a product exists by external ID.
     *
     * @param externalId the external product ID
     * @return true if product exists, false otherwise
     */
    public boolean existsByExternalId(Long externalId) {
        return productRepository.existsByExternalId(externalId);
    }

    /**
     * Check if a product exists by SKU.
     *
     * @param sku the product SKU
     * @return true if product exists, false otherwise
     */
    public boolean existsBySku(String sku) {
        return productRepository.existsBySku(sku);
    }
}
