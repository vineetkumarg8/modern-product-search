package com.productapi.service;

import com.productapi.dto.response.PagedResponse;
import com.productapi.dto.response.ProductResponse;
import com.productapi.entity.Product;
import com.productapi.exception.ProductNotFoundException;
import com.productapi.repository.ProductRepository;
import com.productapi.repository.ProductSearchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductSearchRepository productSearchRepository;

    @Mock
    private ProductMappingService mappingService;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, productSearchRepository, mappingService);
    }

    @Test
    void findById_ShouldReturnProduct_WhenProductExists() {
        // Given
        Long productId = 1L;
        Product product = createProduct();
        ProductResponse expectedResponse = createProductResponse();

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(mappingService.mapToResponse(product)).thenReturn(expectedResponse);

        // When
        ProductResponse result = productService.findById(productId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(productId);
        assertThat(result.getTitle()).isEqualTo("Test Product");
    }

    @Test
    void findById_ShouldThrowException_WhenProductNotFound() {
        // Given
        Long productId = 999L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> productService.findById(productId))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining("Product not found with ID: 999");
    }

    @Test
    void findByExternalId_ShouldReturnProduct_WhenProductExists() {
        // Given
        Long externalId = 1L;
        Product product = createProduct();
        ProductResponse expectedResponse = createProductResponse();

        when(productRepository.findByExternalId(externalId)).thenReturn(Optional.of(product));
        when(mappingService.mapToResponse(product)).thenReturn(expectedResponse);

        // When
        ProductResponse result = productService.findByExternalId(externalId);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getExternalId()).isEqualTo(externalId);
    }

    @Test
    void findBySku_ShouldReturnProduct_WhenProductExists() {
        // Given
        String sku = "TEST-001";
        Product product = createProduct();
        ProductResponse expectedResponse = createProductResponse();

        when(productRepository.findBySku(sku)).thenReturn(Optional.of(product));
        when(mappingService.mapToResponse(product)).thenReturn(expectedResponse);

        // When
        ProductResponse result = productService.findBySku(sku);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getSku()).isEqualTo(sku);
    }

    @Test
    void searchProducts_ShouldReturnPagedResults() {
        // Given
        String searchText = "test";
        Pageable pageable = PageRequest.of(0, 10);
        List<Product> products = List.of(createProduct());
        Page<Product> productPage = new PageImpl<>(products, pageable, 1);
        List<ProductResponse> productResponses = List.of(createProductResponse());

        when(productSearchRepository.searchProducts(searchText, pageable)).thenReturn(productPage);
        when(mappingService.mapToResponseList(products)).thenReturn(productResponses);

        // When
        PagedResponse<ProductResponse> result = productService.searchProducts(searchText, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getPage()).isEqualTo(0);
        assertThat(result.getSize()).isEqualTo(10);
    }

    @Test
    void searchProducts_ShouldReturnAllProducts_WhenSearchTextIsEmpty() {
        // Given
        String searchText = "";
        Pageable pageable = PageRequest.of(0, 10);
        List<Product> products = List.of(createProduct());
        Page<Product> productPage = new PageImpl<>(products, pageable, 1);
        List<ProductResponse> productResponses = List.of(createProductResponse());

        when(productRepository.findAll(pageable)).thenReturn(productPage);
        when(mappingService.mapToResponseList(products)).thenReturn(productResponses);

        // When
        PagedResponse<ProductResponse> result = productService.searchProducts(searchText, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void searchProductsFuzzy_ShouldReturnPagedResults() {
        // Given
        String searchText = "tset"; // typo
        Pageable pageable = PageRequest.of(0, 10);
        List<Product> products = List.of(createProduct());
        Page<Product> productPage = new PageImpl<>(products, pageable, 1);
        List<ProductResponse> productResponses = List.of(createProductResponse());

        when(productSearchRepository.searchProductsFuzzy(searchText, pageable)).thenReturn(productPage);
        when(mappingService.mapToResponseList(products)).thenReturn(productResponses);

        // When
        PagedResponse<ProductResponse> result = productService.searchProductsFuzzy(searchText, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void findAllProducts_ShouldReturnPagedResults() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        List<Product> products = List.of(createProduct());
        Page<Product> productPage = new PageImpl<>(products, pageable, 1);
        List<ProductResponse> productResponses = List.of(createProductResponse());

        when(productRepository.findAll(pageable)).thenReturn(productPage);
        when(mappingService.mapToResponseList(products)).thenReturn(productResponses);

        // When
        PagedResponse<ProductResponse> result = productService.findAllProducts(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    void findProductsByCategory_ShouldReturnPagedResults() {
        // Given
        String category = "beauty";
        Pageable pageable = PageRequest.of(0, 10);
        List<Product> products = List.of(createProduct());
        Page<Product> productPage = new PageImpl<>(products, pageable, 1);
        List<ProductResponse> productResponses = List.of(createProductResponse());

        when(productRepository.findByCategory(category, pageable)).thenReturn(productPage);
        when(mappingService.mapToResponseList(products)).thenReturn(productResponses);

        // When
        PagedResponse<ProductResponse> result = productService.findProductsByCategory(category, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    void getSearchSuggestions_ShouldReturnSuggestions() {
        // Given
        String partialText = "lip";
        int maxSuggestions = 5;
        List<String> expectedSuggestions = List.of("lipstick", "lip gloss", "lip balm");

        when(productSearchRepository.getSearchSuggestions(partialText, maxSuggestions))
                .thenReturn(expectedSuggestions);

        // When
        List<String> result = productService.getSearchSuggestions(partialText, maxSuggestions);

        // Then
        assertThat(result).hasSize(3);
        assertThat(result).containsExactly("lipstick", "lip gloss", "lip balm");
    }

    @Test
    void getSearchSuggestions_ShouldReturnEmpty_WhenPartialTextIsEmpty() {
        // Given
        String partialText = "";
        int maxSuggestions = 5;

        // When
        List<String> result = productService.getSearchSuggestions(partialText, maxSuggestions);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void getDistinctCategories_ShouldReturnCategories() {
        // Given
        List<String> expectedCategories = List.of("beauty", "fragrances", "furniture");
        when(productRepository.findDistinctCategories()).thenReturn(expectedCategories);

        // When
        List<String> result = productService.getDistinctCategories();

        // Then
        assertThat(result).hasSize(3);
        assertThat(result).containsExactly("beauty", "fragrances", "furniture");
    }

    @Test
    void existsByExternalId_ShouldReturnTrue_WhenProductExists() {
        // Given
        Long externalId = 1L;
        when(productRepository.existsByExternalId(externalId)).thenReturn(true);

        // When
        boolean result = productService.existsByExternalId(externalId);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    void existsBySku_ShouldReturnFalse_WhenProductDoesNotExist() {
        // Given
        String sku = "NON-EXISTENT";
        when(productRepository.existsBySku(sku)).thenReturn(false);

        // When
        boolean result = productService.existsBySku(sku);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    void getTotalProductCount_ShouldReturnCount() {
        // Given
        long expectedCount = 194L;
        when(productRepository.countAllProducts()).thenReturn(expectedCount);

        // When
        long result = productService.getTotalProductCount();

        // Then
        assertThat(result).isEqualTo(expectedCount);
    }

    private Product createProduct() {
        Product product = new Product();
        product.setId(1L);
        product.setExternalId(1L);
        product.setTitle("Test Product");
        product.setDescription("Test Description");
        product.setCategory("test");
        product.setPrice(new BigDecimal("9.99"));
        product.setBrand("Test Brand");
        product.setSku("TEST-001");
        return product;
    }

    private ProductResponse createProductResponse() {
        ProductResponse response = new ProductResponse();
        response.setId(1L);
        response.setExternalId(1L);
        response.setTitle("Test Product");
        response.setDescription("Test Description");
        response.setCategory("test");
        response.setPrice(new BigDecimal("9.99"));
        response.setBrand("Test Brand");
        response.setSku("TEST-001");
        return response;
    }
}
