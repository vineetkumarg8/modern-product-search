# 🛍️ Modern Product Search

A modern full-stack web application for searching and browsing products with advanced filtering, sorting, and pagination capabilities. Built with Spring Boot backend and React frontend.

## 🎯 Overview

This application demonstrates modern full-stack development practices with a comprehensive product search system. Users can search through a product database with real-time filtering, responsive design, and optimized performance.

<img width="1920" height="1011" alt="Screenshot (299)" src="https://github.com/user-attachments/assets/292176dc-e597-4d8c-8552-6dc9aac00a10" />
<img width="1920" height="1011" alt="Screenshot (300)" src="https://github.com/user-attachments/assets/b63ba571-9f64-421b-aca9-41677322e44e" />
<img width="1920" height="1020" alt="Screenshot (301)" src="https://github.com/user-attachments/assets/96f405b7-d3db-4085-a243-344bda6fdb36" />

<img width="1916" height="1009" alt="Screenshot (304)" src="https://github.com/user-attachments/assets/e56a775d-a52e-4cce-9ae9-d3676fe20be5" />

<img width="1918" height="1013" alt="Screenshot (307)" src="https://github.com/user-attachments/assets/35b28f5e-6ffa-457d-ac94-cbda47a6bad3" />








## ✨ Key Features

### Frontend Features
- **🔍 Real-time Search**: Instant product search with debounced input
- **🎛️ Advanced Filtering**: Filter by category, brand, price range, and rating
- **📊 Flexible Sorting**: Sort by price, rating, name, or date
- **📱 Responsive Design**: Mobile-first approach with seamless desktop experience
- **⚡ Performance Optimized**: Lazy loading, pagination, and memoization
- **🎨 Modern UI**: Clean interface with styled-components and smooth animations

### Backend Features
- **🔄 Data Orchestration**: Load product data from external APIs into H2 database
- **🔍 Full-Text Search**: Advanced search using Hibernate Search with Lucene
- **🛡️ Resilient APIs**: Circuit breaker, retry, and timeout patterns
- **📚 API Documentation**: Comprehensive OpenAPI/Swagger documentation
- **🏗️ Clean Architecture**: Modular design with separation of concerns
- **🧪 Production Ready**: Proper logging, exception handling, and validation

## 🏗️ Full-Stack Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐          │
│  │   Pages     │  │ Components  │  │  Context        │          │
│  │ • HomePage  │  │• SearchBar  │  │•ProductSearch   │          │  
│  │ • SearchPage│  │• ProductGrid│  │•StateManagement │          │
│  └─────────────┘  └─────────────┘  └─────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
                            HTTP/REST
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (Spring Boot)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Controllers │  │  Services   │  │Repositories │              │
│  │•ProductCtrl │  │• ProductSvc │  │• ProductRepo│              │
│  │•DataLoadCtrl│  │• DataLoadSvc│  │• SearchRepo │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                │                                │
│                                ▼                                │
│                    ┌─────────────────┐                          │
│                    │   H2 Database   │                          │
│                    │   (In-Memory)   │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  External API   │
                       │  (DummyJSON)    │
                       └─────────────────┘
```

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: Spring Boot 3.2.1
- **Java Version**: 17+
- **Database**: H2 (In-Memory)
- **Search Engine**: Hibernate Search + Lucene
- **HTTP Client**: WebClient (Spring WebFlux)
- **Resilience**: Resilience4j (Circuit Breaker, Retry, Timeout)
- **Documentation**: OpenAPI 3 (Swagger)
- **Testing**: JUnit 5, Mockito
- **Build Tool**: Maven

### Frontend Technologies
- **Framework**: React 18 with TypeScript
- **State Management**: Context API
- **Styling**: Styled Components
- **HTTP Client**: Axios
- **Routing**: React Router
- **Build Tool**: Create React App
- **Package Manager**: npm

## � Quick Start

### Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **Maven 3.6** or higher

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd modern-product-search
```

#### 2. Backend Setup (Spring Boot)
```bash
# Start the backend server
./mvnw spring-boot:run

# Backend will be available at http://localhost:8080
```

