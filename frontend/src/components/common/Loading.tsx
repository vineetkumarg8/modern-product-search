import React from 'react';
import styled, { keyframes } from 'styled-components';

// Loading animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -30px, 0); }
  70% { transform: translate3d(0, -15px, 0); }
  90% { transform: translate3d(0, -4px, 0); }
`;

// Styled components
const LoadingContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['fullScreen', 'overlay'].includes(prop),
})<{ fullScreen?: boolean; overlay?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ fullScreen }) => fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  `}

  ${({ overlay, theme }) => overlay && `
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
  `}

  ${({ fullScreen, theme }) => !fullScreen && `
    padding: ${theme.spacing.xl};
  `}
`;

const SpinnerContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg'; color?: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      default: return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      default: return '40px';
    }
  }};
  border: ${({ size }) => {
    switch (size) {
      case 'sm': return '2px';
      case 'lg': return '4px';
      default: return '3px';
    }
  }} solid ${({ theme }) => theme.colors.border};
  border-top: ${({ size }) => {
    switch (size) {
      case 'sm': return '2px';
      case 'lg': return '4px';
      default: return '3px';
    }
  }} solid ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Dot = styled.div<{ delay?: number; color?: string }>`
  width: 8px;
  height: 8px;
  background: ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${({ delay }) => delay || 0}s;
`;

const PulseCircle = styled.div<{ size?: 'sm' | 'md' | 'lg'; color?: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '30px';
      case 'lg': return '80px';
      default: return '50px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '30px';
      case 'lg': return '80px';
      default: return '50px';
    }
  }};
  background: ${({ color, theme }) => color || theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingText = styled.p<{ size?: 'sm' | 'md' | 'lg' }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.sm;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.md;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-align: center;
  margin: 0;
`;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SkeletonItem = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.surface} 25%, 
    ${({ theme }) => theme.colors.border} 50%, 
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '20px'};
`;

// Component interfaces
interface LoadingProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

interface SkeletonProps {
  lines?: number;
  className?: string;
}

/**
 * Loading Component
 * Displays various loading indicators with customizable appearance
 */
export const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  size = 'md',
  color,
  message,
  fullScreen = false,
  overlay = false,
  className,
}) => {
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'dots':
        return (
          <DotsContainer>
            <Dot color={color} delay={0} />
            <Dot color={color} delay={0.16} />
            <Dot color={color} delay={0.32} />
          </DotsContainer>
        );
      
      case 'pulse':
        return <PulseCircle size={size} color={color} />;
      
      case 'skeleton':
        return <SkeletonLoader />;
      
      default:
        return (
          <SpinnerContainer>
            <Spinner size={size} color={color} />
          </SpinnerContainer>
        );
    }
  };

  return (
    <LoadingContainer 
      fullScreen={fullScreen} 
      overlay={overlay} 
      className={className}
    >
      {renderLoadingIndicator()}
      {message && <LoadingText size={size}>{message}</LoadingText>}
    </LoadingContainer>
  );
};

/**
 * Skeleton Loader Component
 * Displays placeholder content while loading
 */
export const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  lines = 3, 
  className 
}) => {
  return (
    <SkeletonContainer className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonItem 
          key={index}
          width={index === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </SkeletonContainer>
  );
};

/**
 * Product Card Skeleton
 * Specific skeleton for product cards
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <SkeletonContainer>
      <SkeletonItem height="200px" /> {/* Image */}
      <SkeletonItem height="24px" width="80%" /> {/* Title */}
      <SkeletonItem height="16px" width="60%" /> {/* Price */}
      <SkeletonItem height="16px" width="40%" /> {/* Rating */}
    </SkeletonContainer>
  );
};

/**
 * Inline Loading Component
 * Small loading indicator for buttons and inline elements
 */
export const InlineLoading: React.FC<{ size?: 'sm' | 'md'; color?: string }> = ({ 
  size = 'sm', 
  color 
}) => {
  return <Spinner size={size} color={color} />;
};

/**
 * Loading Overlay Component
 * Full-screen overlay with loading indicator
 */
export const LoadingOverlay: React.FC<{ message?: string; visible?: boolean }> = ({ 
  message = 'Loading...', 
  visible = true 
}) => {
  if (!visible) return null;

  return (
    <Loading 
      type="spinner" 
      size="lg" 
      message={message} 
      fullScreen 
      overlay 
    />
  );
};
