/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Determine the correct API base URL based on environment
const getApiBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const pcIpAddress = '192.168.29.35';

  console.log('🔍 API URL Detection:', {
    hostname,
    protocol: window.location.protocol,
    host: window.location.host,
    nodeEnv: process.env.NODE_ENV,
    envApiUrl: process.env.REACT_APP_API_BASE_URL
  });

  // 1. Environment variable override (highest priority)
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('✅ Using API URL from environment:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }

  // 2. Mobile IP access (for local network testing)
  if (hostname === pcIpAddress) {
    const mobileApiUrl = `http://${pcIpAddress}:8080/api/v1`;
    console.log('📱 Mobile IP access detected, using:', mobileApiUrl);
    return mobileApiUrl;
  }

  // 3. Localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const devApiUrl = 'http://localhost:8080/api/v1';
    console.log('🛠️ Localhost detected, using:', devApiUrl);
    return devApiUrl;
  }

  // 4. Production deployment (any non-localhost domain)
  const productionApiUrl = `${window.location.protocol}//${window.location.host}/api/v1`;
  console.log('🌐 Production deployment detected, using same domain:', productionApiUrl);
  return productionApiUrl;
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
