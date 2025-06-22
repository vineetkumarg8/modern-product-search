/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Determine the correct API base URL based on environment
const getApiBaseUrl = (): string => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('Using API URL from environment:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }

  // For production builds, try to detect the current domain
  if (process.env.NODE_ENV === 'production') {
    const currentHost = window.location.hostname;
    console.log('Production mode detected, current host:', currentHost);

    // If running on Render or other production domain
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      // For now, you'll need to manually set the backend URL
      // Replace this with your actual Render backend URL
      const productionApiUrl = 'https://your-backend-app-name.onrender.com/api/v1';
      console.log('Using production API URL:', productionApiUrl);
      return productionApiUrl;
    }
  }

  // Fallback to localhost for development
  const devApiUrl = 'http://localhost:8080/api/v1';
  console.log('Using development API URL:', devApiUrl);
  return devApiUrl;
};

// Environment-based configuration
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
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
