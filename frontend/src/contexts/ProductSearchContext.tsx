import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Product, ProductSearchState, SearchFilters, SortOption } from '../types';
import { productService } from '../services/productService';
import { SEARCH_CONFIG } from '../config/api';

// Action types
type ProductSearchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FILTERED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'REPLACE_FILTERS'; payload: SearchFilters }
  | { type: 'SET_SORT_OPTION'; payload: SortOption }
  | { type: 'SET_PAGINATION'; payload: Partial<ProductSearchState['pagination']> }
  | { type: 'SET_SUGGESTIONS'; payload: string[] }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: ProductSearchState = {
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  searchQuery: '',
  filters: {},
  sortOption: {
    field: 'title',
    direction: 'asc',
    label: 'Title (A-Z)',
  },
  pagination: {
    page: 0,
    size: SEARCH_CONFIG.DEFAULT_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
  },
  suggestions: [],
};

// Sort options
export const SORT_OPTIONS: SortOption[] = [
  { field: 'title', direction: 'asc', label: 'Title (A-Z)' },
  { field: 'title', direction: 'desc', label: 'Title (Z-A)' },
  { field: 'price', direction: 'asc', label: 'Price (Low to High)' },
  { field: 'price', direction: 'desc', label: 'Price (High to Low)' },
  { field: 'rating', direction: 'desc', label: 'Rating (High to Low)' },
  { field: 'rating', direction: 'asc', label: 'Rating (Low to High)' },
  { field: 'createdAt', direction: 'desc', label: 'Newest First' },
  { field: 'createdAt', direction: 'asc', label: 'Oldest First' },
];

// Reducer
function productSearchReducer(state: ProductSearchState, action: ProductSearchAction): ProductSearchState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false, error: null };
    
    case 'SET_FILTERED_PRODUCTS':
      return { ...state, filteredProducts: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'REPLACE_FILTERS':
      return { ...state, filters: action.payload };

    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };

    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchQuery: '',
        suggestions: [],
        filteredProducts: state.products
      };

    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context type
interface ProductSearchContextType {
  state: ProductSearchState;
  actions: {
    searchProducts: (query: string, fuzzy?: boolean) => Promise<void>;
    loadProducts: (page?: number, size?: number) => Promise<void>;
    loadProductsByCategory: (category: string, page?: number, size?: number) => Promise<void>;
    loadProductsByCategories: (categories: string[], page?: number, size?: number) => Promise<void>;
    setFilters: (filters: Partial<SearchFilters>) => void;
    replaceFilters: (filters: SearchFilters) => void;
    setSortOption: (sortOption: SortOption) => void;
    applyClientSideFiltering: () => void;
    applyClientSideSorting: () => void;
    getSuggestions: (query: string) => Promise<void>;
    loadData: () => Promise<void>;
    clearSearch: () => void;
    resetState: () => void;
  };
}

// Create context
const ProductSearchContext = createContext<ProductSearchContextType | undefined>(undefined);

