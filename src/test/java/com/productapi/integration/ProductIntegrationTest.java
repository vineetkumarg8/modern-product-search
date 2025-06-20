package com.productapi.integration;

import com.productapi.entity.Product;
import com.productapi.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class ProductIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Create test data
        Product product1 = createProduct(1L, "Essence Mascara Lash Princess", 
                "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
                "beauty", "Essence", "BEA-ESS-ESS-001");
        
        Product product2 = createProduct(2L, "Eyeshadow Palette with Mirror", 
                "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks.",
                "beauty", "Glamour Beauty", "BEA-GLA-EYE-002");
        
        productRepository.save(product1);
        productRepository.save(product2);
    }

    @Test
    void searchProducts_ShouldReturnMatchingProducts() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/search")
                        .param("q", "mascara")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].title").value("Essence Mascara Lash Princess"))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }

    @Test
    void searchProducts_ShouldReturnAllProducts_WhenNoSearchText() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/search")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(2));
    }

    @Test
    void getProductById_ShouldReturnProduct() throws Exception {
        // Given
        Product savedProduct = productRepository.findByExternalId(1L).orElseThrow();

        // When & Then
        mockMvc.perform(get("/products/{id}", savedProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.title").value("Essence Mascara Lash Princess"))
                .andExpect(jsonPath("$.data.externalId").value(1));
    }

    @Test
    void getProductByExternalId_ShouldReturnProduct() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/external/{externalId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.title").value("Essence Mascara Lash Princess"))
                .andExpect(jsonPath("$.data.externalId").value(1));
    }

    @Test
    void getProductBySku_ShouldReturnProduct() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/sku/{sku}", "BEA-ESS-ESS-001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.title").value("Essence Mascara Lash Princess"))
                .andExpect(jsonPath("$.data.sku").value("BEA-ESS-ESS-001"));
    }

    @Test
    void getProductsByCategory_ShouldReturnCategoryProducts() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/category/{category}", "beauty")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(2));
    }

    @Test
    void getProductsByBrand_ShouldReturnBrandProducts() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/brand/{brand}", "Essence")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.content[0].brand").value("Essence"));
    }

    @Test
    void getAllProducts_ShouldReturnPaginatedProducts() throws Exception {
        // When & Then
        mockMvc.perform(get("/products")
                        .param("page", "0")
                        .param("size", "1")
                        .param("sort", "title")
                        .param("direction", "asc")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content.length()").value(1))
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.totalPages").value(2))
                .andExpect(jsonPath("$.data.first").value(true))
                .andExpect(jsonPath("$.data.last").value(false));
    }

    @Test
    void getCategories_ShouldReturnDistinctCategories() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0]").value("beauty"));
    }

    @Test
    void getBrands_ShouldReturnDistinctBrands() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/brands")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void getProduct_ShouldReturn404_WhenProductNotFound() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Product not found with ID: 999"));
    }

    @Test
    void getProductBySku_ShouldReturn404_WhenSkuNotFound() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/sku/{sku}", "NON-EXISTENT")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Product not found with SKU: NON-EXISTENT"));
    }

    private Product createProduct(Long externalId, String title, String description, 
                                 String category, String brand, String sku) {
        Product product = new Product();
        product.setExternalId(externalId);
        product.setTitle(title);
        product.setDescription(description);
        product.setCategory(category);
        product.setBrand(brand);
        product.setSku(sku);
        product.setPrice(new BigDecimal("9.99"));
        product.setStock(100);
        product.setAvailabilityStatus("In Stock");
        return product;
    }
}
