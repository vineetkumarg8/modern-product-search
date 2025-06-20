import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, REQUEST_CONFIG } from '../config/api';

/**
 * HTTP Client Service
 * Provides a configured axios instance with interceptors for error handling,
 * request/response logging, and retry logic
 */
class ApiClient {
  private client: AxiosInstance;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
    
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      ...REQUEST_CONFIG,
      withCredentials: false,
      headers: {
        ...REQUEST_CONFIG.headers,
        'Access-Control-Allow-Origin': '*',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        // Add timestamp for request tracking
        (config as any).metadata = { startTime: new Date() };

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Calculate request duration
        const duration = new Date().getTime() - ((response.config as any).metadata?.startTime?.getTime() || 0);
        
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            duration: `${duration}ms`,
            data: response.data,
          });
        }
        
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Log error
        console.error('❌ API Error:', {
          url: originalRequest?.url,
          method: originalRequest?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        // Retry logic for network errors or 5xx errors
        if (this.shouldRetry(error) && !originalRequest._retry) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

          if (originalRequest._retryCount <= this.retryAttempts) {
            console.log(`🔄 Retrying request (${originalRequest._retryCount}/${this.retryAttempts})`);
            
            // Wait before retrying
            await this.delay(this.retryDelay * originalRequest._retryCount);
            
            return this.client(originalRequest);
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on 5xx server errors
    const status = error.response.status;
    return status >= 500 && status < 600;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || error.message || 'An error occurred',
        status: error.response.status,
        code: error.response.data?.code || 'API_ERROR',
        details: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR',
        details: null,
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
        details: null,
      };
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error: any) {
      // If proxy fails and we're in development, try direct backend URL
      if (process.env.NODE_ENV === 'development' && url.startsWith('/api/v1')) {
        // eslint-disable-next-line no-console
        console.warn('Proxy failed, trying direct backend URL...');
        const directUrl = `http://localhost:8080${url}`;
        const response = await this.client.get<T>(directUrl, config);
        return response.data;
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Utility methods
  getBaseURL(): string {
    return API_CONFIG.BASE_URL;
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Error interface
export interface ApiError {
  message: string;
  status: number;
  code: string;
  details: any;
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export { ApiClient };
