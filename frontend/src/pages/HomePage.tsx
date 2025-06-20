import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Section, FlexContainer, Button, Card } from '../styles/AppStyles';
import { SearchBar } from '../components/search/SearchBar';
import { ProductGrid } from '../components/product/ProductGrid';
import { Loading } from '../components/common/Loading';

import { useProductSearch } from '../contexts/ProductSearchContext';

// Styled components
const HeroSection = styled(Section)`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing.xxl} 0`};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const SearchSection = styled.div`
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const FeaturesSection = styled(Section)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  transition: transform ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const QuickActionsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const QuickActionsTitle = styled.h2`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const RecentProductsSection = styled(Section)`
  background: rgba(255, 255, 255, 0.6);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/**
 * HomePage Component
 * Landing page with hero section, search bar, features, and recent products
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, actions } = useProductSearch();
  const [recentProducts, setRecentProducts] = useState(state.products.slice(0, 8));
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    brands: 0,
  });


  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load some products for display
        if (state.products.length === 0) {
          await actions.loadProducts(0, 12);
        }
        
        // Update recent products
        setRecentProducts(state.products.slice(0, 8));
        
        // Calculate stats
        const uniqueCategories = new Set(state.products.map(p => p.category)).size;
        const uniqueBrands = new Set(state.products.map(p => p.brand)).size;
        
        setStats({
          totalProducts: state.pagination.totalElements || state.products.length,
          categories: uniqueCategories,
          brands: uniqueBrands,
        });
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [actions, state.products, state.pagination.totalElements]);

  // Handle search from hero section
  const handleHeroSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'beauty':
        navigate('/search?category=beauty');
        break;
      case 'electronics':
        navigate('/search?category=electronics');
        break;
      case 'clothing':
        navigate('/search?category=clothing');
        break;
      case 'home':
        navigate('/search?category=home-decoration');
        break;
      case 'load-data':
        actions.loadData();
        break;
      default:
        navigate('/search');
    }
  };

  const features = [
    {
      icon: 'fas fa-search',
      title: 'Powerful Search',
      description: 'Find products quickly with our advanced search engine that supports fuzzy matching and suggestions.',
    },
    {
      icon: 'fas fa-filter',
      title: 'Smart Filtering',
      description: 'Filter products by brand, category, price range, and rating with real-time client-side filtering.',
    },
    {
      icon: 'fas fa-sort',
      title: 'Flexible Sorting',
      description: 'Sort products by price, rating, name, or date with instant client-side sorting for better performance.',
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Responsive Design',
      description: 'Enjoy a seamless experience across all devices with our mobile-first responsive design.',
    },
    {
      icon: 'fas fa-bolt',
      title: 'Fast Performance',
      description: 'Experience lightning-fast performance with lazy loading, virtualization, and optimized rendering.',
    },
    {
      icon: 'fas fa-heart',
      title: 'User Friendly',
      description: 'Intuitive interface designed with user experience in mind, making product discovery effortless.',
    },
  ];

  const quickActions = [
    { icon: 'fas fa-palette', title: 'Beauty Products', action: 'beauty' },
    { icon: 'fas fa-laptop', title: 'Electronics', action: 'electronics' },
    { icon: 'fas fa-tshirt', title: 'Clothing', action: 'clothing' },
    { icon: 'fas fa-home', title: 'Home & Decor', action: 'home' },
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <HeroTitle>Find Your Perfect Product</HeroTitle>
          <HeroSubtitle>
            Search through thousands of products with our powerful search engine. 
            Filter, sort, and discover exactly what you're looking for.
          </HeroSubtitle>
          
          <SearchSection>
            <SearchBar 
              size="lg" 
              placeholder="Search for products, brands, categories..."
              onSearch={handleHeroSearch}
              autoFocus
            />
          </SearchSection>

          {/* Stats */}
          <StatsContainer>
            <StatCard>
              <StatNumber>{stats.totalProducts.toLocaleString()}</StatNumber>
              <StatLabel>Products</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.categories}</StatNumber>
              <StatLabel>Categories</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.brands}</StatNumber>
              <StatLabel>Brands</StatLabel>
            </StatCard>
          </StatsContainer>
        </Container>
      </HeroSection>

      {/* Quick Actions */}
      <Section>
        <Container>
          <QuickActionsSection>
            <QuickActionsTitle>Browse by Category</QuickActionsTitle>
            <QuickActionsGrid>
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  shadow
                  hover
                >
                  <FlexContainer align="center" gap="1rem">
                    <div style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>
                      <i className={action.icon} />
                    </div>
                    <div>
                      <h4>{action.title}</h4>
                    </div>
                  </FlexContainer>
                </QuickActionCard>
              ))}
            </QuickActionsGrid>
          </QuickActionsSection>
        </Container>
      </Section>

      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <SectionTitle>Why Choose Our Product Search?</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index} shadow>
                <FeatureIcon>
                  <i className={feature.icon} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>

          <FlexContainer justify="center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/search')}
            >
              <i className="fas fa-search" />
              Start Searching
            </Button>
          </FlexContainer>
        </Container>
      </FeaturesSection>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <RecentProductsSection>
          <Container>
            <SectionTitle>Featured Products</SectionTitle>
            {state.loading ? (
              <Loading message="Loading featured products..." />
            ) : (
              <ProductGrid 
                products={recentProducts}
                showStats={false}
              />
            )}
            
            <FlexContainer justify="center" style={{ marginTop: '2rem' }}>
              <Button 
                variant="outline" 
                onClick={() => navigate('/search')}
              >
                View All Products
                <i className="fas fa-arrow-right" />
              </Button>
            </FlexContainer>
          </Container>
        </RecentProductsSection>
      )}
    </>
  );
};
