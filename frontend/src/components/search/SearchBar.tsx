import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProductSearch } from '../../contexts/ProductSearchContext';
import { SEARCH_CONFIG } from '../../config/api';
import { InlineLoading } from '../common/Loading';

// Styled components
const SearchContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  position: relative;
  width: 100%;
  max-width: ${({ size }) => {
    switch (size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      default: return '600px';
    }
  }};
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input<{ size?: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return `${theme.spacing.sm} ${theme.spacing.xxl} ${theme.spacing.sm} ${theme.spacing.lg}`;
      case 'lg': return `${theme.spacing.lg} ${theme.spacing.xxl} ${theme.spacing.lg} ${theme.spacing.xl}`;
      default: return `${theme.spacing.md} ${theme.spacing.xxl} ${theme.spacing.md} ${theme.spacing.lg}`;
    }
  }};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.md;
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.lg}, 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const SearchIcon = styled.button<{ size?: 'sm' | 'md' | 'lg' }>`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.md;
    }
  }};
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchButton = styled.button<{ size?: 'sm' | 'md' | 'lg'; loading?: boolean }>`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg': return `${theme.spacing.md} ${theme.spacing.lg}`;
      default: return `${theme.spacing.sm} ${theme.spacing.md}`;
    }
  }};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.md;
      default: return theme.typography.fontSize.sm;
    }
  }};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ loading }) => loading && `
    pointer-events: none;
  `}
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SuggestionItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  text-align: left;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.lg};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.lg};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 60px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.disabled};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

// Component interfaces
interface SearchBarProps {
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

/**
 * SearchBar Component
 * Google-style search bar with suggestions, debounced input, and keyboard navigation
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  size = 'md',
  placeholder = 'Search products...',
  autoFocus = false,
  showSuggestions = true,
  onSearch,
  className,
}) => {
  const navigate = useNavigate();
  const { state, actions } = useProductSearch();
  const [query, setQuery] = useState(state.searchQuery);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced suggestions fetch
  const debouncedGetSuggestions = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchQuery.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH && showSuggestions) {
        actions.getSuggestions(searchQuery);
      }
    }, SEARCH_CONFIG.DEBOUNCE_DELAY);
  }, [actions, showSuggestions]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestionIndex(-1);

    if (value.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      setShowSuggestionsList(true);
      debouncedGetSuggestions(value);
    } else {
      setShowSuggestionsList(false);
    }
  };

  // Handle search execution
  const handleSearch = async (searchQuery: string = query) => {
    if (searchQuery.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      return;
    }

    setIsSearching(true);
    setShowSuggestionsList(false);

    try {
      await actions.searchProducts(searchQuery);
      
      // Navigate to search results if callback not provided
      if (!onSearch) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      } else {
        onSearch(searchQuery);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);
    handleSearch(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList || state.suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < state.suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(state.suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <SearchContainer size={size} className={className}>
      <form onSubmit={handleSubmit}>
        <SearchInputContainer>
          <SearchIcon size={size} type="button" onClick={() => handleSearch()}>
            <i className="fas fa-search" />
          </SearchIcon>
          
          <SearchInput
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH && showSuggestions) {
                setShowSuggestionsList(true);
              }
            }}
            placeholder={placeholder}
            size={size}
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck="false"
          />
          
          {query && (
            <ClearButton type="button" onClick={handleClear}>
              <i className="fas fa-times" />
            </ClearButton>
          )}
          
          <SearchButton 
            type="submit" 
            size={size} 
            loading={isSearching}
            disabled={query.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH || isSearching}
          >
            {isSearching ? (
              <InlineLoading size="sm" color="white" />
            ) : (
              <>
                <i className="fas fa-search" />
                Search
              </>
            )}
          </SearchButton>
        </SearchInputContainer>
      </form>

      {showSuggestionsList && state.suggestions.length > 0 && (
        <SuggestionsContainer ref={suggestionsRef}>
          {state.suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                backgroundColor: index === selectedSuggestionIndex ? 
                  'var(--surface-color)' : 'transparent'
              }}
            >
              <i className="fas fa-search" style={{ opacity: 0.5 }} />
              {suggestion}
            </SuggestionItem>
          ))}
        </SuggestionsContainer>
      )}
    </SearchContainer>
  );
};
