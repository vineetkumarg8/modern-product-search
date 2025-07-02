package com.productapi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller to serve the React frontend application
 * Handles all non-API routes and serves index.html for client-side routing
 */
@Controller
public class FrontendController {

    /**
     * Serve the React app for the root path
     */
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    /**
     * Simple test endpoint to verify backend is working
     */
    @GetMapping("/test")
    @org.springframework.web.bind.annotation.ResponseBody
    public String test() {
        return "Backend is working! Frontend should be available at the root path.";
    }

    /**
     * Serve the React app for all non-API routes
     * This enables client-side routing to work properly
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
    public String forward() {
        return "forward:/index.html";
    }

    /**
     * Health check endpoint for the frontend
     */
    @GetMapping("/health")
    public String health() {
        return "forward:/index.html";
    }
}
