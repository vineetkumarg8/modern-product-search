package com.productapi.service;

import com.productapi.dto.external.ExternalDimensions;
import com.productapi.dto.external.ExternalMeta;
import com.productapi.dto.external.ExternalProductResponse;
import com.productapi.dto.external.ExternalReview;
import com.productapi.dto.response.ProductResponse;
import com.productapi.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ProductMappingServiceTest {

    private ProductMappingService mappingService;

    @BeforeEach
    void setUp() {
        mappingService = new ProductMappingService();
    }

    @Test
    void mapToEntity_ShouldMapExternalProductToEntity() {
        // Given
        ExternalProductResponse.ExternalProduct externalProduct = createExternalProduct();

        // When
        Product result = mappingService.mapToEntity(externalProduct);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getExternalId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Product");
        assertThat(result.getDescription()).isEqualTo("Test Description");
        assertThat(result.getCategory()).isEqualTo("test");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("9.99"));
        assertThat(result.getBrand()).isEqualTo("Test Brand");
        assertThat(result.getSku()).isEqualTo("TEST-001");
        assertThat(result.getStock()).isEqualTo(100);
        assertThat(result.getTags()).containsExactly("tag1", "tag2");
        
        // Check dimensions
        assertThat(result.getDimensions()).isNotNull();
        assertThat(result.getDimensions().getWidth()).isEqualTo(new BigDecimal("10.0"));
        assertThat(result.getDimensions().getHeight()).isEqualTo(new BigDecimal("20.0"));
        assertThat(result.getDimensions().getDepth()).isEqualTo(new BigDecimal("30.0"));
        
        // Check meta
        assertThat(result.getMeta()).isNotNull();
        assertThat(result.getMeta().getBarcode()).isEqualTo("123456789");
        
        // Check reviews
        assertThat(result.getReviews()).hasSize(1);
        assertThat(result.getReviews().get(0).getRating()).isEqualTo(5);
        assertThat(result.getReviews().get(0).getComment()).isEqualTo("Great product!");
    }

    @Test
    void mapToEntity_ShouldHandleNullInput() {
        // When
        Product result = mappingService.mapToEntity(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void mapToResponse_ShouldMapEntityToResponse() {
        // Given
        Product product = createProduct();

        // When
        ProductResponse result = mappingService.mapToResponse(product);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getExternalId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Product");
        assertThat(result.getDescription()).isEqualTo("Test Description");
        assertThat(result.getCategory()).isEqualTo("test");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("9.99"));
        assertThat(result.getBrand()).isEqualTo("Test Brand");
        assertThat(result.getSku()).isEqualTo("TEST-001");
    }

    @Test
    void mapToResponse_ShouldHandleNullInput() {
        // When
        ProductResponse result = mappingService.mapToResponse(null);

        // Then
        assertThat(result).isNull();
    }

    @Test
    void mapToResponseList_ShouldMapListOfEntities() {
        // Given
        List<Product> products = List.of(createProduct(), createProduct());

        // When
        List<ProductResponse> result = mappingService.mapToResponseList(products);

        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Product");
        assertThat(result.get(1).getTitle()).isEqualTo("Test Product");
    }

    @Test
    void mapToResponseList_ShouldHandleNullInput() {
        // When
        List<ProductResponse> result = mappingService.mapToResponseList(null);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void updateEntity_ShouldUpdateExistingEntity() {
        // Given
        Product existingProduct = createProduct();
        ExternalProductResponse.ExternalProduct externalProduct = createExternalProduct();
        externalProduct.setTitle("Updated Title");
        externalProduct.setPrice(new BigDecimal("19.99"));

        // When
        Product result = mappingService.updateEntity(existingProduct, externalProduct);

        // Then
        assertThat(result).isSameAs(existingProduct);
        assertThat(result.getTitle()).isEqualTo("Updated Title");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("19.99"));
        assertThat(result.getId()).isEqualTo(1L); // ID should remain unchanged
    }

    private ExternalProductResponse.ExternalProduct createExternalProduct() {
        ExternalProductResponse.ExternalProduct product = new ExternalProductResponse.ExternalProduct();
        product.setId(1L);
        product.setTitle("Test Product");
        product.setDescription("Test Description");
        product.setCategory("test");
        product.setPrice(new BigDecimal("9.99"));
        product.setDiscountPercentage(new BigDecimal("10.0"));
        product.setRating(new BigDecimal("4.5"));
        product.setStock(100);
        product.setTags(List.of("tag1", "tag2"));
        product.setBrand("Test Brand");
        product.setSku("TEST-001");
        product.setWeight(5);
        product.setWarrantyInformation("1 year warranty");
        product.setShippingInformation("Ships in 1-2 days");
        product.setAvailabilityStatus("In Stock");
        product.setReturnPolicy("30 days return");
        product.setMinimumOrderQuantity(1);
        product.setImages(List.of("image1.jpg", "image2.jpg"));
        product.setThumbnail("thumbnail.jpg");

        // Set dimensions
        ExternalDimensions dimensions = new ExternalDimensions();
        dimensions.setWidth(new BigDecimal("10.0"));
        dimensions.setHeight(new BigDecimal("20.0"));
        dimensions.setDepth(new BigDecimal("30.0"));
        product.setDimensions(dimensions);

        // Set meta
        ExternalMeta meta = new ExternalMeta();
        meta.setCreatedAt(LocalDateTime.now());
        meta.setUpdatedAt(LocalDateTime.now());
        meta.setBarcode("123456789");
        meta.setQrCode("qr-code-url");
        product.setMeta(meta);

        // Set reviews
        ExternalReview review = new ExternalReview();
        review.setRating(5);
        review.setComment("Great product!");
        review.setDate(LocalDateTime.now());
        review.setReviewerName("John Doe");
        review.setReviewerEmail("john@example.com");
        product.setReviews(List.of(review));

        return product;
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
}
