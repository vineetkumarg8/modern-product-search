import styled from 'styled-components';

export const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 140px); /* Account for header and footer */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: calc(100vh - 120px);
  }
`;

export const Container = styled.div<{ maxWidth?: string; padding?: string }>`
  max-width: ${({ maxWidth }) => maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${({ padding, theme }) => padding || `0 ${theme.spacing.lg}`};
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => `0 ${theme.spacing.sm}`};
  }
`;

export const Section = styled.section<{ padding?: string; background?: string }>`
  padding: ${({ padding, theme }) => padding || `${theme.spacing.xxl} 0`};
  background: ${({ background }) => background || 'transparent'};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => `${theme.spacing.xl} 0`};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => `${theme.spacing.lg} 0`};
  }
`;

export const Grid = styled.div.withConfig({
  shouldForwardProp: (prop) => !['columns', 'gap', 'minColumnWidth', 'responsive'].includes(prop),
})<{
  columns?: number;
  gap?: string;
  minColumnWidth?: string;
  responsive?: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ columns, minColumnWidth, responsive }) => {
    if (responsive) {
      return `repeat(auto-fill, minmax(${minColumnWidth || '280px'}, 1fr))`;
    }
    return `repeat(${columns || 1}, 1fr)`;
  }};
  gap: ${({ gap, theme }) => gap || theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'stretch'};
  gap: ${({ gap, theme }) => gap || theme.spacing.md};
  flex-wrap: ${({ wrap }) => wrap ? 'wrap' : 'nowrap'};
`;

export const Card = styled.div<{ padding?: string; shadow?: boolean; hover?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ padding, theme }) => padding || theme.spacing.lg};
  box-shadow: ${({ shadow, theme }) => shadow ? theme.shadows.md : 'none'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.normal};

  ${({ hover, theme }) => hover && `
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.md};
        `;
    }
  }}

  /* Color variants */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.1);
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ loading }) => loading && `
    pointer-events: none;
    
    &::after {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-left: 8px;
    }
  `}
`;

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['error', 'icon'].includes(prop),
})<{ error?: boolean; icon?: boolean }>`
  width: 100%;
  padding: ${({ theme, icon }) => icon ? 
    `${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.xxl}` : 
    `${theme.spacing.sm} ${theme.spacing.md}`
  };
  border: 1px solid ${({ theme, error }) => error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  background: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, error }) => 
      error ? 'rgba(229, 62, 62, 0.1)' : 'rgba(102, 126, 234, 0.1)'
    };
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

export const Badge = styled.span<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: rgba(118, 75, 162, 0.1);
          color: ${theme.colors.secondary};
        `;
      case 'success':
        return `
          background: rgba(56, 161, 105, 0.1);
          color: ${theme.colors.success};
        `;
      case 'warning':
        return `
          background: rgba(221, 107, 32, 0.1);
          color: ${theme.colors.warning};
        `;
      case 'error':
        return `
          background: rgba(229, 62, 62, 0.1);
          color: ${theme.colors.error};
        `;
      default:
        return `
          background: rgba(102, 126, 234, 0.1);
          color: ${theme.colors.primary};
        `;
    }
  }}
`;
