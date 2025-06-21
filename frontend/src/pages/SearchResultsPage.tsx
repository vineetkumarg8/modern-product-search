import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Section, FlexContainer, Button } from '../styles/AppStyles';
import { SearchBar } from '../components/search/SearchBar';
import { FilterPanel } from '../components/filters/FilterPanel';
import { ProductGrid } from '../components/product/ProductGrid';
import { Loading } from '../components/common/Loading';
import { useProductSearch } from '../contexts/ProductSearchContext';

// Styled components
const SearchHeader = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const SearchSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const SearchBarContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 280px 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FilterContainer = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 2;
  }
`;

const ResultsContainer = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 1;
  }
`;

const MobileFilterToggle = styled(Button)`
  display: none;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileFilterPanel = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const MobileFilterContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 500px;
  margin: 0 auto;
  position: relative;
`;

const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoResultsIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NoResultsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoResultsMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 500px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const SuggestionButton = styled(Button)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

/**
 * SearchResultsPage Component
 * Displays search results with filtering and sorting capabilities
 */
export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, actions } = useProductSearch();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';

  // Load search results based on URL parameters
  useEffect(() => {
    const loadSearchResults = async () => {
      setHasSearched(true);

      try {
        if (query) {
          // Text search - clear filters first
          actions.setFilters({});
          await actions.searchProducts(query);
        } else if (category) {
          // Category-based search using backend endpoint
          // Set the category filter so it shows in active filters
          actions.setFilters({ category });
          await actions.loadProductsByCategory(category);
        } else if (brand) {
          // Brand-based search - use client-side filtering
          const filters: any = { brand };
          actions.setFilters(filters);
          await actions.loadProducts();
        } else {
          // Load all products - clear filters
          actions.setFilters({});
          await actions.loadProducts();
        }
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    loadSearchResults();
  }, [query, category, brand]); // Stable actions, no need to include

  // Handle new search
  const handleSearch = async (newQuery: string) => {
    const newSearchParams = new URLSearchParams();
    if (newQuery) {
      newSearchParams.set('q', newQuery);
    }
    setSearchParams(newSearchParams);
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  // Toggle mobile filter panel
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Close mobile filter panel
  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  // Get search title
  const getSearchTitle = () => {
    if (query) {
      return `Search Results for "${query}"`;
    } else if (category) {
      return `Products in ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    } else if (brand) {
      return `Products by ${brand}`;
    } else {
      return 'All Products';
    }
  };

  // Get search subtitle
  const getSearchSubtitle = () => {
    const totalResults = state.filteredProducts.length;
    if (totalResults === 0 && hasSearched && !state.loading) {
      return 'No products found matching your criteria';
    } else if (totalResults > 0) {
      return `Found ${totalResults} product${totalResults !== 1 ? 's' : ''}`;
    } else {
      return 'Search through our product catalog';
    }
  };

  // Popular search suggestions
  const searchSuggestions = [
    'mascara', 'laptop', 'smartphone', 'dress', 'watch',
    'headphones', 'perfume', 'shoes', 'bag', 'sunglasses'
  ];

  const showNoResults = hasSearched && !state.loading && state.filteredProducts.length === 0;

  return (
    <>
      {/* Search Header */}
      <SearchHeader>
        <Container>
          <SearchTitle>{getSearchTitle()}</SearchTitle>
          <SearchSubtitle>{getSearchSubtitle()}</SearchSubtitle>
          
          <SearchBarContainer>
            <SearchBar 
              size="md"
              placeholder="Search products..."
              onSearch={handleSearch}
            />
          </SearchBarContainer>
        </Container>
      </SearchHeader>

      {/* Main Content */}
      <Section>
        <Container>
          <ContentContainer>
            {/* Desktop Filter Panel */}
            <FilterContainer className="tablet-up">
              <FilterPanel />
            </FilterContainer>

            {/* Results Container */}
            <ResultsContainer>
              {/* Mobile Filter Toggle */}
              <MobileFilterToggle
                variant="outline"
                onClick={toggleMobileFilter}
                fullWidth
              >
                <i className="fas fa-filter" />
                Filters & Sort
                {Object.keys(state.filters).length > 0 && (
                  <span style={{ 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: '20px', 
                    height: '20px', 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '8px'
                  }}>
                    {Object.keys(state.filters).length}
                  </span>
                )}
              </MobileFilterToggle>

              {/* Loading State */}
              {state.loading && (
                <Loading 
                  message="Searching products..." 
                  type="spinner" 
                  size="lg" 
                />
              )}

              {/* Error State */}
              {state.error && (
                <NoResultsContainer>
                  <NoResultsIcon>
                    <i className="fas fa-exclamation-triangle" />
                  </NoResultsIcon>
                  <NoResultsTitle>Search Error</NoResultsTitle>
                  <NoResultsMessage>{state.error}</NoResultsMessage>
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </NoResultsContainer>
              )}

              {/* No Results State */}
              {showNoResults && (
                <NoResultsContainer>
                  <NoResultsIcon>
                    <i className="fas fa-search" />
                  </NoResultsIcon>
                  <NoResultsTitle>No Products Found</NoResultsTitle>
                  <NoResultsMessage>
                    We couldn't find any products matching your search criteria. 
                    Try adjusting your filters or search terms.
                  </NoResultsMessage>
                  
                  <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Popular Searches:
                  </h4>
                  <SuggestionsContainer>
                    {searchSuggestions.map(suggestion => (
                      <SuggestionButton
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </SuggestionButton>
                    ))}
                  </SuggestionsContainer>
                </NoResultsContainer>
              )}

              {/* Results Grid */}
              {!state.loading && !state.error && state.filteredProducts.length > 0 && (
                <ProductGrid 
                  products={state.filteredProducts}
                  enableVirtualization={state.filteredProducts.length > 50}
                />
              )}
            </ResultsContainer>
          </ContentContainer>
        </Container>
      </Section>

      {/* Mobile Filter Panel */}
      <MobileFilterPanel isOpen={isMobileFilterOpen}>
        <MobileFilterContent>
          <MobileFilterHeader>
            <h3>Filters & Sort</h3>
            <CloseButton onClick={closeMobileFilter}>
              <i className="fas fa-times" />
            </CloseButton>
          </MobileFilterHeader>
          <FilterPanel />
        </MobileFilterContent>
      </MobileFilterPanel>
    </>
  );
};
