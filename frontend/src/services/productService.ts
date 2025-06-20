import { apiClient } from './apiClient';
import { API_ENDPOINTS, SEARCH_CONFIG } from '../config/api';
import { Product, PagedResponse, ApiResponse, SearchParams } from '../types';

/**
 * Product Service
 * Handles all product-related API calls with proper error handling and caching
 */
class ProductService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  /**
   * Get all products with pagination and sorting
   */
  async getProducts(params: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
  } = {}): Promise<PagedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);

    const url = `${API_ENDPOINTS.PRODUCTS}?${queryParams.toString()}`;
    const cacheKey = `products_${queryParams.toString()}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<ApiResponse<PagedResponse<Product>>>(url);
      
      if (response.status === 'success') {
        // Cache the result
        this.setCache(cacheKey, response.data, 5 * 60 * 1000); // 5 minutes
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const cacheKey = `product_${id}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        API_ENDPOINTS.PRODUCT_BY_ID(id)
      );
      
      if (response.status === 'success') {
        // Cache the result
        this.setCache(cacheKey, response.data, 10 * 60 * 1000); // 10 minutes
        return response.data;
      } else {
        throw new Error(response.message || 'Product not found');
      }
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get product by SKU
   */
  async getProductBySku(sku: string): Promise<Product> {
    const cacheKey = `product_sku_${sku}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        API_ENDPOINTS.PRODUCT_BY_SKU(sku)
      );
      
      if (response.status === 'success') {
        // Cache the result
        this.setCache(cacheKey, response.data, 10 * 60 * 1000); // 10 minutes
        return response.data;
      } else {
        throw new Error(response.message || 'Product not found');
      }
    } catch (error) {
      console.error(`Error fetching product with SKU ${sku}:`, error);
      throw error;
    }
  }

  /**
   * Search products with text query
   */
  async searchProducts(params: SearchParams): Promise<PagedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('q', params.query);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);
    if (params.fuzzy) queryParams.append('fuzzy', 'true');

    const endpoint = params.fuzzy ? API_ENDPOINTS.PRODUCT_SEARCH_FUZZY : API_ENDPOINTS.PRODUCT_SEARCH;
    const url = `${endpoint}?${queryParams.toString()}`;
    const cacheKey = `search_${queryParams.toString()}`;

    // Check cache first (shorter TTL for search results)
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<ApiResponse<PagedResponse<Product>>>(url);
      
      if (response.status === 'success') {
        // Cache the result
        this.setCache(cacheKey, response.data, 2 * 60 * 1000); // 2 minutes
        return response.data;
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Search products by category
   */
  async searchProductsByCategory(
    query: string,
    category: string,
    params: Omit<SearchParams, 'query'> = {}
  ): Promise<PagedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('q', query);
    queryParams.append('category', category);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);

    const url = `${API_ENDPOINTS.PRODUCT_SEARCH_BY_CATEGORY}?${queryParams.toString()}`;

    try {
      const response = await apiClient.get<ApiResponse<PagedResponse<Product>>>(url);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Category search failed');
      }
    } catch (error) {
      console.error('Error searching products by category:', error);
      throw error;
    }
  }

  /**
   * Search products by brand
   */
  async searchProductsByBrand(
    query: string,
    brand: string,
    params: Omit<SearchParams, 'query'> = {}
  ): Promise<PagedResponse<Product>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('q', query);
    queryParams.append('brand', brand);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.direction) queryParams.append('direction', params.direction);

    const url = `${API_ENDPOINTS.PRODUCT_SEARCH_BY_BRAND}?${queryParams.toString()}`;

    try {
      const response = await apiClient.get<ApiResponse<PagedResponse<Product>>>(url);
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Brand search failed');
      }
    } catch (error) {
      console.error('Error searching products by brand:', error);
      throw error;
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      return [];
    }

    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('limit', SEARCH_CONFIG.SUGGESTION_LIMIT.toString());

    const url = `${API_ENDPOINTS.PRODUCT_SUGGESTIONS}?${queryParams.toString()}`;
    const cacheKey = `suggestions_${query}`;

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<ApiResponse<string[]>>(url);
      
      if (response.status === 'success') {
        // Cache the result
        this.setCache(cacheKey, response.data, 10 * 60 * 1000); // 10 minutes
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  /**
   * Load data from external API
   */
  async loadData(): Promise<{ message: string; count: number }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; count: number }>>(
        API_ENDPOINTS.DATA_LOAD
      );
      
      if (response.status === 'success') {
        // Clear cache after loading new data
        this.clearCache();
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load data');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  /**
   * Get unique brands from products
   */
  async getBrands(): Promise<string[]> {
    try {
      // Get all products and extract unique brands
      const response = await this.getProducts({ size: 1000 }); // Get a large number to capture all brands
      const brands = [...new Set(response.content.map(product => product.brand))].filter(Boolean);
      return brands.sort();
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  /**
   * Get unique categories from products
   */
  async getCategories(): Promise<string[]> {
    try {
      // Get all products and extract unique categories
      const response = await this.getProducts({ size: 1000 }); // Get a large number to capture all categories
      const categories = [...new Set(response.content.map(product => product.category))].filter(Boolean);
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Cache management methods
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats for debugging
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create and export singleton instance
export const productService = new ProductService();

// Export class for testing
export { ProductService };