#### 3. Frontend Setup (React)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend will be available at http://localhost:3000
```

#### 4. Load Sample Data
```bash
# Load products from external API
curl -X POST http://localhost:8080/api/v1/data/load
```

### 🎯 Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **API Documentation**: http://localhost:8080/api/v1/swagger-ui.html
- **H2 Database Console**: http://localhost:8080/api/v1/h2-console

### Quick Start Guide

#### Option 1: Using Build Scripts (Recommended)

**For Unix/Linux/macOS:**
```bash
# Make script executable
chmod +x scripts/build-and-run.sh

# Quick start (compile and run)
./scripts/build-and-run.sh quick-start

# Full build with tests
./scripts/build-and-run.sh full-build
```

**For Windows (PowerShell):**
```powershell
# Quick start (compile and run)
.\scripts\build-and-run.ps1 quick-start

# Full build with tests
.\scripts\build-and-run.ps1 full-build
```

#### Option 2: Manual Steps

1. **Build and run the application**
   ```bash
   mvn spring-boot:run
   ```

2. **Load data from external API**
   ```bash
   curl -X POST http://localhost:8080/api/v1/data/load
   ```

3. **Search products**
   ```bash
   curl "http://localhost:8080/api/v1/products/search?q=mascara"
   ```

4. **Get product by ID**
   ```bash
   curl http://localhost:8080/api/v1/products/1
   ```

5. **Get product by SKU**
   ```bash
   curl http://localhost:8080/api/v1/products/sku/BEA-ESS-ESS-001
   ```

#### Option 3: Docker Deployment

```bash
# Using Docker Compose (recommended)
docker-compose up --build

# Or using build script
./scripts/build-and-run.sh run-compose
```

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v1/api-docs

### Key Endpoints

#### Data Loading
- `POST /data/load` - Load all products from external API
- `POST /data/load/{externalId}` - Load specific product by external ID
- `GET /data/status` - Get loading status and progress
- `DELETE /data/clear` - Clear all products from database
- `GET /data/api-status` - Check external API availability
- `POST /data/rebuild-index` - Rebuild search index

#### Product Operations
- `GET /products/search?q={text}` - Search products by text
- `GET /products/{id}` - Get product by internal ID
- `GET /products/external/{externalId}` - Get product by external ID
- `GET /products/sku/{sku}` - Get product by SKU
- `GET /products` - Get all products (paginated)
- `GET /products/category/{category}` - Get products by category
- `GET /products/brand/{brand}` - Get products by brand
- `GET /products/suggestions?q={text}` - Get search suggestions
- `GET /products/categories` - Get all categories
- `GET /products/brands` - Get all brands

### Search Features

#### Basic Search
```bash
curl "http://localhost:8080/api/v1/products/search?q=mascara&page=0&size=10"
```

#### Fuzzy Search
```bash
curl "http://localhost:8080/api/v1/products/search?q=mascare&fuzzy=true"
```

#### Category Search
```bash
curl "http://localhost:8080/api/v1/products/category/beauty?page=0&size=20"
```

#### Search with Sorting
```bash
curl "http://localhost:8080/api/v1/products/search?q=beauty&sort=price&direction=desc"
```

## 🔧 Configuration

### Application Properties

Key configuration options in `application.yml`:

```yaml
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

# Search Configuration
spring:
  jpa:
    properties:
      hibernate:
        search:
          backend:
            type: lucene
```

### Environment Variables

You can override configuration using environment variables:

- `EXTERNAL_API_BASE_URL` - External API base URL
- `EXTERNAL_API_TIMEOUT_CONNECT` - Connection timeout in milliseconds
- `EXTERNAL_API_TIMEOUT_READ` - Read timeout in milliseconds

## 🧪 Testing

### Using Build Scripts

**Unix/Linux/macOS:**
```bash
# Run tests only
./scripts/build-and-run.sh test

# Run tests with coverage
./scripts/build-and-run.sh test-coverage
```

**Windows (PowerShell):**
```powershell
# Run tests only
.\scripts\build-and-run.ps1 test

# Run tests with coverage
.\scripts\build-and-run.ps1 test-coverage
```

### Manual Testing

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report
```

Coverage report will be available at `target/site/jacoco/index.html`

### Postman Testing

Import the Postman collection for comprehensive API testing:
1. Import `postman/Product-Orchestration-API.postman_collection.json`
2. Import environment: `postman/environments/Local.postman_environment.json`
3. Run the collection to test all endpoints

### Demo Script

