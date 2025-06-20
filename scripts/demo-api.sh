#!/bin/bash

# Product Orchestration API Demo Script
# This script demonstrates the key features of the API

BASE_URL="http://localhost:8080/api/v1"

echo "🚀 Product Orchestration API Demo"
echo "=================================="
echo ""

# Function to make HTTP requests with proper formatting
make_request() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo "📍 $description"
    echo "   $method $endpoint"
    echo ""
    
    if [ "$method" = "GET" ]; then
        curl -s -X GET "$BASE_URL$endpoint" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL$endpoint"
    elif [ "$method" = "POST" ]; then
        curl -s -X POST "$BASE_URL$endpoint" | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL$endpoint"
    elif [ "$method" = "DELETE" ]; then
        curl -s -X DELETE "$BASE_URL$endpoint" | jq '.' 2>/dev/null || curl -s -X DELETE "$BASE_URL$endpoint"
    fi
    
    echo ""
    echo "----------------------------------------"
    echo ""
}

# Check if API is running
echo "🔍 Checking if API is running..."
if ! curl -s "$BASE_URL/actuator/health" > /dev/null; then
    echo "❌ API is not running. Please start the application first:"
    echo "   mvn spring-boot:run"
    exit 1
fi
echo "✅ API is running!"
echo ""

# 1. Check external API availability
make_request "GET" "/data/api-status" "Check external API availability"

# 2. Load data from external API
make_request "POST" "/data/load" "Load all products from external API"

# Wait a moment for data loading to complete
echo "⏳ Waiting for data loading to complete..."
sleep 5
echo ""

# 3. Check loading status
make_request "GET" "/data/status" "Check data loading status"

# 4. Search products
make_request "GET" "/products/search?q=mascara&page=0&size=5" "Search for 'mascara' products"

# 5. Search with fuzzy matching
make_request "GET" "/products/search?q=mascare&fuzzy=true&page=0&size=3" "Fuzzy search for 'mascare' (typo)"

# 6. Get product by ID
make_request "GET" "/products/1" "Get product by internal ID"

# 7. Get product by external ID
make_request "GET" "/products/external/1" "Get product by external ID"

# 8. Get product by SKU
make_request "GET" "/products/sku/BEA-ESS-ESS-001" "Get product by SKU"

# 9. Get products by category
make_request "GET" "/products/category/beauty?page=0&size=3" "Get beauty products"

# 10. Get products by brand
make_request "GET" "/products/brand/Essence?page=0&size=3" "Get Essence brand products"

# 11. Get all categories
make_request "GET" "/products/categories" "Get all available categories"

# 12. Get all brands
make_request "GET" "/products/brands" "Get all available brands"

# 13. Get search suggestions
make_request "GET" "/products/suggestions?q=lip&limit=5" "Get search suggestions for 'lip'"

# 14. Get all products with pagination
make_request "GET" "/products?page=0&size=5&sort=title&direction=asc" "Get all products (first 5, sorted by title)"

# 15. Advanced search with sorting
make_request "GET" "/products/search?q=beauty&page=0&size=5&sort=price&direction=desc" "Search 'beauty' products sorted by price (desc)"

echo "🎉 Demo completed!"
echo ""
echo "📚 Additional endpoints to explore:"
echo "   • Swagger UI: $BASE_URL/swagger-ui.html"
echo "   • H2 Console: $BASE_URL/h2-console"
echo "   • Health Check: $BASE_URL/actuator/health"
echo "   • API Docs: $BASE_URL/api-docs"
echo ""
echo "🔧 Management operations:"
echo "   • Clear all data: curl -X DELETE $BASE_URL/data/clear"
echo "   • Rebuild search index: curl -X POST $BASE_URL/data/rebuild-index"
echo "   • Load specific product: curl -X POST $BASE_URL/data/load/1"
