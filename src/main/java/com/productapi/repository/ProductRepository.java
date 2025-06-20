package com.productapi.repository;

import com.productapi.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Product entity.
 * Provides standard CRUD operations and custom queries.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find product by external ID.
     *
     * @param externalId the external ID from the third-party API
     * @return Optional containing the product if found
     */
    Optional<Product> findByExternalId(Long externalId);

    /**
     * Find product by SKU.
     *
     * @param sku the product SKU
     * @return Optional containing the product if found
     */
    Optional<Product> findBySku(String sku);

    /**
     * Check if product exists by external ID.
     *
     * @param externalId the external ID from the third-party API
     * @return true if product exists, false otherwise
     */
    boolean existsByExternalId(Long externalId);

    /**
     * Check if product exists by SKU.
     *
     * @param sku the product SKU
     * @return true if product exists, false otherwise
     */
    boolean existsBySku(String sku);

    /**
     * Find products by category with pagination.
     *
     * @param category the product category
     * @param pageable pagination information
     * @return Page of products in the specified category
     */
    Page<Product> findByCategory(String category, Pageable pageable);

    /**
     * Find products by brand with pagination.
     *
     * @param brand the product brand
     * @param pageable pagination information
     * @return Page of products from the specified brand
     */
    Page<Product> findByBrand(String brand, Pageable pageable);

    /**
     * Find products by availability status with pagination.
     *
     * @param availabilityStatus the availability status
     * @param pageable pagination information
     * @return Page of products with the specified availability status
     */
    Page<Product> findByAvailabilityStatus(String availabilityStatus, Pageable pageable);

    /**
     * Find products with stock greater than specified value.
     *
     * @param stock minimum stock level
     * @param pageable pagination information
     * @return Page of products with stock greater than specified value
     */
    Page<Product> findByStockGreaterThan(Integer stock, Pageable pageable);

    /**
     * Find products by title containing specified text (case-insensitive).
     *
     * @param title text to search in title
     * @param pageable pagination information
     * @return Page of products with title containing the specified text
     */
    Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    /**
     * Find products by description containing specified text (case-insensitive).
     *
     * @param description text to search in description
     * @param pageable pagination information
     * @return Page of products with description containing the specified text
     */
    Page<Product> findByDescriptionContainingIgnoreCase(String description, Pageable pageable);

    /**
     * Find products by title or description containing specified text (case-insensitive).
     *
     * @param title text to search in title
     * @param description text to search in description
     * @param pageable pagination information
     * @return Page of products with title or description containing the specified text
     */
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    Page<Product> findByTitleOrDescriptionContaining(
            @Param("title") String title,
            @Param("description") String description,
            Pageable pageable);

    /**
     * Count total number of products.
     *
     * @return total number of products
     */
    @Query("SELECT COUNT(p) FROM Product p")
    long countAllProducts();

    /**
     * Count products by category.
     *
     * @param category the product category
     * @return number of products in the specified category
     */
    long countByCategory(String category);

    /**
     * Count products by brand.
     *
     * @param brand the product brand
     * @return number of products from the specified brand
     */
    long countByBrand(String brand);

    /**
     * Find all distinct categories.
     *
     * @return list of distinct categories
     */
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category")
    java.util.List<String> findDistinctCategories();

    /**
     * Find all distinct brands.
     *
     * @return list of distinct brands
     */
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL ORDER BY p.brand")
    java.util.List<String> findDistinctBrands();

    /**
     * Find all distinct availability statuses.
     *
     * @return list of distinct availability statuses
     */
    @Query("SELECT DISTINCT p.availabilityStatus FROM Product p WHERE p.availabilityStatus IS NOT NULL ORDER BY p.availabilityStatus")
    java.util.List<String> findDistinctAvailabilityStatuses();
}
