package com.productapi.config;

import com.productapi.service.DataLoadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Automatically loads product data on application startup for production environments.
 * This ensures that the Render deployment has products available immediately.
 */
@Component
@Profile({"render", "production"}) // Only run in production environments
public class DataInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private DataLoadService dataLoadService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("Starting automatic data loading for production environment...");
        
        try {
            // Load all products from external API
            dataLoadService.loadAllProducts()
                .thenAccept(result -> {
                    if (result.isSuccess()) {
                        logger.info("✅ Automatic data loading completed successfully: {}", result.getMessage());
                        logger.info("📊 Loaded {} products ({} new, {} updated)", 
                            result.getTotalProducts(), result.getNewProducts(), result.getUpdatedProducts());
                    } else {
                        logger.error("❌ Automatic data loading failed: {}", result.getMessage());
                    }
                })
                .exceptionally(throwable -> {
                    logger.error("💥 Exception during automatic data loading", throwable);
                    return null;
                });
                
        } catch (Exception e) {
            logger.error("🚨 Critical error during automatic data loading", e);
        }
    }
}
