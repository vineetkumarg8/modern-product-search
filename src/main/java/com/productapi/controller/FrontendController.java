package com.productapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Controller to serve the React frontend application
 * Handles all non-API routes and serves index.html for client-side routing
 */
@Controller
public class FrontendController {

    /**
     * Simple test endpoint to verify backend is working
     */
    @GetMapping("/test")
    @ResponseBody
    public String test() {
        return "Backend is working! Frontend should be available at the root path.";
    }

    /**
     * Serve the React app for the root path
     */
    @GetMapping("/")
    public ResponseEntity<String> index() {
        return serveIndexHtml();
    }

    /**
     * Serve the React app for all non-API routes
     */
    @GetMapping(value = {
        "/search",
        "/search/**",
        "/products/**",
        "/categories/**",
        "/brands/**",
        "/about",
        "/contact",
        "/{path:[^\\.]*}"
    })
    public ResponseEntity<String> forward() {
        return serveIndexHtml();
    }

    /**
     * Serve index.html content directly
     */
    private ResponseEntity<String> serveIndexHtml() {
        try {
            // Try to serve the React app first
            Resource indexResource = new ClassPathResource("static/index.html");
            if (indexResource.exists()) {
                String content = StreamUtils.copyToString(indexResource.getInputStream(), StandardCharsets.UTF_8);
                return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(content);
            }

            // Fallback to our custom loading page
            Resource fallbackResource = new ClassPathResource("static/fallback.html");
            if (fallbackResource.exists()) {
                String content = StreamUtils.copyToString(fallbackResource.getInputStream(), StandardCharsets.UTF_8);
                return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(content);
            }

            // Last resort - simple HTML
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body("<!DOCTYPE html><html><head><title>Modern Product Search</title></head><body style='font-family: Arial, sans-serif; text-align: center; padding: 50px;'><h1>🚀 Backend is Running!</h1><p>Frontend is loading...</p><p><a href='/test'>Test Backend</a> | <a href='/api/v1/actuator/health'>Health Check</a></p></body></html>");

        } catch (IOException e) {
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body("<!DOCTYPE html><html><head><title>Error</title></head><body style='font-family: Arial, sans-serif; text-align: center; padding: 50px;'><h1>❌ Error Loading Frontend</h1><p>Error: " + e.getMessage() + "</p><p><a href='/test'>Test Backend</a></p></body></html>");
        }
    }
}
