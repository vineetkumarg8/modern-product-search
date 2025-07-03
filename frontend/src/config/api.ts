/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Determine the correct API base URL based on environment
const getApiBaseUrl = (): string => {
  // MOBILE OVERRIDE: Force IP address for mobile devices
  const hostname = window.location.hostname;
  const pcIpAddress = '192.168.29.35';

  // If accessing via IP address (mobile device), force backend IP
  if (hostname === pcIpAddress) {
    const mobileApiUrl = `http://${pcIpAddress}:8080/api/v1`;
    console.log('📱 MOBILE OVERRIDE: Using IP-based API URL:', mobileApiUrl);
    return mobileApiUrl;
  }

  // If environment variable is set, use it
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('✅ Using API URL from environment:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }

  // Enhanced environment detection (reuse variables from above)
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // Mobile/network device detection (reuse pcIpAddress from above)
  const isMobileAccess = hostname === pcIpAddress;

  console.log('🔍 Environment detection:', {
    hostname,
    isLocalhost,
    isMobileAccess,
    isDevelopment,
    isProduction,
    nodeEnv: process.env.NODE_ENV
  });

  // For production builds, try to detect the current domain
  if (process.env.NODE_ENV === 'production') {
    const currentHost = window.location.hostname;
    console.log('Production mode detected, current host:', currentHost);

    // If running on Render or other production domain
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      // Use same domain for production (relative URL)
      const productionApiUrl = `${window.location.protocol}//${window.location.host}/api/v1`;
      console.log('Using production API URL (same domain):', productionApiUrl);
      return productionApiUrl;
    }
  }

  // Production environment detection - for hosted visitors
  if (isProduction && !isLocalhost && !isMobileAccess) {
    // Use same domain for production, with environment variable fallback
    const productionUrl = process.env.REACT_APP_API_BASE_URL || `${window.location.protocol}//${window.location.host}/api/v1`;
    console.log('🌐 Production environment detected for visitor, using:', productionUrl);
    console.log('🎯 This ensures hosted visitors can access data from anywhere');
    return productionUrl;
  }

  // Handle hosted frontend with different backend scenarios
  if (!isLocalhost && !isMobileAccess) {
    // If frontend is hosted but not on mobile network
    if (hostname.includes('render.com')) {
      const renderUrl = `https://${hostname}/api/v1`;
      console.log('🌐 Detected Render deployment, using same domain:', renderUrl);
      return renderUrl;
    }

    if (hostname.includes('vercel.app') || hostname.includes('netlify.app') || hostname.includes('github.io')) {
      // For static deployments, use dedicated backend URL
      const staticDeploymentUrl = 'https://modern-product-search.onrender.com/api/v1';
      console.log('📦 Detected static deployment, using backend:', staticDeploymentUrl);
      return staticDeploymentUrl;
    }

    // Generic production fallback - try same domain first
    const prodUrl = `${window.location.protocol}//${hostname}/api/v1`;
    console.log('🏭 Production environment, trying same domain:', prodUrl);
    return prodUrl;
  }

  // Mobile/network access detection
  if (isMobileAccess || (!isLocalhost && isDevelopment)) {
    const mobileApiUrl = `http://${pcIpAddress}:8080/api/v1`;
    console.log('📱 Mobile/Network access detected, using:', mobileApiUrl);
    return mobileApiUrl;
  }

  // Development fallback with multiple options
  const devOptions = [
    'http://localhost:8080/api/v1',
    'http://127.0.0.1:8080/api/v1'
  ];

  const devApiUrl = devOptions[0];
  console.log('🛠️ Development environment, using:', devApiUrl);
  console.log('💡 Alternative URLs to try:', devOptions.slice(1));
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