// Provider component
export const ProductSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productSearchReducer, initialState);

  // Search products
  const searchProducts = useCallback(async (query: string, fuzzy = false) => {
    if (query.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });

    try {
      const response = await productService.searchProducts({
        query,
        page: 0,
        size: state.pagination.size,
        fuzzy,
      });

      dispatch({ type: 'SET_PRODUCTS', payload: response.content });
      dispatch({ type: 'SET_PAGINATION', payload: {
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      }});

      // Filtering and sorting will be handled by useEffect
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Search failed' });
    }
  }, []);

  // Load products (for initial load or pagination)
  const loadProducts = useCallback(async (page?: number, size?: number) => {
    const actualPage = page ?? 0;
    const actualSize = size ?? SEARCH_CONFIG.DEFAULT_PAGE_SIZE;
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await productService.getProducts({
        page: actualPage,
        size: actualSize,
        sort: state.sortOption.field,
        direction: state.sortOption.direction,
      });

      dispatch({ type: 'SET_PRODUCTS', payload: response.content });
      dispatch({ type: 'SET_PAGINATION', payload: {
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      }});

      // Filtering and sorting will be handled by useEffect
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load products' });
    }
  }, []);

  // Load products by category
  const loadProductsByCategory = useCallback(async (category: string, page?: number, size?: number) => {
    const actualPage = page ?? 0;
    const actualSize = size ?? SEARCH_CONFIG.DEFAULT_PAGE_SIZE;
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await productService.getProductsByCategory(category, {
        page: actualPage,
        size: actualSize,
        sort: state.sortOption.field,
        direction: state.sortOption.direction,
      });

      dispatch({ type: 'SET_PRODUCTS', payload: response.content });
      dispatch({ type: 'SET_PAGINATION', payload: {
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      }});

      // Filtering and sorting will be handled by useEffect
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load products by category' });
    }
  }, []);

  // Load products by multiple categories
  const loadProductsByCategories = useCallback(async (categories: string[], page?: number, size?: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Load products from all categories sequentially to avoid overwhelming the server
      const allProducts: Product[] = [];

      for (const category of categories) {
        try {
          const response = await productService.getProductsByCategory(category, {
            page: 0,
            size: 100, // Get all products for each category
            sort: 'title',
            direction: 'asc',
          });
          allProducts.push(...response.content);
        } catch (categoryError) {
          console.warn(`Failed to load products for category ${category}:`, categoryError);
          // Continue with other categories even if one fails
        }
      }

      // Remove duplicates based on product ID
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
      );

      // Set all products - client-side filtering and sorting will handle the rest
      dispatch({ type: 'SET_PRODUCTS', payload: uniqueProducts });
      dispatch({ type: 'SET_PAGINATION', payload: {
        page: 0,
        size: uniqueProducts.length,
        totalElements: uniqueProducts.length,
        totalPages: 1,
      }});

    } catch (error: any) {
      console.error('loadProductsByCategories error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load products by categories' });
    }
  }, []);

  // Set filters
  const setFilters = useCallback((filters: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Replace filters completely
  const replaceFilters = useCallback((filters: SearchFilters) => {
    dispatch({ type: 'REPLACE_FILTERS', payload: filters });
  }, []);

  // Set sort option
  const setSortOption = useCallback((sortOption: SortOption) => {
    dispatch({ type: 'SET_SORT_OPTION', payload: sortOption });
  }, []);

  // Apply client-side filtering
  const applyClientSideFiltering = useCallback(() => {
    let filtered = [...state.products];

    // Filter by brand
    if (state.filters.brand) {
      filtered = filtered.filter(product => product.brand === state.filters.brand);
    }

    // Filter by category
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }

    // Filter by price range
    if (state.filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= state.filters.minPrice!);
    }
    if (state.filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= state.filters.maxPrice!);
    }

    // Filter by rating
    if (state.filters.minRating !== undefined) {
      filtered = filtered.filter(product => product.rating >= state.filters.minRating!);
    }

    // Filter by availability
    if (state.filters.availabilityStatus) {
      filtered = filtered.filter(product => product.availabilityStatus === state.filters.availabilityStatus);
    }

    dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered });
  }, [state.products, state.filters]);

  // Apply client-side sorting
  const applyClientSideSorting = useCallback(() => {
    const sorted = [...state.filteredProducts].sort((a, b) => {
      const { field, direction } = state.sortOption;
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle different data types
      if (field === 'price' || field === 'rating') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (field === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: sorted });
  }, [state.filteredProducts, state.sortOption]);

  // Get search suggestions
  const getSuggestions = useCallback(async (query: string) => {
    try {
      const suggestions = await productService.getSearchSuggestions(query);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    }
  }, []);

  // Load data from external API
  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await productService.loadData();
      // Reload products after loading data
      await loadProducts();
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load data' });
    }
  }, [loadProducts]);

  // Clear search
  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // Apply filtering and sorting when products, filters, or sort option change
  useEffect(() => {
    let filtered = [...state.products];

    // Apply filters
    if (state.filters.brand) {
      filtered = filtered.filter(product => product.brand === state.filters.brand);
    }

    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }

    if (state.filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= state.filters.minPrice!);
    }
    if (state.filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= state.filters.maxPrice!);
    }

    if (state.filters.minRating !== undefined) {
      filtered = filtered.filter(product => product.rating >= state.filters.minRating!);
    }

    if (state.filters.availabilityStatus) {
      filtered = filtered.filter(product => product.availabilityStatus === state.filters.availabilityStatus);
    }

    // Apply sorting
    if (filtered.length > 0) {
      const sorted = [...filtered].sort((a, b) => {
        const { field, direction } = state.sortOption;
        let aValue: any = a[field];
        let bValue: any = b[field];

        // Handle different data types
        if (field === 'price' || field === 'rating') {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        } else if (field === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: sorted });
    } else {
      dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered });
    }
  }, [state.products, state.filters, state.sortOption]);

  const contextValue: ProductSearchContextType = {
    state,
    actions: {
      searchProducts,
      loadProducts,
      loadProductsByCategory,
      loadProductsByCategories,
      setFilters,
      replaceFilters,
      setSortOption,
      applyClientSideFiltering,
      applyClientSideSorting,
      getSuggestions,
      loadData,
      clearSearch,
      resetState,
    },
  };

  return (
    <ProductSearchContext.Provider value={contextValue}>
      {children}
    </ProductSearchContext.Provider>
  );
};

// Custom hook to use the context
export const useProductSearch = (): ProductSearchContextType => {
  const context = useContext(ProductSearchContext);
  if (!context) {
    throw new Error('useProductSearch must be used within a ProductSearchProvider');
  }
  return context;
};
