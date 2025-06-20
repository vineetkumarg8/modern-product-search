import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Container, FlexContainer, Button } from '../../styles/AppStyles';
import { SearchBar } from '../search/SearchBar';
import { useProductSearch } from '../../contexts/ProductSearchContext';

// Styled components
const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const HeaderContent = styled(Container)`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 32px;
    height: 32px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: rgba(102, 126, 234, 0.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin: 0 ${({ theme }) => theme.spacing.md};
    max-width: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin: ${({ theme }) => `${theme.spacing.sm} 0`};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.md};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatusIndicator = styled.div<{ loading?: boolean; error?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ loading, error, theme }) => {
    if (error) return theme.colors.error;
    if (loading) return theme.colors.warning;
    return theme.colors.success;
  }};
`;

/**
 * Header Component
 * Main navigation header with logo, search bar, and navigation links
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const { state, actions } = useProductSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLoadData = async () => {
    try {
      await actions.loadData();
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <FlexContainer align="center" justify="space-between">
          {/* Logo */}
          <Logo to="/" onClick={closeMobileMenu}>
            <LogoIcon>
              <i className="fas fa-search" />
            </LogoIcon>
            <span className="tablet-up">Product Search</span>
          </Logo>

          {/* Desktop Navigation */}
          <Nav className="tablet-up">
            <NavLink to="/" active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/search" active={isActive('/search')}>
              Search
            </NavLink>
          </Nav>

          {/* Search Bar - Desktop */}
          <SearchContainer className="tablet-up">
            <SearchBar size="sm" />
          </SearchContainer>

          {/* Action Buttons - Desktop */}
          <ActionButtons>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadData}
              loading={state.loading}
              disabled={state.loading}
            >
              <i className="fas fa-download" />
              Load Data
            </Button>
            
            {/* Status Indicator */}
            <StatusIndicator loading={state.loading} error={!!state.error}>
              {state.loading && <i className="fas fa-spinner fa-spin" />}
              {state.error && <i className="fas fa-exclamation-triangle" />}
              {!state.loading && !state.error && <i className="fas fa-check-circle" />}
            </StatusIndicator>
          </ActionButtons>

          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={toggleMobileMenu} className="mobile-only">
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
          </MobileMenuButton>
        </FlexContainer>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen}>
          {/* Mobile Navigation Links */}
          <MobileNavLinks>
            <NavLink to="/" active={isActive('/')} onClick={closeMobileMenu}>
              <i className="fas fa-home" /> Home
            </NavLink>
            <NavLink to="/search" active={isActive('/search')} onClick={closeMobileMenu}>
              <i className="fas fa-search" /> Search
            </NavLink>
          </MobileNavLinks>

          {/* Mobile Search Bar */}
          <SearchContainer>
            <SearchBar size="sm" />
          </SearchContainer>

          {/* Mobile Action Buttons */}
          <MobileActionButtons>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadData}
              loading={state.loading}
              disabled={state.loading}
              fullWidth
            >
              <i className="fas fa-download" />
              Load Data
            </Button>
            
            <StatusIndicator loading={state.loading} error={!!state.error}>
              {state.loading && (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  Loading...
                </>
              )}
              {state.error && (
                <>
                  <i className="fas fa-exclamation-triangle" />
                  Error: {state.error}
                </>
              )}
              {!state.loading && !state.error && (
                <>
                  <i className="fas fa-check-circle" />
                  Ready
                </>
              )}
            </StatusIndicator>
          </MobileActionButtons>
        </MobileMenu>
      </HeaderContent>
    </HeaderContainer>
  );
};
