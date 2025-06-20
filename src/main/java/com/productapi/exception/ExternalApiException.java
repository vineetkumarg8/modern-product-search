package com.productapi.exception;

/**
 * Exception thrown when external API calls fail.
 */
public class ExternalApiException extends RuntimeException {

    private final String apiUrl;
    private final int statusCode;

    public ExternalApiException(String message) {
        super(message);
        this.apiUrl = null;
        this.statusCode = -1;
    }

    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
        this.apiUrl = null;
        this.statusCode = -1;
    }

    public ExternalApiException(String message, String apiUrl, int statusCode) {
        super(message);
        this.apiUrl = apiUrl;
        this.statusCode = statusCode;
    }

    public ExternalApiException(String message, String apiUrl, int statusCode, Throwable cause) {
        super(message, cause);
        this.apiUrl = apiUrl;
        this.statusCode = statusCode;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public static ExternalApiException timeout(String apiUrl) {
        return new ExternalApiException("Request timeout while calling external API: " + apiUrl, apiUrl, -1);
    }

    public static ExternalApiException connectionError(String apiUrl, Throwable cause) {
        return new ExternalApiException("Connection error while calling external API: " + apiUrl, apiUrl, -1, cause);
    }

    public static ExternalApiException httpError(String apiUrl, int statusCode, String responseBody) {
        return new ExternalApiException(
                String.format("HTTP error %d while calling external API: %s. Response: %s", statusCode, apiUrl, responseBody),
                apiUrl, statusCode);
    }
}
