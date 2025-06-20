package com.productapi.service;

import com.productapi.dto.external.ExternalProductResponse;
import com.productapi.exception.ExternalApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.net.URI;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExternalApiServiceTest {

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    private ExternalApiService externalApiService;

    @BeforeEach
    void setUp() {
        // Create service with mocked WebClient
        externalApiService = new ExternalApiService(
                WebClient.builder(),
                "https://dummyjson.com",
                "/products?limit=0",
                "/products/{id}",
                5000L,
                10000L
        );
        
        // Use reflection to set the mocked WebClient
        try {
            var field = ExternalApiService.class.getDeclaredField("webClient");
            field.setAccessible(true);
            field.set(externalApiService, webClient);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void getAllProducts_ShouldReturnProducts_WhenApiCallSucceeds() {
        // Given
        ExternalProductResponse expectedResponse = createExternalProductResponse();
        
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(ExternalProductResponse.class))
                .thenReturn(Mono.just(expectedResponse));

        // When
        CompletableFuture<ExternalProductResponse> result = externalApiService.getAllProducts();

        // Then
        assertThat(result).succeedsWithin(java.time.Duration.ofSeconds(5));
        ExternalProductResponse response = result.join();
        assertThat(response).isNotNull();
        assertThat(response.getProducts()).hasSize(1);
        assertThat(response.getTotal()).isEqualTo(1);
    }

    @Test
    void getAllProducts_ShouldThrowException_WhenApiCallFails() {
        // Given
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(ExternalProductResponse.class))
                .thenReturn(Mono.error(new WebClientRequestException(
                        new RuntimeException("Connection failed"),
                        org.springframework.http.HttpMethod.GET,
                        URI.create("https://dummyjson.com/products"),
                        null)));

        // When
        CompletableFuture<ExternalProductResponse> result = externalApiService.getAllProducts();

        // Then
        assertThat(result).failsWithin(java.time.Duration.ofSeconds(5))
                .withThrowableOfType(java.util.concurrent.ExecutionException.class)
                .withCauseInstanceOf(ExternalApiException.class);
    }

    @Test
    void getProductById_ShouldReturnProduct_WhenApiCallSucceeds() {
        // Given
        Long productId = 1L;
        ExternalProductResponse.ExternalProduct expectedProduct = createExternalProduct();
        
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(ExternalProductResponse.ExternalProduct.class))
                .thenReturn(Mono.just(expectedProduct));

        // When
        CompletableFuture<ExternalProductResponse.ExternalProduct> result = 
                externalApiService.getProductById(productId);

        // Then
        assertThat(result).succeedsWithin(java.time.Duration.ofSeconds(5));
        ExternalProductResponse.ExternalProduct product = result.join();
        assertThat(product).isNotNull();
        assertThat(product.getId()).isEqualTo(productId);
        assertThat(product.getTitle()).isEqualTo("Test Product");
    }

    @Test
    void getProductById_ShouldThrowException_WhenProductNotFound() {
        // Given
        Long productId = 999L;
        
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(ExternalProductResponse.ExternalProduct.class))
                .thenReturn(Mono.error(WebClientResponseException.create(
                        404, "Not Found", null, null, null)));

        // When
        CompletableFuture<ExternalProductResponse.ExternalProduct> result = 
                externalApiService.getProductById(productId);

        // Then
        assertThat(result).failsWithin(java.time.Duration.ofSeconds(5))
                .withThrowableOfType(java.util.concurrent.ExecutionException.class)
                .withCauseInstanceOf(ExternalApiException.class);
    }

    @Test
    void isApiAvailable_ShouldReturnTrue_WhenApiIsReachable() {
        // Given
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class))
                .thenReturn(Mono.just("API is available"));

        // When
        CompletableFuture<Boolean> result = externalApiService.isApiAvailable();

        // Then
        assertThat(result).succeedsWithin(java.time.Duration.ofSeconds(5));
        Boolean isAvailable = result.join();
        assertThat(isAvailable).isTrue();
    }

    @Test
    void isApiAvailable_ShouldReturnFalse_WhenApiIsNotReachable() {
        // Given
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(String.class))
                .thenReturn(Mono.error(new WebClientRequestException(
                        new RuntimeException("Connection failed"),
                        org.springframework.http.HttpMethod.GET,
                        URI.create("https://dummyjson.com/products"),
                        null)));

        // When
        CompletableFuture<Boolean> result = externalApiService.isApiAvailable();

        // Then
        assertThat(result).succeedsWithin(java.time.Duration.ofSeconds(5));
        Boolean isAvailable = result.join();
        assertThat(isAvailable).isFalse();
    }

    @Test
    void fallbackGetAllProducts_ShouldReturnFailedFuture() {
        // Given
        Exception exception = new RuntimeException("Circuit breaker open");

        // When
        CompletableFuture<ExternalProductResponse> result = 
                externalApiService.fallbackGetAllProducts(exception);

        // Then
        assertThat(result).failsWithin(java.time.Duration.ofSeconds(1))
                .withThrowableOfType(java.util.concurrent.ExecutionException.class)
                .withCauseInstanceOf(ExternalApiException.class)
                .withMessageContaining("External API is currently unavailable");
    }

    @Test
    void fallbackGetProductById_ShouldReturnFailedFuture() {
        // Given
        Long productId = 1L;
        Exception exception = new RuntimeException("Circuit breaker open");

        // When
        CompletableFuture<ExternalProductResponse.ExternalProduct> result = 
                externalApiService.fallbackGetProductById(productId, exception);

        // Then
        assertThat(result).failsWithin(java.time.Duration.ofSeconds(1))
                .withThrowableOfType(java.util.concurrent.ExecutionException.class)
                .withCauseInstanceOf(ExternalApiException.class)
                .withMessageContaining("External API is currently unavailable");
    }

    private ExternalProductResponse createExternalProductResponse() {
        ExternalProductResponse response = new ExternalProductResponse();
        response.setProducts(List.of(createExternalProduct()));
        response.setTotal(1);
        response.setSkip(0);
        response.setLimit(1);
        return response;
    }

    private ExternalProductResponse.ExternalProduct createExternalProduct() {
        ExternalProductResponse.ExternalProduct product = new ExternalProductResponse.ExternalProduct();
        product.setId(1L);
        product.setTitle("Test Product");
        product.setDescription("Test Description");
        product.setCategory("test");
        product.setBrand("Test Brand");
        product.setSku("TEST-001");
        return product;
    }
}
