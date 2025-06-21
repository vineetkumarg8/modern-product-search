import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../../types';
import { Card, Badge, Button } from '../../styles/AppStyles';

// Styled components
const ProductCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transitions.normal};

  ${ProductCardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
`;

const DiscountBadge = styled(Badge)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const StockBadge = styled(Badge)<{ inStock: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  background: ${({ inStock, theme }) => inStock ? theme.colors.success : theme.colors.error};
  color: white;
`;

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProductTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: auto;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.disabled};
  text-decoration: line-through;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'filled',
})<{ filled: boolean }>`
  color: ${({ filled, theme }) => filled ? '#fbbf24' : theme.colors.border};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RatingText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Tag = styled(Badge)`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  background: rgba(102, 126, 234, 0.1);
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const BrandCategory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.disabled};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Component interface
interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * ProductCard Component
 * Displays product information in a card format with image, details, and actions
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showActions = true,
  compact = false,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} filled><i className="fas fa-star" /></Star>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} filled><i className="fas fa-star-half-alt" /></Star>);
      } else {
        stars.push(<Star key={i} filled={false}><i className="far fa-star" /></Star>);
      }
    }

    return stars;
  };

  const calculateDiscountedPrice = () => {
    if (product.discountPercentage) {
      return product.price * (1 - product.discountPercentage / 100);
    }
    return product.price;
  };

  const isInStock = product.stock > 0;
  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;

  return (
    <ProductCardContainer 
      as={Link} 
      to={`/product/${product.id}`}
      className={className}
      padding={compact ? '0.75rem' : '0'}
      shadow
      hover
    >
      {/* Product Image */}
      <ImageContainer>
        {imageError ? (
          <ImagePlaceholder>
            <i className="fas fa-image" />
          </ImagePlaceholder>
        ) : (
          <ProductImage
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Badges */}
        {hasDiscount && (
          <DiscountBadge variant="error">
            -{Math.round(product.discountPercentage!)}%
          </DiscountBadge>
        )}
        
        <StockBadge inStock={isInStock}>
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </StockBadge>
      </ImageContainer>

      {/* Product Content */}
      <ContentContainer>
        {/* Brand and Category */}
        <BrandCategory>
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </BrandCategory>

        {/* Title */}
        <ProductTitle>{product.title}</ProductTitle>

        {/* Description */}
        {!compact && (
          <ProductDescription>{product.description}</ProductDescription>
        )}

        {/* Meta Information */}
        <ProductMeta>
          {/* Price */}
          <PriceContainer>
            <Price>${discountedPrice.toFixed(2)}</Price>
            {hasDiscount && (
              <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
            )}
          </PriceContainer>

          {/* Rating */}
          <RatingContainer>
            <StarRating>
              {renderStars(product.rating)}
            </StarRating>
            <RatingText>
              {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
            </RatingText>
          </RatingContainer>

          {/* Tags */}
          {!compact && product.tags && product.tags.length > 0 && (
            <TagsContainer>
              {product.tags.slice(0, 3).map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
              {product.tags.length > 3 && (
                <Tag>+{product.tags.length - 3} more</Tag>
              )}
            </TagsContainer>
          )}

          {/* Actions */}
          {showActions && (
            <ActionContainer>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  // Navigation is handled by the parent Link wrapper
                }}
              >
                <i className="fas fa-eye" />
                View Details
              </Button>
            </ActionContainer>
          )}
        </ProductMeta>
      </ContentContainer>
    </ProductCardContainer>
  );
};
