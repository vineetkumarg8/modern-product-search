import React from 'react';
import styled from 'styled-components';
import { useProductSearch } from '../../contexts/ProductSearchContext';

const DebugContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
`;

const DebugSection = styled.div`
  margin-bottom: 0.5rem;
`;

const DebugTitle = styled.div`
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 0.25rem;
`;

const DebugValue = styled.div`
  margin-left: 0.5rem;
`;

const LoadButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  margin: 0.25rem 0;
`;

export const DebugPanel: React.FC = () => {
  const { state, actions } = useProductSearch();

  const handleLoadProducts = () => {
    actions.loadProducts(0, 12);
  };

  const handleLoadData = () => {
    actions.loadData();
  };

  return (
    <DebugContainer>
      <DebugTitle>Debug Panel</DebugTitle>
      
      <DebugSection>
        <DebugTitle>State:</DebugTitle>
        <DebugValue>Loading: {state.loading ? 'Yes' : 'No'}</DebugValue>
        <DebugValue>Error: {state.error || 'None'}</DebugValue>
        <DebugValue>Products: {state.products.length}</DebugValue>
        <DebugValue>Filtered: {state.filteredProducts.length}</DebugValue>
        <DebugValue>Total Elements: {state.pagination.totalElements}</DebugValue>
      </DebugSection>

      <DebugSection>
        <DebugTitle>Actions:</DebugTitle>
        <LoadButton onClick={handleLoadProducts}>Load Products</LoadButton>
        <br />
        <LoadButton onClick={handleLoadData}>Load Data</LoadButton>
      </DebugSection>

      <DebugSection>
        <DebugTitle>API Config:</DebugTitle>
        <DebugValue>Base URL: {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1'}</DebugValue>
      </DebugSection>
    </DebugContainer>
  );
};
