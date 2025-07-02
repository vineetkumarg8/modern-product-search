package com.productapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources (CSS, JS, images, etc.)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/static/")
                .setCachePeriod(31536000);

        // Serve other static files
        registry.addResourceHandler("/favicon.ico", "/manifest.json", "/robots.txt")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(31536000);

        // Fallback for SPA routing - handle all other requests
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // If it's an API request, don't serve index.html
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }

                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // For SPA routing, serve index.html for non-API requests
                        return new ClassPathResource("/static/index.html");
                    }
                });
    }
}
