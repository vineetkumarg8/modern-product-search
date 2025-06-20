/**
 * Product type definitions matching the backend API response
 */

export interface Product {
  id: number;
  externalId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight?: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail: string;
  dimensions?: Dimensions;
  meta?: Meta;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode?: string;
  qrCode?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewDate: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface SearchFilters {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availabilityStatus?: string;
}

export interface SortOption {
  field: 'title' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
  label: string;
}

export interface SearchParams {
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  fuzzy?: boolean;
}

export interface ProductSearchState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: SearchFilters;
  sortOption: SortOption;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  suggestions: string[];
}
