/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Environment-based configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(process.env.REACT_APP_API_RETRY_DELAY || '1000'),
};

// API Endpoints
export const API_ENDPOINTS = {
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  PRODUCT_BY_SKU: (sku: string) => `/products/sku/${sku}`,
  PRODUCT_SEARCH: '/products/search',
  PRODUCT_SEARCH_FUZZY: '/products/search/fuzzy',
  PRODUCT_SEARCH_BY_CATEGORY: '/products/search/category',
  PRODUCT_SEARCH_BY_BRAND: '/products/search/brand',
  PRODUCT_SUGGESTIONS: '/products/suggestions',
  
  // Data management endpoints
  DATA_LOAD: '/data/load',
  DATA_STATUS: '/data/status',
  DATA_CLEAR: '/data/clear',
  
  // Health and monitoring
  HEALTH: '/actuator/health',
  INFO: '/actuator/info',
} as const;

// Request configuration
export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
};

// Search configuration
export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 3,
  DEBOUNCE_DELAY: 300,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  SUGGESTION_LIMIT: 5,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  PRODUCTS_TTL: 5 * 60 * 1000, // 5 minutes
  SUGGESTIONS_TTL: 10 * 60 * 1000, // 10 minutes
  SEARCH_RESULTS_TTL: 2 * 60 * 1000, // 2 minutes
} as const;
