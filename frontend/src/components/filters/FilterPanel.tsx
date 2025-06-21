import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { useProductSearch, SORT_OPTIONS } from '../../contexts/ProductSearchContext';
import { SearchFilters, SortOption } from '../../types';
import { productService } from '../../services/productService';
import { Card, Button, Input, FlexContainer } from '../../styles/AppStyles';

// Styled components
const FilterContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RangeInput = styled(Input)`
  flex: 1;
`;

const RangeSeparator = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin: 0;
`;

const FilterActions = styled(FlexContainer)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ActiveFilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: rgba(102, 126, 234, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

// Component interface
interface FilterPanelProps {
  className?: string;
}

/**
 * FilterPanel Component
 * Provides filtering and sorting controls for products
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ className }) => {
  const { state, actions } = useProductSearch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(state.filters);

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          productService.getBrands(),
          productService.getCategories(),
        ]);
        setAllBrands(brandsData);
        setAvailableBrands(brandsData); // Initially show all brands
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Update available brands when category changes
  useEffect(() => {
    const updateAvailableBrands = async () => {
      if (localFilters.category) {
        try {
          const categoryBrands = await productService.getBrandsByCategory(localFilters.category);
          setAvailableBrands(categoryBrands);
        } catch (error) {
          console.error('Failed to load brands for category:', error);
          setAvailableBrands(allBrands); // Fallback to all brands
        }
      } else {
        setAvailableBrands(allBrands); // Show all brands when no category selected
      }
    };

    updateAvailableBrands();
  }, [localFilters.category, allBrands]);

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(state.filters);
  }, [state.filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters };

    if (value === undefined || value === '' || value === null) {
      // Remove the filter if value is empty/undefined
      delete newFilters[key];
    } else {
      // Set the filter value
      newFilters[key] = value;
    }

    // If category changes, clear the brand filter since available brands will change
    if (key === 'category') {
      delete newFilters.brand;

      // For category changes, apply immediately to update available brands
      setLocalFilters(newFilters);
      actions.setFilters(newFilters);

      // Update URL immediately for category changes
      const newSearchParams = new URLSearchParams(searchParams);
      if (newFilters.category) {
        newSearchParams.set('category', newFilters.category);
      } else {
        newSearchParams.delete('category');
      }
      // Remove brand from URL since it was cleared
      newSearchParams.delete('brand');
      setSearchParams(newSearchParams);

      return; // Exit early since we've already applied the changes
    }

    // For brand changes to "All Brands" (empty value), apply immediately
    if (key === 'brand' && (value === undefined || value === '' || value === null)) {
      // Update local state first
      setLocalFilters(newFilters);

      // Apply to global state immediately - use replaceFilters to ensure brand is completely removed
      actions.replaceFilters(newFilters as SearchFilters);

      // Update URL immediately to remove brand parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('brand');
      setSearchParams(newSearchParams);

      return; // Exit early since we've already applied the changes
    }

    // For rating changes to "Any Rating" (empty value), apply immediately
    if (key === 'minRating' && (value === undefined || value === '' || value === null)) {
      // Update local state first
      setLocalFilters(newFilters);

      // Apply to global state immediately - use replaceFilters to ensure rating filter is completely removed
      actions.replaceFilters(newFilters as SearchFilters);

      // Update URL immediately to remove rating parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('minRating');
      setSearchParams(newSearchParams);

      return; // Exit early since we've already applied the changes
    }

    setLocalFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    // Apply the local filters to global state
    actions.setFilters(localFilters);

    // Update URL to reflect applied filters
    const newSearchParams = new URLSearchParams(searchParams);

    // Handle category filter
    if (localFilters.category) {
      newSearchParams.set('category', localFilters.category);
    } else {
      newSearchParams.delete('category');
    }

    // Handle brand filter
    if (localFilters.brand) {
      newSearchParams.set('brand', localFilters.brand);
    } else {
      newSearchParams.delete('brand');
    }

    // Handle price filters
    if (localFilters.minPrice !== undefined) {
      newSearchParams.set('minPrice', localFilters.minPrice.toString());
    } else {
      newSearchParams.delete('minPrice');
    }

    if (localFilters.maxPrice !== undefined) {
      newSearchParams.set('maxPrice', localFilters.maxPrice.toString());
    } else {
      newSearchParams.delete('maxPrice');
    }

    // Handle rating filter
    if (localFilters.minRating !== undefined) {
      newSearchParams.set('minRating', localFilters.minRating.toString());
    } else {
      newSearchParams.delete('minRating');
    }

    // Handle availability filter
    if (localFilters.availabilityStatus) {
      newSearchParams.set('availabilityStatus', localFilters.availabilityStatus);
    } else {
      newSearchParams.delete('availabilityStatus');
    }

    setSearchParams(newSearchParams);
  };

  // Clear all filters - reset to exact same state as page refresh
  const clearFilters = async () => {
    // Reset the entire state to initial state (same as page refresh)
    actions.resetState();

    // Reset local filter state
    setLocalFilters({});

    // Reset available brands to all brands (default state)
    setAvailableBrands(allBrands);

    // Clear URL parameters related to filters (navigate to clean /search)
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);

    // Reload products to match page refresh behavior
    await actions.loadProducts();
  };

  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = SORT_OPTIONS.find(option => 
      `${option.field}_${option.direction}` === e.target.value
    );
    if (sortOption) {
      actions.setSortOption(sortOption);
    }
  };

  // Remove specific filter - behave as if it was never applied
  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];

    // Handle hierarchical dependencies
    if (key === 'category') {
      // If removing category, also remove brand since it depends on category
      delete newFilters.brand;
      // Reset available brands to all brands
      setAvailableBrands(allBrands);
    }

    // Update local and global state
    setLocalFilters(newFilters);
    actions.setFilters(newFilters);

    // Update URL to reflect filter removal - handle all possible filter parameters
    const newSearchParams = new URLSearchParams(searchParams);

    // Remove the specific filter parameter
    if (key === 'category') {
      newSearchParams.delete('category');
      newSearchParams.delete('brand'); // Also remove brand when category is removed
    } else if (key === 'brand') {
      newSearchParams.delete('brand');
    } else if (key === 'minPrice') {
      newSearchParams.delete('minPrice');
    } else if (key === 'maxPrice') {
      newSearchParams.delete('maxPrice');
    } else if (key === 'minRating') {
      newSearchParams.delete('minRating');
    } else if (key === 'availabilityStatus') {
      newSearchParams.delete('availabilityStatus');
    }

    setSearchParams(newSearchParams);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active: Array<{ key: keyof SearchFilters; label: string; value: string }> = [];
    
    if (state.filters.brand) {
      active.push({ key: 'brand', label: 'Brand', value: state.filters.brand });
    }
    if (state.filters.category) {
      active.push({ key: 'category', label: 'Category', value: state.filters.category });
    }
    if (state.filters.minPrice !== undefined) {
      active.push({ key: 'minPrice', label: 'Min Price', value: `$${state.filters.minPrice}` });
    }
    if (state.filters.maxPrice !== undefined) {
      active.push({ key: 'maxPrice', label: 'Max Price', value: `$${state.filters.maxPrice}` });
    }
    if (state.filters.minRating !== undefined) {
      active.push({ key: 'minRating', label: 'Min Rating', value: `${state.filters.minRating}★` });
    }
    if (state.filters.availabilityStatus) {
      active.push({ key: 'availabilityStatus', label: 'Availability', value: state.filters.availabilityStatus });
    }

    return active;
  };

  const activeFilters = getActiveFilters();

  // Simple comparison that handles undefined values properly
  const hasFiltersChanged = (() => {
    const localKeys = Object.keys(localFilters);
    const stateKeys = Object.keys(state.filters);

    // Check if different number of filters
    if (localKeys.length !== stateKeys.length) {
      return true;
    }

    // Check each filter value
    for (const key of localKeys) {
      if (localFilters[key as keyof SearchFilters] !== state.filters[key as keyof SearchFilters]) {
        return true;
      }
    }

    // Check for filters that exist in state but not in local (i.e., were removed)
    for (const key of stateKeys) {
      if (!(key in localFilters)) {
        return true;
      }
    }

    return false;
  })();

  return (
    <FilterContainer className={className}>
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <FilterSection>
          <FilterTitle>
            <i className="fas fa-filter" />
            Active Filters
          </FilterTitle>
          <ActiveFiltersContainer>
            {activeFilters.map(filter => (
              <ActiveFilterTag key={filter.key}>
                {filter.label}: {filter.value}
                <RemoveFilterButton onClick={() => removeFilter(filter.key)}>
                  <i className="fas fa-times" />
                </RemoveFilterButton>
              </ActiveFilterTag>
            ))}
          </ActiveFiltersContainer>
        </FilterSection>
      )}

      {/* Sort Options */}
      <FilterSection>
        <FilterTitle>
          <i className="fas fa-sort" />
          Sort By
        </FilterTitle>
        <Select
          value={`${state.sortOption.field}_${state.sortOption.direction}`}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map(option => (
            <option key={`${option.field}_${option.direction}`} value={`${option.field}_${option.direction}`}>
              {option.label}
            </option>
          ))}
        </Select>
      </FilterSection>

      {/* Filter Options */}
      <FilterSection>
        <FilterTitle>
          <i className="fas fa-sliders-h" />
          Filters
        </FilterTitle>
        
        <FilterGrid>
          {/* Category Filter - First */}
          <FilterGroup>
            <Label>Category</Label>
            <Select
              value={localFilters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </FilterGroup>

          {/* Brand Filter - Second (depends on category) */}
          <FilterGroup>
            <Label>Brand</Label>
            <Select
              value={localFilters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
              disabled={!localFilters.category} // Disable if no category selected
            >
              <option value="">
                {localFilters.category ? 'All Brands' : 'Select Category First'}
              </option>
              {availableBrands.map((brand: string) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FilterGroup>

          {/* Price Range */}
          <FilterGroup>
            <Label>Price Range</Label>
            <RangeContainer>
              <RangeInput
                type="number"
                placeholder="Min"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                step="0.01"
              />
              <RangeSeparator>to</RangeSeparator>
              <RangeInput
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                min="0"
                step="0.01"
              />
            </RangeContainer>
          </FilterGroup>

          {/* Rating Filter */}
          <FilterGroup>
            <Label>Minimum Rating</Label>
            <Select
              value={localFilters.minRating || ''}
              onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
              <option value="1">1★ & above</option>
            </Select>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      {/* Filter Actions */}
      <FilterActions justify="space-between" wrap>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          disabled={activeFilters.length === 0}
        >
          <i className="fas fa-times" />
          Clear All
        </Button>
        
        <Button
          variant="primary"
          size="sm"
          onClick={applyFilters}
          disabled={!hasFiltersChanged}
        >
          <i className="fas fa-check" />
          Apply Filters
        </Button>
      </FilterActions>
    </FilterContainer>
  );
};
