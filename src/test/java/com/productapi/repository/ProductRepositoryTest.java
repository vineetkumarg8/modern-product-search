package com.productapi.repository;

import com.productapi.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ProductRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    private Product testProduct1;
    private Product testProduct2;

    @BeforeEach
    void setUp() {
        testProduct1 = createProduct(1L, "Test Product 1", "beauty", "Brand A", "SKU-001", "In Stock");
        testProduct2 = createProduct(2L, "Test Product 2", "fragrances", "Brand B", "SKU-002", "Low Stock");
        
        entityManager.persistAndFlush(testProduct1);
        entityManager.persistAndFlush(testProduct2);
    }

    @Test
    void findByExternalId_ShouldReturnProduct_WhenExists() {
        // When
        Optional<Product> result = productRepository.findByExternalId(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Product 1");
        assertThat(result.get().getExternalId()).isEqualTo(1L);
    }

    @Test
    void findByExternalId_ShouldReturnEmpty_WhenNotExists() {
        // When
        Optional<Product> result = productRepository.findByExternalId(999L);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void findBySku_ShouldReturnProduct_WhenExists() {
        // When
        Optional<Product> result = productRepository.findBySku("SKU-001");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test Product 1");
        assertThat(result.get().getSku()).isEqualTo("SKU-001");
    }

    @Test
    void findBySku_ShouldReturnEmpty_WhenNotExists() {
        // When
        Optional<Product> result = productRepository.findBySku("NON-EXISTENT");

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void existsByExternalId_ShouldReturnTrue_WhenExists() {
        // When
        boolean exists = productRepository.existsByExternalId(1L);

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    void existsByExternalId_ShouldReturnFalse_WhenNotExists() {
        // When
        boolean exists = productRepository.existsByExternalId(999L);

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    void existsBySku_ShouldReturnTrue_WhenExists() {
        // When
        boolean exists = productRepository.existsBySku("SKU-001");

        // Then
        assertThat(exists).isTrue();
    }

    @Test
    void existsBySku_ShouldReturnFalse_WhenNotExists() {
        // When
        boolean exists = productRepository.existsBySku("NON-EXISTENT");

        // Then
        assertThat(exists).isFalse();
    }

    @Test
    void findByCategory_ShouldReturnProductsInCategory() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByCategory("beauty", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getCategory()).isEqualTo("beauty");
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Product 1");
    }

    @Test
    void findByBrand_ShouldReturnProductsFromBrand() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByBrand("Brand A", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getBrand()).isEqualTo("Brand A");
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Product 1");
    }

    @Test
    void findByAvailabilityStatus_ShouldReturnProductsWithStatus() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByAvailabilityStatus("In Stock", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getAvailabilityStatus()).isEqualTo("In Stock");
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Product 1");
    }

    @Test
    void findByStockGreaterThan_ShouldReturnProductsWithSufficientStock() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByStockGreaterThan(50, pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getStock()).isGreaterThan(50);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Test Product 1");
    }

    @Test
    void findByTitleContainingIgnoreCase_ShouldReturnMatchingProducts() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByTitleContainingIgnoreCase("product 1", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).containsIgnoringCase("product 1");
    }

    @Test
    void findByDescriptionContainingIgnoreCase_ShouldReturnMatchingProducts() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByDescriptionContainingIgnoreCase("description", pageable);

        // Then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).allMatch(p -> 
                p.getDescription().toLowerCase().contains("description"));
    }

    @Test
    void findByTitleOrDescriptionContaining_ShouldReturnMatchingProducts() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Product> result = productRepository.findByTitleOrDescriptionContaining(
                "product 1", "product 1", pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).containsIgnoringCase("product 1");
    }

    @Test
    void countAllProducts_ShouldReturnTotalCount() {
        // When
        long count = productRepository.countAllProducts();

        // Then
        assertThat(count).isEqualTo(2);
    }

    @Test
    void countByCategory_ShouldReturnCategoryCount() {
        // When
        long count = productRepository.countByCategory("beauty");

        // Then
        assertThat(count).isEqualTo(1);
    }

    @Test
    void countByBrand_ShouldReturnBrandCount() {
        // When
        long count = productRepository.countByBrand("Brand A");

        // Then
        assertThat(count).isEqualTo(1);
    }

    @Test
    void findDistinctCategories_ShouldReturnAllCategories() {
        // When
        List<String> categories = productRepository.findDistinctCategories();

        // Then
        assertThat(categories).hasSize(2);
        assertThat(categories).containsExactlyInAnyOrder("beauty", "fragrances");
    }

    @Test
    void findDistinctBrands_ShouldReturnAllBrands() {
        // When
        List<String> brands = productRepository.findDistinctBrands();

        // Then
        assertThat(brands).hasSize(2);
        assertThat(brands).containsExactlyInAnyOrder("Brand A", "Brand B");
    }

    @Test
    void findDistinctAvailabilityStatuses_ShouldReturnAllStatuses() {
        // When
        List<String> statuses = productRepository.findDistinctAvailabilityStatuses();

        // Then
        assertThat(statuses).hasSize(2);
        assertThat(statuses).containsExactlyInAnyOrder("In Stock", "Low Stock");
    }

    private Product createProduct(Long externalId, String title, String category, 
                                 String brand, String sku, String availabilityStatus) {
        Product product = new Product();
        product.setExternalId(externalId);
        product.setTitle(title);
        product.setDescription("Test description for " + title);
        product.setCategory(category);
        product.setBrand(brand);
        product.setSku(sku);
        product.setAvailabilityStatus(availabilityStatus);
        product.setPrice(new BigDecimal("19.99"));
        product.setStock(externalId == 1L ? 100 : 25); // Different stock levels
        return product;
    }
}
