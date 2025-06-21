import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HomePage } from '../HomePage';
import { ProductSearchProvider } from '../../contexts/ProductSearchContext';
import { theme } from '../../styles/theme';
import * as productService from '../../services/productService';

// Mock the product service
jest.mock('../../services/productService');
const mockProductService = productService as jest.Mocked<typeof productService>;

// Mock product data
const mockProducts = [
  {
    id: 1,
    externalId: 1,
    title: 'Featured Product 1',
    description: 'Description 1',
    category: 'electronics',
    price: 99.99,
    rating: 4.5,
    stock: 50,
    tags: ['featured'],
    brand: 'Brand A',
    sku: 'FEAT-001',
    availabilityStatus: 'In Stock',
    images: ['image1.jpg'],
    thumbnail: 'thumb1.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    externalId: 2,
    title: 'Featured Product 2',
    description: 'Description 2',
    category: 'beauty',
    price: 49.99,
    rating: 4.0,
    stock: 30,
    tags: ['featured'],
    brand: 'Brand B',
    sku: 'FEAT-002',
    availabilityStatus: 'In Stock',
    images: ['image2.jpg'],
    thumbnail: 'thumb2.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const mockPagedResponse = {
  content: mockProducts,
  page: 0,
  size: 12,
  totalElements: 100,
  totalPages: 9,
  first: true,
  last: false,
  numberOfElements: 2,
  empty: false,
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ProductSearchProvider>
        {children}
      </ProductSearchProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductService.productService.getProducts.mockResolvedValue(mockPagedResponse);
  });

  it('should load featured products independently from search context', async () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Wait for featured products to load
    await waitFor(() => {
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
    });

    // Verify that productService.getProducts was called directly
    expect(mockProductService.productService.getProducts).toHaveBeenCalledWith({
      page: 0,
      size: 12,
    });

    // Verify featured products are displayed
    await waitFor(() => {
      expect(screen.getByText('Featured Product 1')).toBeInTheDocument();
      expect(screen.getByText('Featured Product 2')).toBeInTheDocument();
    });
  });

  it('should display correct stats', async () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    // Wait for stats to be calculated
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument(); // Total products
      expect(screen.getByText('2')).toBeInTheDocument(); // Categories (electronics, beauty)
      expect(screen.getByText('2')).toBeInTheDocument(); // Brands (Brand A, Brand B)
    });
  });

  it('should render hero section with search bar', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(screen.getByText('Find Your Perfect Product')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for products, brands, categories...')).toBeInTheDocument();
  });

  it('should render quick action categories', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );

    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByText('Beauty Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Home & Decor')).toBeInTheDocument();
  });
});
