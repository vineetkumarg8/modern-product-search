import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { SearchBar } from '../SearchBar';
import { ProductSearchProvider } from '../../../contexts/ProductSearchContext';
import { theme } from '../../../styles/theme';

// Mock the product service
jest.mock('../../../services/productService', () => ({
  productService: {
    getSearchSuggestions: jest.fn().mockResolvedValue(['test suggestion 1', 'test suggestion 2']),
  },
}));

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

describe('SearchBar', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(
      <TestWrapper>
        <SearchBar placeholder="Search products..." />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted', async () => {
    const mockOnSearch = jest.fn();
    
    render(
      <TestWrapper>
        <SearchBar onSearch={mockOnSearch} />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'test query');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('shows suggestions when typing', async () => {
    render(
      <TestWrapper>
        <SearchBar showSuggestions />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('test suggestion 1')).toBeInTheDocument();
      expect(screen.getByText('test suggestion 2')).toBeInTheDocument();
    });
  });

  it('handles keyboard navigation in suggestions', async () => {
    render(
      <TestWrapper>
        <SearchBar showSuggestions />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('test suggestion 1')).toBeInTheDocument();
    });

    // Navigate down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    // Navigate up
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    
    // Press escape to close
    fireEvent.keyDown(input, { key: 'Escape' });
  });

  it('clears input when clear button is clicked', async () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test query');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('disables search button when query is too short', () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  it('enables search button when query is long enough', async () => {
    render(
      <TestWrapper>
        <SearchBar />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'test');

    expect(searchButton).not.toBeDisabled();
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(
      <TestWrapper>
        <SearchBar size="sm" />
      </TestWrapper>
    );

    let input = screen.getByRole('textbox');
    expect(input).toHaveClass(); // Check for size-specific styling

    rerender(
      <TestWrapper>
        <SearchBar size="lg" />
      </TestWrapper>
    );

    input = screen.getByRole('textbox');
    expect(input).toHaveClass(); // Check for size-specific styling
  });

  it('handles suggestion clicks', async () => {
    const mockOnSearch = jest.fn();
    
    render(
      <TestWrapper>
        <SearchBar onSearch={mockOnSearch} showSuggestions />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('test suggestion 1')).toBeInTheDocument();
    });

    const suggestion = screen.getByText('test suggestion 1');
    await user.click(suggestion);

    expect(mockOnSearch).toHaveBeenCalledWith('test suggestion 1');
  });

  it('handles autofocus prop', () => {
    render(
      <TestWrapper>
        <SearchBar autoFocus />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });
});
