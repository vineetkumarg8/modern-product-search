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
 * Production Data Initializer
 * Automatically loads sample data when the application starts in production
 * to ensure visitors always see content
 */
@Component
@Profile("render") // Only run in production (Render) environment
public class ProductionDataInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(ProductionDataInitializer.class);

    @Autowired
    private DataLoadService dataLoadService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("🚀 Production Data Initializer starting...");
        
        try {
            // Load data asynchronously so it doesn't block application startup
            dataLoadService.loadAllProducts()
                .thenAccept(result -> {
                    if (result.isSuccess()) {
                        logger.info("✅ Production data loaded successfully: {} products", result.getTotalProducts());
                    } else {
                        logger.warn("⚠️ Production data loading failed: {}", result.getMessage());
                    }
                })
                .exceptionally(throwable -> {
                    logger.error("❌ Error during production data loading", throwable);
                    return null;
                });
                
            logger.info("🔄 Production data loading initiated in background");
            
        } catch (Exception e) {
            logger.error("❌ Failed to initiate production data loading", e);
        }
    }
}
