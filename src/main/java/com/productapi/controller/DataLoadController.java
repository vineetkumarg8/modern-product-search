package com.productapi.controller;

import com.productapi.dto.response.ApiResponse;
import com.productapi.service.DataLoadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

/**
 * REST controller for data loading operations.
 * Provides endpoints to load product data from external APIs.
 */
@RestController
@RequestMapping("/data")
@Tag(name = "Data Loading", description = "Operations for loading product data from external APIs")
public class DataLoadController {

    private static final Logger logger = LoggerFactory.getLogger(DataLoadController.class);

    private final DataLoadService dataLoadService;

    public DataLoadController(DataLoadService dataLoadService) {
        this.dataLoadService = dataLoadService;
    }

    /**
     * Load all products from external API into the database.
     */
    @PostMapping("/load")
    @Operation(
            summary = "Load all products from external API",
            description = "Fetches all products from the external API and loads them into the in-memory H2 database. " +
                         "This operation is idempotent - existing products will be updated and new products will be added."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Data loading initiated successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Data loading is already in progress",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "502",
                    description = "External API is not available",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public CompletableFuture<ResponseEntity<ApiResponse<DataLoadService.DataLoadResult>>> loadAllProducts(
            HttpServletRequest request) {
        
        logger.info("Received request to load all products from external API");

        return dataLoadService.loadAllProducts()
                .thenApply(result -> {
                    ApiResponse<DataLoadService.DataLoadResult> response = result.isSuccess() 
                            ? ApiResponse.success("Data loading completed", result)
                            : ApiResponse.error(result.getMessage(), result);
                    response.setPath(request.getRequestURI());
                    
                    return ResponseEntity.ok(response);
                });
    }

    /**
     * Load a specific product by external ID.
     */
    @PostMapping("/load/{externalId}")
    @Operation(
            summary = "Load specific product by external ID",
            description = "Fetches a specific product from the external API by its external ID and loads it into the database."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Product loaded successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Product not found in external API",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "502",
                    description = "External API is not available",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public CompletableFuture<ResponseEntity<ApiResponse<DataLoadService.DataLoadResult>>> loadProductById(
            @Parameter(description = "External product ID", example = "1")
            @PathVariable Long externalId,
            HttpServletRequest request) {
        
        logger.info("Received request to load product with external ID: {}", externalId);

        return dataLoadService.loadProductById(externalId)
                .thenApply(result -> {
                    ApiResponse<DataLoadService.DataLoadResult> response = result.isSuccess() 
                            ? ApiResponse.success("Product loaded successfully", result)
                            : ApiResponse.error(result.getMessage(), result);
                    response.setPath(request.getRequestURI());
                    
                    return ResponseEntity.ok(response);
                });
    }

    /**
     * Get current data loading status.
     */
    @GetMapping("/status")
    @Operation(
            summary = "Get data loading status",
            description = "Returns the current status of data loading operations, including progress information."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Status retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<DataLoadService.LoadingStatus>> getLoadingStatus(HttpServletRequest request) {
        logger.debug("Received request for loading status");

        DataLoadService.LoadingStatus status = dataLoadService.getLoadingStatus();
        ApiResponse<DataLoadService.LoadingStatus> response = ApiResponse.success("Loading status retrieved", status);
        response.setPath(request.getRequestURI());

        return ResponseEntity.ok(response);
    }

    /**
     * Clear all products from the database.
     */
    @DeleteMapping("/clear")
    @Operation(
            summary = "Clear all products from database",
            description = "Removes all products from the in-memory H2 database. This operation cannot be undone."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Products cleared successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Error clearing products",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public CompletableFuture<ResponseEntity<ApiResponse<DataLoadService.DataLoadResult>>> clearAllProducts(
            HttpServletRequest request) {
        
        logger.info("Received request to clear all products from database");

        return dataLoadService.clearAllProducts()
                .thenApply(result -> {
                    ApiResponse<DataLoadService.DataLoadResult> response = result.isSuccess() 
                            ? ApiResponse.success("Products cleared successfully", result)
                            : ApiResponse.error(result.getMessage(), result);
                    response.setPath(request.getRequestURI());
                    
                    return ResponseEntity.ok(response);
                });
    }

    /**
     * Check external API availability.
     */
    @GetMapping("/api-status")
    @Operation(
            summary = "Check external API availability",
            description = "Checks if the external API is available and responding to requests."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "API status checked successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public CompletableFuture<ResponseEntity<ApiResponse<Boolean>>> checkApiAvailability(HttpServletRequest request) {
        logger.debug("Received request to check external API availability");

        return dataLoadService.checkExternalApiAvailability()
                .thenApply(available -> {
                    String message = available ? "External API is available" : "External API is not available";
                    ApiResponse<Boolean> response = ApiResponse.success(message, available);
                    response.setPath(request.getRequestURI());
                    
                    return ResponseEntity.ok(response);
                });
    }

    /**
     * Rebuild search index.
     */
    @PostMapping("/rebuild-index")
    @Operation(
            summary = "Rebuild search index",
            description = "Manually rebuilds the full-text search index for all products in the database."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Index rebuild completed",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500",
                    description = "Error rebuilding index",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public CompletableFuture<ResponseEntity<ApiResponse<Boolean>>> rebuildSearchIndex(HttpServletRequest request) {
        logger.info("Received request to rebuild search index");

        return dataLoadService.rebuildSearchIndex()
                .thenApply(success -> {
                    String message = success ? "Search index rebuilt successfully" : "Failed to rebuild search index";
                    ApiResponse<Boolean> response = success 
                            ? ApiResponse.success(message, true)
                            : ApiResponse.error(message, false);
                    response.setPath(request.getRequestURI());
                    
                    return ResponseEntity.ok(response);
                });
    }
}
