package com.productapi.exception;

/**
 * Exception thrown when data loading operations fail.
 */
public class DataLoadException extends RuntimeException {

    public DataLoadException(String message) {
        super(message);
    }

    public DataLoadException(String message, Throwable cause) {
        super(message, cause);
    }

    public static DataLoadException indexRebuildFailed(Throwable cause) {
        return new DataLoadException("Failed to rebuild search index", cause);
    }

    public static DataLoadException productMappingFailed(Long externalId, Throwable cause) {
        return new DataLoadException("Failed to map product with external ID: " + externalId, cause);
    }

    public static DataLoadException batchSaveFailed(int batchSize, Throwable cause) {
        return new DataLoadException("Failed to save batch of " + batchSize + " products", cause);
    }
}