Run the demo script to see all API features:

**Unix/Linux/macOS:**
```bash
chmod +x scripts/demo-api.sh
./scripts/demo-api.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\demo-api.ps1
```

### Test Categories

- **Unit Tests**: Service layer and utility classes
- **Integration Tests**: Repository layer with H2 database
- **Controller Tests**: REST endpoint testing with MockMvc
- **External API Tests**: Mocked external API interactions

## 📊 Monitoring and Health

### Health Endpoints
- `GET /actuator/health` - Application health status
- `GET /actuator/info` - Application information
- `GET /actuator/metrics` - Application metrics

### Database Console
- **H2 Console**: http://localhost:8080/api/v1/h2-console
  - JDBC URL: `jdbc:h2:mem:productdb`
  - Username: `sa`
  - Password: `password`

## 🔍 Search Implementation Details

### Hibernate Search Configuration

The application uses Hibernate Search with Lucene backend for full-text search:

- **Indexed Fields**: `title` (boosted), `description`, `category`, `brand`
- **Search Types**: Exact match, wildcard, fuzzy matching
- **Sorting**: By relevance score, title, price, rating
- **Pagination**: Configurable page size with limits

### Search Features

1. **Full-Text Search**: Search across title and description
2. **Fuzzy Matching**: Handle typos and similar words
3. **Wildcard Search**: Partial word matching
4. **Boosted Fields**: Title matches have higher relevance
5. **Category/Brand Filtering**: Combined text search with filters
6. **Auto-Suggestions**: Real-time search suggestions

## 🚨 Error Handling

### Global Exception Handling

The application provides comprehensive error handling:

- **ProductNotFoundException**: 404 - Product not found
- **ExternalApiException**: 502 - External API errors
- **DataLoadException**: 500 - Data loading errors
- **ValidationException**: 400 - Input validation errors

### Error Response Format

```json
{
  "status": "error",
  "message": "Product not found with ID: 123",
  "data": null,
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/v1/products/123"
}
```

## 🔄 Resilience Patterns

### Circuit Breaker
- **Failure Threshold**: 50%
- **Open State Duration**: 5 seconds
- **Half-Open Calls**: 3

### Retry Policy
- **Max Attempts**: 3
- **Delay**: 1 second
- **Exponential Backoff**: 2x multiplier

### Timeout Configuration
- **Connect Timeout**: 5 seconds
- **Read Timeout**: 10 seconds

## 📈 Performance Considerations

### Database Optimization
- **Batch Processing**: Products loaded in batches of 50
- **Index Strategy**: Optimized JPA indexes for common queries
- **Connection Pooling**: HikariCP for efficient connection management

### Search Optimization
- **Index Rebuilding**: Automatic after bulk data loading
- **Query Optimization**: Efficient Lucene queries with proper boosting
- **Pagination**: Limit maximum page size to prevent memory issues

### Caching Strategy
- **JPA Second-Level Cache**: Enabled for frequently accessed entities
- **Query Result Cache**: Cached search results for common queries

## 🔐 Security Considerations

### Input Validation
- **Parameter Validation**: All input parameters validated
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **XSS Prevention**: Proper input sanitization

### API Security
- **Rate Limiting**: Configurable request rate limits
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Security Headers**: Standard security headers included

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t product-orchestration-api .
   ```

2. **Run container**
   ```bash
   docker run -p 8080:8080 product-orchestration-api
   ```

### Production Configuration

For production deployment, consider:

- **External Database**: Replace H2 with PostgreSQL/MySQL
- **Persistent Search Index**: Use Elasticsearch instead of Lucene
- **Load Balancing**: Multiple application instances
- **Monitoring**: APM tools like New Relic or Datadog
- **Logging**: Centralized logging with ELK stack

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow clean code principles
- Write comprehensive tests
- Update documentation
- Use conventional commit messages
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [API Documentation](http://localhost:8080/api/v1/swagger-ui.html)
- **Issues**: [GitHub Issues](https://github.com/productapi/product-orchestration-api/issues)

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) for providing the external API
- [Spring Boot](https://spring.io/projects/spring-boot) for the excellent framework
- [Hibernate Search](https://hibernate.org/search/) for full-text search capabilities
- [Resilience4j](https://resilience4j.readme.io/) for resilience patterns
