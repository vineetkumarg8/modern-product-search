import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, FlexContainer } from '../../styles/AppStyles';

// Styled components
const FooterContainer = styled.footer`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const FooterContent = styled(Container)`
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg}`};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding-top: ${({ theme }) => theme.spacing.md};
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TechBadge = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ApiStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const StatusDot = styled.div<{ status: 'online' | 'offline' | 'loading' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'online': return theme.colors.success;
      case 'offline': return theme.colors.error;
      case 'loading': return theme.colors.warning;
      default: return theme.colors.border;
    }
  }};
  
  ${({ status }) => status === 'loading' && `
    animation: pulse 2s infinite;
  `}
`;

/**
 * Footer Component
 * Application footer with links, information, and status
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FlexContainer 
          direction="row" 
          justify="space-between" 
          align="flex-start"
          wrap
          gap="2rem"
        >
          {/* About Section */}
          <FooterSection>
            <FooterTitle>Product Search</FooterTitle>
            <FooterText>
              A modern React application for searching and filtering products 
              with powerful search capabilities and responsive design.
            </FooterText>
            <TechStack>
              <TechBadge>React 18</TechBadge>
              <TechBadge>TypeScript</TechBadge>
              <TechBadge>Styled Components</TechBadge>
              <TechBadge>Spring Boot API</TechBadge>
            </TechStack>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink to="/">
              <i className="fas fa-home" /> Home
            </FooterLink>
            <FooterLink to="/search">
              <i className="fas fa-search" /> Search Products
            </FooterLink>
            <FooterLink to="/search?category=beauty">
              <i className="fas fa-palette" /> Beauty Products
            </FooterLink>
            <FooterLink to="/search?category=electronics">
              <i className="fas fa-laptop" /> Electronics
            </FooterLink>
          </FooterSection>

          {/* API Status & Social */}
          <FooterSection>
            <FooterTitle>Connect</FooterTitle>
            <ApiStatus>
              <StatusDot status="online" />
              <FooterText>API Status: Online</FooterText>
            </ApiStatus>
            <SocialLinks>
              <SocialLink 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="GitHub"
              >
                <i className="fab fa-github" />
              </SocialLink>
              <SocialLink 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin" />
              </SocialLink>
              <SocialLink 
                href="mailto:contact@example.com"
                title="Email"
              >
                <i className="fas fa-envelope" />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
        </FlexContainer>

        {/* Copyright */}
        <Copyright>
          <FlexContainer 
            direction="column" 
            align="center" 
            gap="0.5rem"
          >
            <div>
              © {currentYear} Product Search Application.
            </div>
          </FlexContainer>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};
