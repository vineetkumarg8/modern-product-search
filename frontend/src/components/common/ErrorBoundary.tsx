import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { Container, Button, FlexContainer } from '../../styles/AppStyles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
`;

const ErrorCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  text-align: center;
  max-width: 600px;
  margin: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
    margin: ${({ theme }) => theme.spacing.md};
  }
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ErrorTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ErrorDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: left;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};

  summary {
    cursor: pointer;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  pre {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }
`;

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console and external error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <Container>
            <ErrorCard>
              <ErrorIcon>
                <i className="fas fa-exclamation-triangle" />
              </ErrorIcon>
              
              <ErrorTitle>Oops! Something went wrong</ErrorTitle>
              
              <ErrorMessage>
                We're sorry, but something unexpected happened. This error has been logged 
                and we'll look into it. Please try refreshing the page or go back to the home page.
              </ErrorMessage>

              <FlexContainer justify="center" gap="1rem" wrap>
                <Button onClick={this.handleReload} variant="primary">
                  <i className="fas fa-refresh" />
                  Reload Page
                </Button>
                <Button onClick={this.handleGoHome} variant="outline">
                  <i className="fas fa-home" />
                  Go Home
                </Button>
              </FlexContainer>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <ErrorDetails>
                  <summary>Error Details (Development Only)</summary>
                  <pre>
                    <strong>Error:</strong> {this.state.error.message}
                    {'\n\n'}
                    <strong>Stack Trace:</strong>
                    {'\n'}
                    {this.state.error.stack}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        <strong>Component Stack:</strong>
                        {'\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </ErrorDetails>
              )}
            </ErrorCard>
          </Container>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version of Error Boundary for functional components
 */
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You can implement custom error handling logic here
    // For example, show a toast notification or redirect to an error page
  };
};
