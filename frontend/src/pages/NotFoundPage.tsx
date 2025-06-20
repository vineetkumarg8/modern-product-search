import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Section, FlexContainer, Button } from '../styles/AppStyles';

// Styled components
const NotFoundContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  line-height: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 6rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 4rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 500px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const ActionButtons = styled(FlexContainer)`
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const IllustrationContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 6rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

/**
 * NotFoundPage Component
 * 404 error page with navigation options
 */
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <Section>
      <Container>
        <NotFoundContainer>
          <IllustrationContainer>
            <i className="fas fa-search" />
          </IllustrationContainer>
          
          <ErrorCode>404</ErrorCode>
          
          <ErrorTitle>Page Not Found</ErrorTitle>
          
          <ErrorMessage>
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL. Let's get you back on track!
          </ErrorMessage>
          
          <ActionButtons justify="center" wrap>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleGoHome}
            >
              <i className="fas fa-home" />
              Go Home
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSearch}
            >
              <i className="fas fa-search" />
              Search Products
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg"
              onClick={handleGoBack}
            >
              <i className="fas fa-arrow-left" />
              Go Back
            </Button>
          </ActionButtons>
        </NotFoundContainer>
      </Container>
    </Section>
  );
};
