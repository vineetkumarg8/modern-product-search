package com.productapi.controller;

import com.productapi.service.DataLoadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.concurrent.CompletableFuture;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DataLoadController.class)
class DataLoadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataLoadService dataLoadService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void loadAllProducts_ShouldReturnSuccess() throws Exception {
        // Given
        DataLoadService.DataLoadResult result = new DataLoadService.DataLoadResult(
                true, "Data loaded successfully", 194, 194, 0);
        when(dataLoadService.loadAllProducts())
                .thenReturn(CompletableFuture.completedFuture(result));

        // When & Then
        mockMvc.perform(post("/data/load")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.success").value(true))
                .andExpect(jsonPath("$.data.totalProducts").value(194))
                .andExpect(jsonPath("$.data.newProducts").value(194));
    }

    @Test
    void loadAllProducts_ShouldReturnError_WhenLoadingFails() throws Exception {
        // Given
        DataLoadService.DataLoadResult result = new DataLoadService.DataLoadResult(
                false, "External API unavailable", 0, 0, 0);
        when(dataLoadService.loadAllProducts())
                .thenReturn(CompletableFuture.completedFuture(result));

        // When & Then
        mockMvc.perform(post("/data/load")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.data.success").value(false))
                .andExpect(jsonPath("$.message").value("External API unavailable"));
    }

    @Test
    void loadProductById_ShouldReturnSuccess() throws Exception {
        // Given
        Long externalId = 1L;
        DataLoadService.DataLoadResult result = new DataLoadService.DataLoadResult(
                true, "Product loaded successfully", 1, 1, 0);
        when(dataLoadService.loadProductById(externalId))
                .thenReturn(CompletableFuture.completedFuture(result));

        // When & Then
        mockMvc.perform(post("/data/load/{externalId}", externalId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.success").value(true))
                .andExpect(jsonPath("$.data.totalProducts").value(1));
    }

    @Test
    void getLoadingStatus_ShouldReturnStatus() throws Exception {
        // Given
        DataLoadService.LoadingStatus status = new DataLoadService.LoadingStatus(
                false, "Completed successfully", 100);
        when(dataLoadService.getLoadingStatus()).thenReturn(status);

        // When & Then
        mockMvc.perform(get("/data/status")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.loading").value(false))
                .andExpect(jsonPath("$.data.status").value("Completed successfully"))
                .andExpect(jsonPath("$.data.progress").value(100));
    }

    @Test
    void clearAllProducts_ShouldReturnSuccess() throws Exception {
        // Given
        DataLoadService.DataLoadResult result = new DataLoadService.DataLoadResult(
                true, "Successfully cleared 194 products", 194, 0, 0);
        when(dataLoadService.clearAllProducts())
                .thenReturn(CompletableFuture.completedFuture(result));

        // When & Then
        mockMvc.perform(delete("/data/clear")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data.success").value(true))
                .andExpect(jsonPath("$.message").value("Products cleared successfully"));
    }

    @Test
    void checkApiAvailability_ShouldReturnAvailable() throws Exception {
        // Given
        when(dataLoadService.checkExternalApiAvailability())
                .thenReturn(CompletableFuture.completedFuture(true));

        // When & Then
        mockMvc.perform(get("/data/api-status")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").value(true))
                .andExpect(jsonPath("$.message").value("External API is available"));
    }

    @Test
    void checkApiAvailability_ShouldReturnUnavailable() throws Exception {
        // Given
        when(dataLoadService.checkExternalApiAvailability())
                .thenReturn(CompletableFuture.completedFuture(false));

        // When & Then
        mockMvc.perform(get("/data/api-status")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").value(false))
                .andExpect(jsonPath("$.message").value("External API is not available"));
    }

    @Test
    void rebuildSearchIndex_ShouldReturnSuccess() throws Exception {
        // Given
        when(dataLoadService.rebuildSearchIndex())
                .thenReturn(CompletableFuture.completedFuture(true));

        // When & Then
        mockMvc.perform(post("/data/rebuild-index")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").value(true))
                .andExpect(jsonPath("$.message").value("Search index rebuilt successfully"));
    }

    @Test
    void rebuildSearchIndex_ShouldReturnError_WhenRebuildFails() throws Exception {
        // Given
        when(dataLoadService.rebuildSearchIndex())
                .thenReturn(CompletableFuture.completedFuture(false));

        // When & Then
        mockMvc.perform(post("/data/rebuild-index")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.data").value(false))
                .andExpect(jsonPath("$.message").value("Failed to rebuild search index"));
    }
}
