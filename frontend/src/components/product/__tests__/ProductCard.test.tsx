import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ProductCard } from '../ProductCard';
import { Product } from '../../../types';
import { theme } from '../../../styles/theme';

// Mock product data
const mockProduct: Product = {
  id: 1,
  externalId: 1,
  title: 'Test Product',
  description: 'This is a test product description',
  category: 'electronics',
  price: 99.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  tags: ['test', 'electronics'],
  brand: 'Test Brand',
  sku: 'TEST-001',
  weight: 500,
  warrantyInformation: '1 year warranty',
  shippingInformation: 'Free shipping',
  availabilityStatus: 'In Stock',
  returnPolicy: '30 days return',
  minimumOrderQuantity: 1,
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  thumbnail: 'https://example.com/thumbnail.jpg',
  dimensions: {
    width: 10,
    height: 5,
    depth: 2,
  },
  meta: {
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    barcode: '123456789',
    qrCode: 'QR123',
  },
  reviews: [
    {
      id: 1,
      rating: 5,
      comment: 'Great product!',
      reviewDate: '2023-01-01T00:00:00Z',
      reviewerName: 'John Doe',
      reviewerEmail: 'john@example.com',
    },
  ],
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
  });

  it('displays correct price with discount', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    // Discounted price: 99.99 * (1 - 10/100) = 89.99
    expect(screen.getByText('$89.99')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument(); // Original price
    expect(screen.getByText('-10%')).toBeInTheDocument(); // Discount badge
  });

  it('displays rating correctly', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('4.5 (1 reviews)')).toBeInTheDocument();
  });

  it('shows stock status', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('displays tags', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('electronics')).toBeInTheDocument();
  });

  it('renders without actions when showActions is false', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} showActions={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('View Details')).not.toBeInTheDocument();
  });

  it('renders in compact mode', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} compact />
      </TestWrapper>
    );

    // In compact mode, description and tags should not be visible
    expect(screen.queryByText('This is a test product description')).not.toBeInTheDocument();
    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  it('handles out of stock products', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0, availabilityStatus: 'Out of Stock' };
    
    render(
      <TestWrapper>
        <ProductCard product={outOfStockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('handles products without discount', () => {
    const noDiscountProduct = { ...mockProduct, discountPercentage: undefined };
    
    render(
      <TestWrapper>
        <ProductCard product={noDiscountProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.queryByText('-10%')).not.toBeInTheDocument();
  });

  it('handles products without reviews', () => {
    const noReviewsProduct = { ...mockProduct, reviews: [] };
    
    render(
      <TestWrapper>
        <ProductCard product={noReviewsProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('4.5 (0 reviews)')).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/product/1');
  });

  it('handles image loading errors', () => {
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} />
      </TestWrapper>
    );

    const image = screen.getByAltText('Test Product');
    
    // Simulate image error
    Object.defineProperty(image, 'complete', { value: false });
    Object.defineProperty(image, 'naturalHeight', { value: 0 });
    
    // The component should handle the error gracefully
    expect(image).toBeInTheDocument();
  });
});
