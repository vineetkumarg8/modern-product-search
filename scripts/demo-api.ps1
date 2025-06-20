# Product Orchestration API Demo Script (PowerShell)
# This script demonstrates the key features of the API

$BaseUrl = "http://localhost:8080/api/v1"

Write-Host "🚀 Product Orchestration API Demo" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

# Function to make HTTP requests with proper formatting
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description
    )
    
    Write-Host "📍 $Description" -ForegroundColor Cyan
    Write-Host "   $Method $Endpoint" -ForegroundColor Gray
    Write-Host ""
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl$Endpoint" -Method $Method -ErrorAction Stop
        $response | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor Gray
    Write-Host ""
}

# Check if API is running
Write-Host "🔍 Checking if API is running..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$BaseUrl/actuator/health" -Method GET -ErrorAction Stop | Out-Null
    Write-Host "✅ API is running!" -ForegroundColor Green
}
catch {
    Write-Host "❌ API is not running. Please start the application first:" -ForegroundColor Red
    Write-Host "   mvn spring-boot:run" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# 1. Check external API availability
Invoke-ApiRequest -Method "GET" -Endpoint "/data/api-status" -Description "Check external API availability"

# 2. Load data from external API
Invoke-ApiRequest -Method "POST" -Endpoint "/data/load" -Description "Load all products from external API"

# Wait a moment for data loading to complete
Write-Host "⏳ Waiting for data loading to complete..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host ""

# 3. Check loading status
Invoke-ApiRequest -Method "GET" -Endpoint "/data/status" -Description "Check data loading status"

# 4. Search products
Invoke-ApiRequest -Method "GET" -Endpoint "/products/search?q=mascara&page=0&size=5" -Description "Search for 'mascara' products"

# 5. Search with fuzzy matching
Invoke-ApiRequest -Method "GET" -Endpoint "/products/search?q=mascare&fuzzy=true&page=0&size=3" -Description "Fuzzy search for 'mascare' (typo)"

# 6. Get product by ID
Invoke-ApiRequest -Method "GET" -Endpoint "/products/1" -Description "Get product by internal ID"

# 7. Get product by external ID
Invoke-ApiRequest -Method "GET" -Endpoint "/products/external/1" -Description "Get product by external ID"

# 8. Get product by SKU
Invoke-ApiRequest -Method "GET" -Endpoint "/products/sku/BEA-ESS-ESS-001" -Description "Get product by SKU"

# 9. Get products by category
Invoke-ApiRequest -Method "GET" -Endpoint "/products/category/beauty?page=0&size=3" -Description "Get beauty products"

# 10. Get products by brand
Invoke-ApiRequest -Method "GET" -Endpoint "/products/brand/Essence?page=0&size=3" -Description "Get Essence brand products"

# 11. Get all categories
Invoke-ApiRequest -Method "GET" -Endpoint "/products/categories" -Description "Get all available categories"

# 12. Get all brands
Invoke-ApiRequest -Method "GET" -Endpoint "/products/brands" -Description "Get all available brands"

# 13. Get search suggestions
Invoke-ApiRequest -Method "GET" -Endpoint "/products/suggestions?q=lip&limit=5" -Description "Get search suggestions for 'lip'"

# 14. Get all products with pagination
Invoke-ApiRequest -Method "GET" -Endpoint "/products?page=0&size=5&sort=title&direction=asc" -Description "Get all products (first 5, sorted by title)"

# 15. Advanced search with sorting
Invoke-ApiRequest -Method "GET" -Endpoint "/products/search?q=beauty&page=0&size=5&sort=price&direction=desc" -Description "Search 'beauty' products sorted by price (desc)"

Write-Host "🎉 Demo completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Additional endpoints to explore:" -ForegroundColor Cyan
Write-Host "   • Swagger UI: $BaseUrl/swagger-ui.html" -ForegroundColor Gray
Write-Host "   • H2 Console: $BaseUrl/h2-console" -ForegroundColor Gray
Write-Host "   • Health Check: $BaseUrl/actuator/health" -ForegroundColor Gray
Write-Host "   • API Docs: $BaseUrl/api-docs" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Management operations:" -ForegroundColor Cyan
Write-Host "   • Clear all data: Invoke-RestMethod -Uri '$BaseUrl/data/clear' -Method DELETE" -ForegroundColor Gray
Write-Host "   • Rebuild search index: Invoke-RestMethod -Uri '$BaseUrl/data/rebuild-index' -Method POST" -ForegroundColor Gray
Write-Host "   • Load specific product: Invoke-RestMethod -Uri '$BaseUrl/data/load/1' -Method POST" -ForegroundColor Gray
