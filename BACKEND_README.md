# 🔧 Product Search API - Backend

A comprehensive Spring Boot REST API for product search and management with full-text search capabilities, external data integration, and robust error handling.

## 🎯 Overview

This backend service provides a complete product management system with advanced search functionality, data loading from external APIs, and a clean, scalable architecture following Spring Boot best practices.

## ✨ Key Features

- **🔍 Advanced Search**: Full-text search using Hibernate Search with Lucene backend
- **📊 Product Management**: Complete CRUD operations for products
- **🔄 Data Integration**: Load products from external APIs (DummyJSON)
- **📄 Pagination**: Efficient pagination for large datasets
- **🛡️ Resilient APIs**: Circuit breaker, retry, and timeout patterns
- **📚 API Documentation**: Comprehensive OpenAPI/Swagger documentation
- **🏗️ Clean Architecture**: Modular design with proper separation of concerns
- **🔐 CORS Support**: Configured for cross-origin requests
- **⚡ Performance**: Optimized queries and caching strategies

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Java Version**: 17+
- **Database**: H2 (In-Memory)
- **Search Engine**: Hibernate Search + Lucene
- **HTTP Client**: WebClient (Spring WebFlux)
- **Resilience**: Resilience4j (Circuit Breaker, Retry, Timeout)
- **Documentation**: OpenAPI 3 (Swagger)
- **Testing**: JUnit 5, Mockito
- **Build Tool**: Maven

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │    Services     │    │  Repositories   │
│                 │    │                 │    │                 │
│ • ProductCtrl   │───▶│ • ProductSvc    │───▶│ • ProductRepo   │
│ • DataLoadCtrl  │    │ • DataLoadSvc   │    │ • SearchRepo    │
│                 │    │ • ExternalAPI   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   H2 Database   │
                       │  (In-Memory)    │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   External API  │
                       │  (DummyJSON)    │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Maven 3.6** or higher

### Installation & Setup

1. **Clone and navigate to project**
   ```bash
   git clone <repository-url>
   cd product-search-application
   ```

2. **Build the application**
   ```bash
   ./mvnw clean compile
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Verify the application is running**
   ```bash
   curl http://localhost:8080/api/v1/actuator/health
   ```

5. **Load sample data**
   ```bash
   curl -X POST http://localhost:8080/api/v1/data/load
   ```

### 🎯 Application URLs
- **API Base**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **API Docs**: http://localhost:8080/api/v1/api-docs
- **H2 Console**: http://localhost:8080/api/v1/h2-console
- **Health Check**: http://localhost:8080/api/v1/actuator/health

## 📡 API Endpoints

### Product Operations
```bash
# Get all products with pagination
GET /api/v1/products?page=0&size=12&sortBy=title&sortDir=asc

# Search products by text
GET /api/v1/products/search?q=laptop&page=0&size=10

# Get product by ID
GET /api/v1/products/{id}

# Get product by external ID
GET /api/v1/products/external/{externalId}

# Get product by SKU
GET /api/v1/products/sku/{sku}

# Get products by category
GET /api/v1/products/category/{category}

# Get products by brand
GET /api/v1/products/brand/{brand}

# Get all categories
GET /api/v1/products/categories

# Get all brands
GET /api/v1/products/brands

# Get search suggestions
GET /api/v1/products/suggestions?q=lap
```

### Data Management
```bash
# Load all products from external API
POST /api/v1/data/load

# Load specific product by external ID
POST /api/v1/data/load/{externalId}

# Get loading status and progress
GET /api/v1/data/status

# Clear all products from database
DELETE /api/v1/data/clear

# Check external API availability
GET /api/v1/data/api-status

# Rebuild search index
POST /api/v1/data/rebuild-index
```

## 🔧 Configuration

### Application Properties (application.yml)
```yaml
# Server Configuration
server:
  port: 8080
  servlet:
    context-path: /api/v1

# Database Configuration
spring:
  datasource:
    url: jdbc:h2:mem:productdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  
  # JPA Configuration
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        search:
          backend:
            type: lucene
            directory:
              type: local-filesystem
              root: target/lucene-indexes

# External API Configuration
external:
  api:
    products:
      base-url: https://dummyjson.com
      timeout:
        connect: 5000
        read: 10000

