package com.productapi.service;

import com.productapi.dto.external.ExternalProductResponse;
import com.productapi.exception.ExternalApiException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;

/**
 * Service for making resilient calls to external APIs.
 * Implements circuit breaker, retry, and timeout patterns.
 */
@Service
public class ExternalApiService {

    private static final Logger logger = LoggerFactory.getLogger(ExternalApiService.class);

    private final WebClient webClient;
    private final String baseUrl;
    private final String allProductsEndpoint;
    private final String productByIdEndpoint;
    private final Duration connectTimeout;
    private final Duration readTimeout;

    public ExternalApiService(
            WebClient.Builder webClientBuilder,
            @Value("${external.api.products.base-url}") String baseUrl,
            @Value("${external.api.products.endpoints.all-products}") String allProductsEndpoint,
            @Value("${external.api.products.endpoints.product-by-id}") String productByIdEndpoint,
            @Value("${external.api.products.timeout.connect}") long connectTimeoutMs,
            @Value("${external.api.products.timeout.read}") long readTimeoutMs) {
        
        this.baseUrl = baseUrl;
        this.allProductsEndpoint = allProductsEndpoint;
        this.productByIdEndpoint = productByIdEndpoint;
        this.connectTimeout = Duration.ofMillis(connectTimeoutMs);
        this.readTimeout = Duration.ofMillis(readTimeoutMs);
        
        this.webClient = webClientBuilder
                .baseUrl(baseUrl)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
                .build();
        
        logger.info("ExternalApiService initialized with base URL: {}", baseUrl);
    }

    /**
     * Fetch all products from external API.
     * Applies circuit breaker, retry, and timeout patterns.
     *
     * @return CompletableFuture containing the external product response
     */
    @CircuitBreaker(name = "external-api", fallbackMethod = "fallbackGetAllProducts")
    @Retry(name = "external-api")
    @TimeLimiter(name = "external-api")
    public CompletableFuture<ExternalProductResponse> getAllProducts() {
        logger.debug("Fetching all products from external API: {}{}", baseUrl, allProductsEndpoint);
        
        return webClient.get()
                .uri(allProductsEndpoint)
                .retrieve()
                .bodyToMono(ExternalProductResponse.class)
                .timeout(readTimeout)
                .doOnSuccess(response -> logger.info("Successfully fetched {} products from external API", 
                        response != null ? response.getTotal() : 0))
                .doOnError(error -> logger.error("Error fetching products from external API", error))
                .onErrorMap(WebClientRequestException.class, this::mapRequestException)
                .onErrorMap(WebClientResponseException.class, this::mapResponseException)
                .toFuture();
    }

    /**
     * Fetch a specific product by ID from external API.
     * Applies circuit breaker, retry, and timeout patterns.
     *
     * @param productId the product ID to fetch
     * @return CompletableFuture containing the external product response
     */
    @CircuitBreaker(name = "external-api", fallbackMethod = "fallbackGetProductById")
    @Retry(name = "external-api")
    @TimeLimiter(name = "external-api")
    public CompletableFuture<ExternalProductResponse.ExternalProduct> getProductById(Long productId) {
        logger.debug("Fetching product {} from external API", productId);
        
        String uri = productByIdEndpoint.replace("{id}", productId.toString());
        
        return webClient.get()
                .uri(uri)
                .retrieve()
                .bodyToMono(ExternalProductResponse.ExternalProduct.class)
                .timeout(readTimeout)
                .doOnSuccess(product -> logger.debug("Successfully fetched product {} from external API", productId))
                .doOnError(error -> logger.error("Error fetching product {} from external API", productId, error))
                .onErrorMap(WebClientRequestException.class, this::mapRequestException)
                .onErrorMap(WebClientResponseException.class, this::mapResponseException)
                .toFuture();
    }

    /**
     * Check if external API is available.
     *
     * @return CompletableFuture containing true if API is available, false otherwise
     */
    public CompletableFuture<Boolean> isApiAvailable() {
        logger.debug("Checking external API availability");
        
        return webClient.get()
                .uri("/products?limit=1")
                .retrieve()
                .bodyToMono(String.class)
                .timeout(connectTimeout)
                .map(response -> true)
                .onErrorReturn(false)
                .doOnNext(available -> logger.debug("External API availability: {}", available))
                .toFuture();
    }

    /**
     * Fallback method for getAllProducts when circuit breaker is open.
     */
    public CompletableFuture<ExternalProductResponse> fallbackGetAllProducts(Exception ex) {
        logger.warn("Circuit breaker fallback triggered for getAllProducts: {}", ex.getMessage());
        return CompletableFuture.failedFuture(
                new ExternalApiException("External API is currently unavailable. Please try again later.", ex));
    }

    /**
     * Fallback method for getProductById when circuit breaker is open.
     */
    public CompletableFuture<ExternalProductResponse.ExternalProduct> fallbackGetProductById(Long productId, Exception ex) {
        logger.warn("Circuit breaker fallback triggered for getProductById({}): {}", productId, ex.getMessage());
        return CompletableFuture.failedFuture(
                new ExternalApiException("External API is currently unavailable. Please try again later.", ex));
    }

    /**
     * Map WebClientRequestException to ExternalApiException.
     */
    private ExternalApiException mapRequestException(WebClientRequestException ex) {
        String url = ex.getUri() != null ? ex.getUri().toString() : "unknown";
        return ExternalApiException.connectionError(url, ex);
    }

    /**
     * Map WebClientResponseException to ExternalApiException.
     */
    private ExternalApiException mapResponseException(WebClientResponseException ex) {
        String url = ex.getRequest() != null && ex.getRequest().getURI() != null 
                ? ex.getRequest().getURI().toString() : "unknown";
        String responseBody = ex.getResponseBodyAsString();
        return ExternalApiException.httpError(url, ex.getStatusCode().value(), responseBody);
    }
}
