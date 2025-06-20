import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { productService } from '../services/productService';
import { Container, Section, FlexContainer, Button, Badge, Card } from '../styles/AppStyles';
import { Loading } from '../components/common/Loading';

// Styled components
const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Thumbnail = styled.img<{ active: boolean }>`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  border: 2px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProductTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  margin: 0;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.disabled};
  text-decoration: line-through;
`;

const DiscountBadge = styled(Badge)`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${({ filled }) => filled ? '#fbbf24' : '#e5e7eb'};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const ProductDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SpecLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SpecValue = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Tag = styled(Badge)`
  background: rgba(102, 126, 234, 0.1);
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
`;

/**
 * ProductDetailPage Component
 * Displays detailed information about a specific product
 */
export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productService.getProductById(Number(id));
        setProduct(productData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Render stars
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

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (discount) {
      return price * (1 - discount / 100);
    }
    return price;
  };

  // Loading state
  if (loading) {
    return (
      <Section>
        <Container>
          <Loading message="Loading product details..." size="lg" />
        </Container>
      </Section>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Section>
        <Container>
          <ErrorContainer>
            <h2>Product Not Found</h2>
            <p>{error || 'The requested product could not be found.'}</p>
            <Button variant="primary" onClick={() => navigate('/search')}>
              Back to Search
            </Button>
          </ErrorContainer>
        </Container>
      </Section>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <Section>
      <Container>
        <ProductDetailContainer>
          <BackButton 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left" />
            Back
          </BackButton>

          <ProductHeader>
            {/* Image Section */}
            <ImageSection>
              <MainImage 
                src={images[selectedImageIndex]} 
                alt={product.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = product.thumbnail;
                }}
              />
              
              {images.length > 1 && (
                <ThumbnailGrid>
                  {images.map((image, index) => (
                    <Thumbnail
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      active={index === selectedImageIndex}
                      onClick={() => setSelectedImageIndex(index)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ))}
                </ThumbnailGrid>
              )}
            </ImageSection>

            {/* Product Info */}
            <ProductInfo>
              <ProductTitle>{product.title}</ProductTitle>
              
              <ProductMeta>
                <Badge variant="secondary">{product.brand}</Badge>
                <Badge>{product.category}</Badge>
                {product.availabilityStatus === 'In Stock' ? (
                  <Badge variant="success">In Stock ({product.stock})</Badge>
                ) : (
                  <Badge variant="error">Out of Stock</Badge>
                )}
              </ProductMeta>

              <PriceContainer>
                <CurrentPrice>${discountedPrice.toFixed(2)}</CurrentPrice>
                {hasDiscount && (
                  <>
                    <OriginalPrice>${product.price.toFixed(2)}</OriginalPrice>
                    <DiscountBadge>-{Math.round(product.discountPercentage!)}%</DiscountBadge>
                  </>
                )}
              </PriceContainer>

              <RatingContainer>
                <Stars>{renderStars(product.rating)}</Stars>
                <span>{product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)</span>
              </RatingContainer>

              <ProductDescription>{product.description}</ProductDescription>

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4>Tags:</h4>
                  <TagsContainer>
                    {product.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </TagsContainer>
                </div>
              )}

              <ActionButtons>
                <Button variant="primary" size="lg" disabled={product.availabilityStatus !== 'In Stock'}>
                  <i className="fas fa-shopping-cart" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <i className="fas fa-heart" />
                  Add to Wishlist
                </Button>
              </ActionButtons>
            </ProductInfo>
          </ProductHeader>

          {/* Product Specifications */}
          <Card padding="2rem" shadow>
            <h3>Product Specifications</h3>
            <SpecsGrid>
              <SpecItem>
                <SpecLabel>SKU:</SpecLabel>
                <SpecValue>{product.sku}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Brand:</SpecLabel>
                <SpecValue>{product.brand}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Category:</SpecLabel>
                <SpecValue>{product.category}</SpecValue>
              </SpecItem>
              {product.weight && (
                <SpecItem>
                  <SpecLabel>Weight:</SpecLabel>
                  <SpecValue>{product.weight}g</SpecValue>
                </SpecItem>
              )}
              {product.dimensions && (
                <SpecItem>
                  <SpecLabel>Dimensions:</SpecLabel>
                  <SpecValue>
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </SpecValue>
                </SpecItem>
              )}
              {product.warrantyInformation && (
                <SpecItem>
                  <SpecLabel>Warranty:</SpecLabel>
                  <SpecValue>{product.warrantyInformation}</SpecValue>
                </SpecItem>
              )}
              {product.shippingInformation && (
                <SpecItem>
                  <SpecLabel>Shipping:</SpecLabel>
                  <SpecValue>{product.shippingInformation}</SpecValue>
                </SpecItem>
              )}
              {product.returnPolicy && (
                <SpecItem>
                  <SpecLabel>Return Policy:</SpecLabel>
                  <SpecValue>{product.returnPolicy}</SpecValue>
                </SpecItem>
              )}
              {product.minimumOrderQuantity && (
                <SpecItem>
                  <SpecLabel>Min Order Qty:</SpecLabel>
                  <SpecValue>{product.minimumOrderQuantity}</SpecValue>
                </SpecItem>
              )}
            </SpecsGrid>
          </Card>
        </ProductDetailContainer>
      </Container>
    </Section>
  );
};