# Resilience4j Configuration
resilience4j:
  circuitbreaker:
    instances:
      external-api:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 5s
        sliding-window-size: 10
```

### Environment Variables
Override configuration using environment variables:
- `EXTERNAL_API_BASE_URL` - External API base URL
- `EXTERNAL_API_TIMEOUT_CONNECT` - Connection timeout (ms)
- `EXTERNAL_API_TIMEOUT_READ` - Read timeout (ms)
- `SERVER_PORT` - Server port (default: 8080)

## 🔍 Search Implementation

### Hibernate Search Configuration
```java
@Entity
@Indexed
public class Product {
    @FullTextField(analyzer = "standard")
    @KeywordField(name = "title_sort", sortable = Sortable.YES)
    private String title;
    
    @FullTextField
    private String description;
    
    @KeywordField
    private String category;
    
    @KeywordField
    private String brand;
}
```

### Search Features
- **Full-Text Search**: Search across title and description
- **Fuzzy Matching**: Handle typos and similar words
- **Wildcard Search**: Partial word matching
- **Boosted Fields**: Title matches have higher relevance
- **Category/Brand Filtering**: Combined text search with filters
- **Auto-Suggestions**: Real-time search suggestions
- **Sorting**: By relevance, title, price, rating
- **Pagination**: Configurable page size with limits

## 🚨 Error Handling

### Global Exception Handler
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleProductNotFound(ProductNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("Product not found: " + e.getMessage()));
    }
    
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleExternalApiException(ExternalApiException e) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
            .body(ApiResponse.error("External API error: " + e.getMessage()));
    }
}
```

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Product not found with ID: 123",
  "data": null,
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/v1/products/123"
}
```

## 🔄 Resilience Patterns

### Circuit Breaker Configuration
- **Failure Threshold**: 50%
- **Open State Duration**: 5 seconds
- **Sliding Window Size**: 10 calls

### Retry Policy
- **Max Attempts**: 3
- **Delay**: 1 second
- **Exponential Backoff**: 2x multiplier

### Timeout Configuration
- **Connect Timeout**: 5 seconds
- **Read Timeout**: 10 seconds

## 🧪 Testing

### Run Tests
```bash
# Run all tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report

# Run specific test class
./mvnw test -Dtest=ProductServiceTest
```

### Test Categories
- **Unit Tests**: Service layer and utility classes
- **Integration Tests**: Repository layer with H2 database
- **Controller Tests**: REST endpoint testing with MockMvc
- **External API Tests**: Mocked external API interactions

## 📊 Performance Considerations

### Database Optimization
- **Batch Processing**: Products loaded in batches of 50
- **Index Strategy**: Optimized JPA indexes for common queries
- **Connection Pooling**: HikariCP for efficient connection management

### Search Optimization
- **Index Rebuilding**: Automatic after bulk data loading
- **Query Optimization**: Efficient Lucene queries with proper boosting
- **Pagination**: Limit maximum page size to prevent memory issues

## 🔐 Security Features

### Input Validation
- **Parameter Validation**: All input parameters validated
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **XSS Prevention**: Proper input sanitization

### CORS Configuration
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
```

## 🚀 Deployment

### Production Build
```bash
# Create JAR file
./mvnw clean package

# Run JAR file
java -jar target/product-api-1.0.0.jar
```

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/product-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 📈 Monitoring & Health

### Actuator Endpoints
- `GET /actuator/health` - Application health status
- `GET /actuator/info` - Application information
- `GET /actuator/metrics` - Application metrics

### Database Console Access
- **URL**: http://localhost:8080/api/v1/h2-console
- **JDBC URL**: `jdbc:h2:mem:productdb`
- **Username**: `sa`
- **Password**: `password`

## 🎯 Key Implementation Highlights

### Clean Architecture
- **Controller-Service-Repository** pattern
- **DTO pattern** for API data transfer
- **Configuration classes** for modular setup
- **Exception handling** with custom exceptions

### Best Practices Applied
- **Input validation** with Bean Validation
- **Comprehensive logging** with SLF4J
- **Proper HTTP status codes**
- **RESTful API design principles**
- **Separation of concerns**

This backend demonstrates production-ready Spring Boot development with modern practices, comprehensive error handling, and scalable architecture suitable for enterprise applications.
