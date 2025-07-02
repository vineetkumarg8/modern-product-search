import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Section, FlexContainer, Button, Card } from '../styles/AppStyles';
import { SearchBar } from '../components/search/SearchBar';
import { ProductGrid } from '../components/product/ProductGrid';
import { Loading } from '../components/common/Loading';
import { Product } from '../types';

import { useProductSearch } from '../contexts/ProductSearchContext';
import { productService } from '../services/productService';

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

const CategoryGroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
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

const CategoryGroupCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const CategoryEmoji = styled.div`
  font-size: 2.5rem;
  line-height: 1;
`;

const CategoryGroupInfo = styled.div`
  flex: 1;
`;

const CategoryGroupTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const CategoryGroupCount = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SubcategoriesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SubcategoryItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubcategoryName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 2px;
`;

const SubcategoryCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0.8;
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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: 0,
    brands: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoadAttempted, setDataLoadAttempted] = useState(false);


  // Load initial data - separate from search results
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only load if we don't have featured products yet
        if (featuredProducts.length === 0) {
          console.log('🔄 Loading initial data...');

          // Load featured products (first 12 for display)
          const featuredResponse = await productService.getProducts({ page: 0, size: 12 });

          // If no products found, try to load data automatically
          if (featuredResponse.totalElements === 0) {
            const isProduction = window.location.hostname !== 'localhost';
            const environment = isProduction ? 'production' : 'development';
            console.log(`⚠️ No products found (environment: ${environment}), attempting to load data automatically...`);

            setDataLoadAttempted(true);
            try {
              await actions.loadData();
              console.log('✅ Data load initiated, retrying product fetch...');

              // Retry loading products after data load
              const retryResponse = await productService.getProducts({ page: 0, size: 12 });
              setFeaturedProducts(retryResponse.content.slice(0, 8));

              // Update featured response for stats calculation
              if (retryResponse.totalElements > 0) {
                featuredResponse.totalElements = retryResponse.totalElements;
                featuredResponse.totalPages = retryResponse.totalPages;
                featuredResponse.content = retryResponse.content;
                console.log(`✅ Auto-loaded ${retryResponse.totalElements} products successfully`);
              } else {
                throw new Error('No products available after data load attempt');
              }
            } catch (dataLoadError: any) {
              console.error('❌ Auto data loading failed:', dataLoadError);
              const errorMessage = dataLoadError.message || 'Failed to load data from external API';
              setError(`Unable to load product data: ${errorMessage}. This could be due to network connectivity issues or backend server not running.`);
              return; // Exit early on data load failure
            }
          } else {
            setFeaturedProducts(featuredResponse.content.slice(0, 8));
            console.log(`✅ Loaded ${featuredResponse.totalElements} products from database`);
          }

          // Load all products to calculate accurate stats (with safety limits)
          const totalPages = Math.min(featuredResponse.totalPages, 10); // Safety limit: max 10 pages
          let allProducts: any[] = [];

          // Only load if we have actual products and reasonable page count
          if (featuredResponse.totalElements > 0 && totalPages > 0 && totalPages <= 10) {
            // Load all pages to get complete data for stats
            for (let page = 0; page < totalPages; page++) {
              const pageResponse = await productService.getProducts({
                page,
                size: 20 // Use reasonable page size
              });
              allProducts = allProducts.concat(pageResponse.content);

              // Safety break if we get enough products
              if (allProducts.length >= featuredResponse.totalElements) {
                break;
              }
            }
          }

          // Calculate accurate stats from all products
          const uniqueCategories = allProducts.length > 0
            ? new Set(allProducts.map(p => p.category).filter(c => c && c.trim())).size
            : 0;
          const uniqueBrands = allProducts.length > 0
            ? new Set(allProducts.map(p => p.brand).filter(b => b && b.trim())).size
            : 0;

          setStats({
            totalProducts: featuredResponse.totalElements,
            categories: uniqueCategories,
            brands: uniqueBrands,
          });
        }
      } catch (error: any) {
        console.error('❌ Failed to load initial data:', error);
        const errorMessage = error.message || 'Unknown error occurred';
        setError(`Failed to connect to the backend server: ${errorMessage}. Please check if the backend is running on port 8080.`);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array - only run once on mount

  // Manual data loading function
  const handleLoadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Manually loading data from external API...');

      await actions.loadData();

      // Reload the page data
      const response = await productService.getProducts({ page: 0, size: 12 });
      setFeaturedProducts(response.content.slice(0, 8));

      // Recalculate stats
      const allResponse = await productService.getProducts({ page: 0, size: 100 });
      const allProducts = allResponse.content;

      const uniqueCategories = new Set(allProducts.map(p => p.category).filter(c => c && c.trim())).size;
      const uniqueBrands = new Set(allProducts.map(p => p.brand).filter(b => b && b.trim())).size;

      setStats({
        totalProducts: response.totalElements,
        categories: uniqueCategories,
        brands: uniqueBrands,
      });

      console.log('✅ Data loaded successfully');
    } catch (error: any) {
      console.error('❌ Manual data loading failed:', error);
      setError(`Failed to load data: ${error.message || 'Unknown error'}. Please check your network connection and backend server.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle search from hero section
  const handleHeroSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Category group handlers
  const handleCategoryGroup = (action: string) => {
    switch (action) {
      case 'beauty-group':
        // Navigate to search with all beauty-related categories
        navigate('/search?categories=beauty,fragrances,skin-care');
        break;
      case 'fashion-group':
        // Navigate to search with all fashion-related categories
        navigate('/search?categories=mens-shirts,mens-shoes,mens-watches,sunglasses,tops,womens-bags,womens-dresses,womens-jewellery,womens-shoes,womens-watches');
        break;
      case 'electronics-group':
        // Navigate to search with all electronics-related categories
        navigate('/search?categories=smartphones,tablets,laptops,mobile-accessories');
        break;
      case 'home-group':
        // Navigate to search with all home-related categories
        navigate('/search?categories=furniture,home-decoration,kitchen-accessories');
        break;
      case 'groceries-group':
        navigate('/search?category=groceries');
        break;
      case 'automobile-group':
        // Navigate to search with all automobile-related categories
        navigate('/search?categories=vehicle,motorcycle');
        break;
      case 'sports-group':
        navigate('/search?category=sports-accessories');
        break;
      case 'load-data':
        actions.loadData();
        break;
      default:
        navigate('/search');
    }
  };

  // Handle subcategory clicks
  const handleSubcategoryClick = (category: string) => {
    navigate(`/search?category=${category}`);
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

  const categoryGroups = [
    {
      emoji: '🧴',
      title: 'Beauty & Personal Care',
      action: 'beauty-group',
      productCount: 13,
      subcategories: [
        { name: 'Beauty', category: 'beauty', count: 5 },
        { name: 'Skin Care', category: 'skin-care', count: 3 },
        { name: 'Fragrances', category: 'fragrances', count: 5 }
      ]
    },
    {
      emoji: '🧍‍♂️🧍‍♀️',
      title: 'Fashion & Apparel',
      action: 'fashion-group',
      productCount: 39,
      subcategories: [
        { name: 'Men\'s Shirts', category: 'mens-shirts', count: 5 },
        { name: 'Men\'s Shoes', category: 'mens-shoes', count: 5 },
        { name: 'Men\'s Watches', category: 'mens-watches', count: 6 },
        { name: 'Sunglasses', category: 'sunglasses', count: 5 },
        { name: 'Tops', category: 'tops', count: 5 },
        { name: 'Women\'s Bags', category: 'womens-bags', count: 5 },
        { name: 'Women\'s Dresses', category: 'womens-dresses', count: 5 },
        { name: 'Women\'s Jewellery', category: 'womens-jewellery', count: 3 },
        { name: 'Women\'s Shoes', category: 'womens-shoes', count: 5 },
        { name: 'Women\'s Watches', category: 'womens-watches', count: 5 }
      ]
    },
    {
      emoji: '💻',
      title: 'Electronics & Gadgets',
      action: 'electronics-group',
      productCount: 38,
      subcategories: [
        { name: 'Smartphones', category: 'smartphones', count: 16 },
        { name: 'Tablets', category: 'tablets', count: 3 },
        { name: 'Laptops', category: 'laptops', count: 5 },
        { name: 'Mobile Accessories', category: 'mobile-accessories', count: 14 }
      ]
    },
    {
      emoji: '🏡',
      title: 'Home & Living',
      action: 'home-group',
      productCount: 40,
      subcategories: [
        { name: 'Furniture', category: 'furniture', count: 5 },
        { name: 'Home Decoration', category: 'home-decoration', count: 5 },
        { name: 'Kitchen Accessories', category: 'kitchen-accessories', count: 30 }
      ]
    },
    {
      emoji: '🛒',
      title: 'Groceries & Essentials',
      action: 'groceries-group',
      productCount: 27,
      subcategories: [
        { name: 'Groceries', category: 'groceries', count: 27 }
      ]
    },
    {
      emoji: '🏍️',
      title: 'Automobile & Outdoors',
      action: 'automobile-group',
      productCount: 10,
      subcategories: [
        { name: 'Motorcycle', category: 'motorcycle', count: 5 },
        { name: 'Vehicle', category: 'vehicle', count: 5 }
      ]
    },
    {
      emoji: '🏀',
      title: 'Sports & Fitness',
      action: 'sports-group',
      productCount: 17,
      subcategories: [
        { name: 'Sports Accessories', category: 'sports-accessories', count: 17 }
      ]
    }
  ];

  // Show loading state
  if (loading && !error) {
    return (
      <Section>
        <Container>
          <Loading message="Loading product data..." size="lg" />
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Error State */}
      {error && (
        <Section style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
          <Container>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ color: '#856404', marginBottom: '10px' }}>
                ⚠️ Connection Issue Detected
              </h3>
              <p style={{ color: '#856404', marginBottom: '20px' }}>
                {error}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={handleLoadData} disabled={loading}>
                  {loading ? '⏳ Loading...' : '🔄 Try Loading Data'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('/diagnostic.html', '_blank')}
                >
                  🔧 Run Diagnostics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  🔄 Refresh Page
                </Button>
              </div>
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '15px' }}>
                💡 <strong>Tip:</strong> If you're on a different device, make sure the backend server is running on port 8080.
                <br />
                Check the <a href="/diagnostic.html" target="_blank" style={{ color: '#007bff' }}>diagnostic tool</a> for detailed troubleshooting.
              </p>
            </div>
          </Container>
        </Section>
      )}

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

      {/* Category Groups */}
      <Section>
        <Container>
          <QuickActionsSection>
            <QuickActionsTitle>Browse by Category</QuickActionsTitle>
            <CategoryGroupsGrid>
              {categoryGroups.map((group, index) => (
                <CategoryGroupCard
                  key={index}
                  shadow
                  hover
                >
                  <CategoryGroupHeader onClick={() => handleCategoryGroup(group.action)}>
                    <CategoryEmoji>{group.emoji}</CategoryEmoji>
                    <CategoryGroupInfo>
                      <CategoryGroupTitle>{group.title}</CategoryGroupTitle>
                      <CategoryGroupCount>{group.productCount} products</CategoryGroupCount>
                    </CategoryGroupInfo>
                  </CategoryGroupHeader>

                  <SubcategoriesList>
                    {group.subcategories.map((subcategory, subIndex) => (
                      <SubcategoryItem
                        key={subIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubcategoryClick(subcategory.category);
                        }}
                      >
                        <SubcategoryName>{subcategory.name}</SubcategoryName>
                        <SubcategoryCount>{subcategory.count} items</SubcategoryCount>
                      </SubcategoryItem>
                    ))}
                  </SubcategoriesList>
                </CategoryGroupCard>
              ))}
            </CategoryGroupsGrid>
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

          <FlexContainer justify="center" gap="1rem">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/search')}
            >
              <i className="fas fa-search" />
              Start Searching
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadData}
              disabled={loading}
            >
              <i className="fas fa-database" />
              {loading ? 'Loading...' : 'Load Data'}
            </Button>
          </FlexContainer>
        </Container>
      </FeaturesSection>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <RecentProductsSection>
          <Container>
            <SectionTitle>Featured Products</SectionTitle>
            <ProductGrid
              products={featuredProducts}
              showStats={false}
            />

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
