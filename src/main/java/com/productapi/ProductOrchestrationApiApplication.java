package com.productapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main application class for Modern Product Search.
 *
 * This modern application provides advanced RESTful endpoints to:
 * - Load product data from external APIs into in-memory H2 database
 * - Advanced product search with full-text search capabilities
 * - Find products by ID, SKU, category, and brand
 * - Real-time search suggestions and filtering
 *
 * Features:
 * - Resilient external API calls with circuit breaker and retry
 * - Full-text search using Hibernate Search with Lucene
 * - Comprehensive API documentation with OpenAPI/Swagger
 * - Clean architecture with proper exception handling
 * - Extensive test coverage
 * - Modern React frontend integration
 *
 * @author Modern Product Search Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaRepositories
public class ProductOrchestrationApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductOrchestrationApiApplication.class, args);
    }
}
