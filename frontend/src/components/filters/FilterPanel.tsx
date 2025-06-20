import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  const [brands, setBrands] = useState<string[]>([]);
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
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(state.filters);
  }, [state.filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  // Apply filters
  const applyFilters = () => {
    actions.setFilters(localFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters: SearchFilters = {};
    setLocalFilters(emptyFilters);
    actions.setFilters(emptyFilters);
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

  // Remove specific filter
  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    actions.setFilters(newFilters);
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
  const hasFiltersChanged = JSON.stringify(localFilters) !== JSON.stringify(state.filters);

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
          {/* Brand Filter */}
          <FilterGroup>
            <Label>Brand</Label>
            <Select
              value={localFilters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FilterGroup>

          {/* Category Filter */}
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
