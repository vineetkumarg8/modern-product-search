package com.productapi.controller;

import com.productapi.dto.response.PagedResponse;
import com.productapi.dto.response.ProductResponse;
import com.productapi.exception.ProductNotFoundException;
import com.productapi.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void searchProducts_ShouldReturnProducts() throws Exception {
        // Given
        ProductResponse product = createProductResponse();
        PagedResponse<ProductResponse> pagedResponse = new PagedResponse<>(
                List.of(product), 0, 20, 1, 1);
        
        when(productService.searchProducts(anyString(), any(Pageable.class)))
                .thenReturn(pagedResponse);

        // When & Then
        mockMvc.perform(get("/products/search")
                        .param("q", "test")
                        .param("page", "0")
                        .param("size", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content[0].title").value("Test Product"));
    }

    @Test
    void getProductById_ShouldReturnProduct() throws Exception {
        // Given
        ProductResponse product = createProductResponse();
        when(productService.findById(1L)).thenReturn(product);

        // When & Then
        mockMvc.perform(get("/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.title").value("Test Product"));
    }

    @Test
    void getProductById_ShouldReturn404WhenNotFound() throws Exception {
        // Given
        when(productService.findById(999L))
                .thenThrow(ProductNotFoundException.byId(999L));

        // When & Then
        mockMvc.perform(get("/products/999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void getProductBySku_ShouldReturnProduct() throws Exception {
        // Given
        ProductResponse product = createProductResponse();
        when(productService.findBySku("TEST-001")).thenReturn(product);

        // When & Then
        mockMvc.perform(get("/products/sku/TEST-001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.sku").value("TEST-001"));
    }

    @Test
    void getCategories_ShouldReturnCategories() throws Exception {
        // Given
        List<String> categories = List.of("beauty", "fragrances", "furniture");
        when(productService.getDistinctCategories()).thenReturn(categories);

        // When & Then
        mockMvc.perform(get("/products/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3));
    }

    @Test
    void searchProducts_WithInvalidPageSize_ShouldReturnBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(get("/products/search")
                        .param("q", "test")
                        .param("page", "0")
                        .param("size", "101") // Exceeds max size
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    private ProductResponse createProductResponse() {
        ProductResponse product = new ProductResponse();
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
