package com.productapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration for OpenAPI documentation.
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.port}")
    private String serverPort;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort + contextPath)
                                .description("Development server"),
                        new Server()
                                .url("https://api.productapi.com" + contextPath)
                                .description("Production server")
                ))
                .info(new Info()
                        .title("Product Orchestration API")
                        .description("""
                                RESTful API for loading and searching product data from external sources.
                                
                                ## Features
                                - Load product data from external APIs into in-memory H2 database
                                - Full-text search on product title and description using Hibernate Search
                                - Find products by ID or SKU
                                - Resilient external API calls with circuit breaker and retry patterns
                                - Comprehensive error handling and validation
                                - Real-time loading status and progress tracking
                                
                                ## Getting Started
                                1. Load data from external API: `POST /data/load`
                                2. Search products: `GET /products/search?q=your-search-term`
                                3. Get product by ID: `GET /products/{id}`
                                4. Get product by SKU: `GET /products/sku/{sku}`
                                
                                ## External Data Source
                                This API loads product data from [DummyJSON Products API](https://dummyjson.com/products).
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Product API Team")
                                .email("support@productapi.com")
                                .url("https://github.com/productapi/product-orchestration-api"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
