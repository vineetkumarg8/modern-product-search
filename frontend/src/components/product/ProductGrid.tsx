import React, { useMemo, useState, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import styled from 'styled-components';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../common/Loading';
import { Grid as StyledGrid, FlexContainer } from '../../styles/AppStyles';

// Styled components
const GridContainer = styled.div`
  width: 100%;
`;

const VirtualGridContainer = styled.div`
  width: 100%;
  height: 600px; /* Fixed height for virtualization */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 500px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 400px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 400px;
`;

const GridStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: flex-start;
  }
`;

const ResultsCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.background};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.secondary : theme.colors.surface};
  }
`;

// Component interfaces
interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  enableVirtualization?: boolean;
  showStats?: boolean;
  className?: string;
}

interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    products: Product[];
    columnsPerRow: number;
    cardWidth: number;
    cardHeight: number;
  };
}

// Grid cell component for virtualization
const GridCell: React.FC<GridCellProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { products, columnsPerRow } = data;
  const index = rowIndex * columnsPerRow + columnIndex;
  const product = products[index];

  if (!product) {
    return <div style={style} />;
  }

  return (
    <div style={{ ...style, padding: '8px' }}>
      <ProductCard product={product} />
    </div>
  );
};

/**
 * ProductGrid Component
 * Displays products in a responsive grid with optional virtualization for performance
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
  enableVirtualization = false,
  showStats = true,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate grid dimensions for virtualization
  const gridDimensions = useMemo(() => {
    const containerWidth = window.innerWidth - 64; // Account for padding
    const cardWidth = 280;
    const cardHeight = 400;
    const gap = 16;
    
    let columnsPerRow = Math.floor((containerWidth + gap) / (cardWidth + gap));
    columnsPerRow = Math.max(1, Math.min(columnsPerRow, 6)); // Min 1, max 6 columns
    
    const rowCount = Math.ceil(products.length / columnsPerRow);
    
    return {
      columnsPerRow,
      rowCount,
      cardWidth,
      cardHeight: cardHeight + gap,
      totalWidth: columnsPerRow * (cardWidth + gap) - gap,
    };
  }, [products.length]);

  // Memoized grid data for virtualization
  const gridData = useMemo(() => ({
    products,
    columnsPerRow: gridDimensions.columnsPerRow,
    cardWidth: gridDimensions.cardWidth,
    cardHeight: gridDimensions.cardHeight,
  }), [products, gridDimensions]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  // Render loading state
  if (loading) {
    return (
      <GridContainer className={className}>
        {showStats && (
          <GridStats>
            <ResultsCount>Loading products...</ResultsCount>
          </GridStats>
        )}
        <StyledGrid responsive minColumnWidth="280px">
          {Array.from({ length: 12 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </StyledGrid>
      </GridContainer>
    );
  }

  // Render error state
  if (error) {
    return (
      <GridContainer className={className}>
        <EmptyState>
          <EmptyIcon>
            <i className="fas fa-exclamation-triangle" />
          </EmptyIcon>
          <EmptyTitle>Error Loading Products</EmptyTitle>
          <EmptyMessage>{error}</EmptyMessage>
        </EmptyState>
      </GridContainer>
    );
  }

  // Render empty state
  if (!products || products.length === 0) {
    return (
      <GridContainer className={className}>
        <EmptyState>
          <EmptyIcon>
            <i className="fas fa-search" />
          </EmptyIcon>
          <EmptyTitle>No Products Found</EmptyTitle>
          <EmptyMessage>
            We couldn't find any products matching your criteria. 
            Try adjusting your search terms or filters.
          </EmptyMessage>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer className={className}>
      {/* Grid Statistics and Controls */}
      {showStats && (
        <GridStats>
          <ResultsCount>
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </ResultsCount>
          
          <FlexContainer align="center" gap="1rem">
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => handleViewModeChange('grid')}
                title="Grid View"
              >
                <i className="fas fa-th" />
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => handleViewModeChange('list')}
                title="List View"
              >
                <i className="fas fa-list" />
              </ViewButton>
            </ViewToggle>
          </FlexContainer>
        </GridStats>
      )}

      {/* Product Grid */}
      {enableVirtualization && products.length > 50 ? (
        // Virtualized grid for large datasets
        <VirtualGridContainer>
          <Grid
            columnCount={gridDimensions.columnsPerRow}
            columnWidth={gridDimensions.cardWidth + 16}
            height={600}
            rowCount={gridDimensions.rowCount}
            rowHeight={gridDimensions.cardHeight}
            width={gridDimensions.totalWidth}
            itemData={gridData}
          >
            {GridCell}
          </Grid>
        </VirtualGridContainer>
      ) : (
        // Regular grid
        <StyledGrid 
          responsive 
          minColumnWidth={viewMode === 'grid' ? '280px' : '100%'}
          columns={viewMode === 'list' ? 1 : undefined}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact={viewMode === 'list'}
            />
          ))}
        </StyledGrid>
      )}
    </GridContainer>
  );
};
