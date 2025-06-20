package com.productapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Main application class for Product Orchestration API.
 *
 * This application provides RESTful endpoints to:
 * - Load product data from external APIs into in-memory H2 database
 * - Search products using free text search on title and description
 * - Find products by ID or SKU
 *
 * Features:
 * - Resilient external API calls with circuit breaker and retry
 * - Full-text search using Hibernate Search with Lucene
 * - Comprehensive API documentation with OpenAPI/Swagger
 * - Clean architecture with proper exception handling
 * - Extensive test coverage
 *
 * @author Product API Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaRepositories
public class ProductOrchestrationApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductOrchestrationApiApplication.class, args);
    }
}
