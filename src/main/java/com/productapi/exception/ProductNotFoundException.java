package com.productapi.exception;

/**
 * Exception thrown when a product is not found.
 */
public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(String message) {
        super(message);
    }

    public ProductNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public static ProductNotFoundException byId(Long id) {
        return new ProductNotFoundException("Product not found with ID: " + id);
    }

    public static ProductNotFoundException byExternalId(Long externalId) {
        return new ProductNotFoundException("Product not found with external ID: " + externalId);
    }

    public static ProductNotFoundException bySku(String sku) {
        return new ProductNotFoundException("Product not found with SKU: " + sku);
    }
}
