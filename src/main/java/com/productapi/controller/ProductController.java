package com.productapi.controller;

import com.productapi.dto.response.ApiResponse;
import com.productapi.dto.response.PagedResponse;
import com.productapi.dto.response.ProductResponse;
import com.productapi.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for product operations.
 * Provides endpoints for searching and retrieving product data.
 */
@RestController
@RequestMapping("/api/v1/products")
@Validated
@Tag(name = "Products", description = "Operations for searching and retrieving product data")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Search products using free text search.
     */
    @GetMapping("/search")
    @Operation(
            summary = "Search products by text",
            description = "Search products using free text search on title and description fields. " +
                         "Supports pagination and sorting. If no search text is provided, returns all products."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Search completed successfully",
                    content = @Content(schema = @Schema(implementation = PagedResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid search parameters",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> searchProducts(
            @Parameter(description = "Search text to find in product title and description", example = "mascara")
            @RequestParam(required = false) String q,
            
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Sort field", example = "title")
            @RequestParam(defaultValue = "title") String sort,
            
            @Parameter(description = "Sort direction", example = "asc")
            @RequestParam(defaultValue = "asc") String direction,
            
            @Parameter(description = "Use fuzzy matching", example = "false")
            @RequestParam(defaultValue = "false") boolean fuzzy,
            
            HttpServletRequest request) {

        logger.debug("Searching products with query: '{}', page: {}, size: {}, sort: {} {}, fuzzy: {}", 
                q, page, size, sort, direction, fuzzy);

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        PagedResponse<ProductResponse> result = fuzzy 
                ? productService.searchProductsFuzzy(q, pageable)
                : productService.searchProducts(q, pageable);

        ApiResponse<PagedResponse<ProductResponse>> response = ApiResponse.success("Search completed", result);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get product by internal ID.
     */
    @GetMapping("/{id}")
    @Operation(
            summary = "Get product by ID",
            description = "Retrieve a specific product by its internal database ID."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(
            @Parameter(description = "Internal product ID", example = "1")
            @PathVariable Long id,
            HttpServletRequest request) {

        logger.debug("Getting product by ID: {}", id);

        ProductResponse product = productService.findById(id);
        ApiResponse<ProductResponse> response = ApiResponse.success("Product found", product);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get product by external ID.
     */
    @GetMapping("/external/{externalId}")
    @Operation(
            summary = "Get product by external ID",
            description = "Retrieve a specific product by its external API ID."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<ProductResponse>> getProductByExternalId(
            @Parameter(description = "External product ID", example = "1")
            @PathVariable Long externalId,
            HttpServletRequest request) {

        logger.debug("Getting product by external ID: {}", externalId);

        ProductResponse product = productService.findByExternalId(externalId);
        ApiResponse<ProductResponse> response = ApiResponse.success("Product found", product);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get product by SKU.
     */
    @GetMapping("/sku/{sku}")
    @Operation(
            summary = "Get product by SKU",
            description = "Retrieve a specific product by its SKU (Stock Keeping Unit)."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Product found",
                    content = @Content(schema = @Schema(implementation = ProductResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Product not found",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<ProductResponse>> getProductBySku(
            @Parameter(description = "Product SKU", example = "BEA-ESS-ESS-001")
            @PathVariable String sku,
            HttpServletRequest request) {

        logger.debug("Getting product by SKU: {}", sku);

        ProductResponse product = productService.findBySku(sku);
        ApiResponse<ProductResponse> response = ApiResponse.success("Product found", product);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get all products with pagination.
     */
    @GetMapping
    @Operation(
            summary = "Get all products",
            description = "Retrieve all products with pagination and sorting support."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Products retrieved successfully",
                    content = @Content(schema = @Schema(implementation = PagedResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getAllProducts(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Sort field", example = "title")
            @RequestParam(defaultValue = "title") String sort,
            
            @Parameter(description = "Sort direction", example = "asc")
            @RequestParam(defaultValue = "asc") String direction,
            
            HttpServletRequest request) {

        logger.debug("Getting all products, page: {}, size: {}, sort: {} {}", page, size, sort, direction);

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        PagedResponse<ProductResponse> result = productService.findAllProducts(pageable);
        ApiResponse<PagedResponse<ProductResponse>> response = ApiResponse.success("Products retrieved", result);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get products by category.
     */
    @GetMapping("/category/{category}")
    @Operation(
            summary = "Get products by category",
            description = "Retrieve products filtered by category with pagination and sorting support."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Products retrieved successfully",
                    content = @Content(schema = @Schema(implementation = PagedResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProductsByCategory(
            @Parameter(description = "Product category", example = "beauty")
            @PathVariable String category,
            
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Sort field", example = "title")
            @RequestParam(defaultValue = "title") String sort,
            
            @Parameter(description = "Sort direction", example = "asc")
            @RequestParam(defaultValue = "asc") String direction,
            
            HttpServletRequest request) {

        logger.debug("Getting products by category: '{}', page: {}, size: {}, sort: {} {}", 
                category, page, size, sort, direction);

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        PagedResponse<ProductResponse> result = productService.findProductsByCategory(category, pageable);
        ApiResponse<PagedResponse<ProductResponse>> response = ApiResponse.success("Products retrieved", result);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get products by brand.
     */
    @GetMapping("/brand/{brand}")
    @Operation(
            summary = "Get products by brand",
            description = "Retrieve products filtered by brand with pagination and sorting support."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Products retrieved successfully",
                    content = @Content(schema = @Schema(implementation = PagedResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> getProductsByBrand(
            @Parameter(description = "Product brand", example = "Essence")
            @PathVariable String brand,
            
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Page size", example = "20")
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Sort field", example = "title")
            @RequestParam(defaultValue = "title") String sort,
            
            @Parameter(description = "Sort direction", example = "asc")
            @RequestParam(defaultValue = "asc") String direction,
            
            HttpServletRequest request) {

        logger.debug("Getting products by brand: '{}', page: {}, size: {}, sort: {} {}", 
                brand, page, size, sort, direction);

        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        PagedResponse<ProductResponse> result = productService.findProductsByBrand(brand, pageable);
        ApiResponse<PagedResponse<ProductResponse>> response = ApiResponse.success("Products retrieved", result);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get search suggestions.
     */
    @GetMapping("/suggestions")
    @Operation(
            summary = "Get search suggestions",
            description = "Get search suggestions based on partial text input."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Suggestions retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<List<String>>> getSearchSuggestions(
            @Parameter(description = "Partial text for suggestions", example = "masc")
            @RequestParam String q,
            
            @Parameter(description = "Maximum number of suggestions", example = "10")
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit,
            
            HttpServletRequest request) {

        logger.debug("Getting search suggestions for: '{}', limit: {}", q, limit);

        List<String> suggestions = productService.getSearchSuggestions(q, limit);
        ApiResponse<List<String>> response = ApiResponse.success("Suggestions retrieved", suggestions);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get distinct categories.
     */
    @GetMapping("/categories")
    @Operation(
            summary = "Get all categories",
            description = "Retrieve all distinct product categories."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Categories retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<List<String>>> getCategories(HttpServletRequest request) {
        logger.debug("Getting all categories");

        List<String> categories = productService.getDistinctCategories();
        ApiResponse<List<String>> response = ApiResponse.success("Categories retrieved", categories);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Get distinct brands.
     */
    @GetMapping("/brands")
    @Operation(
            summary = "Get all brands",
            description = "Retrieve all distinct product brands."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Brands retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<List<String>>> getBrands(HttpServletRequest request) {
        logger.debug("Getting all brands");

        List<String> brands = productService.getDistinctBrands();
        ApiResponse<List<String>> response = ApiResponse.success("Brands retrieved", brands);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }
}
