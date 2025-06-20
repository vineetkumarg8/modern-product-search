import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { apiClient } from '../../services/apiClient';

interface DataFlowTestProps {
  onResult: (result: { success: boolean; message: string; data?: any }) => void;
}

export const DataFlowTest: React.FC<DataFlowTestProps> = ({ onResult }) => {
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const testDataFlow = async () => {
      setTesting(true);

      try {
        // eslint-disable-next-line no-console
        console.log('🧪 Testing data flow...');

        // Test 1: Direct API client test
        // eslint-disable-next-line no-console
        console.log('Testing direct API client...');

        let products;
        try {
          // Try proxy first
          products = await apiClient.get('/api/v1/products?size=3');
          // eslint-disable-next-line no-console
          console.log('✅ Proxy working:', products);
        } catch (proxyError: any) {
          // eslint-disable-next-line no-console
          console.warn('⚠️ Proxy failed, trying direct URL:', proxyError.message);

          // Try direct URL
          products = await apiClient.get('http://localhost:8080/api/v1/products?size=3');
          // eslint-disable-next-line no-console
          console.log('✅ Direct URL working:', products);
        }

        // Test 2: Product service test
        // eslint-disable-next-line no-console
        console.log('Testing product service...');
        const serviceResult = await productService.getProducts({ size: 3 });

        // eslint-disable-next-line no-console
        console.log('✅ Data flow test successful:', {
          totalProducts: serviceResult.totalElements,
          productsReceived: serviceResult.content.length,
          firstProduct: serviceResult.content[0]?.title,
        });

        onResult({
          success: true,
          message: `✅ Data flow working! Received ${serviceResult.content.length} products from database.`,
          data: {
            totalProducts: serviceResult.totalElements,
            sampleProducts: serviceResult.content.slice(0, 3).map(p => ({
              id: p.id,
              title: p.title,
              price: p.price,
              category: p.category,
            })),
          },
        });

      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error('❌ Data flow test failed:', error);

        onResult({
          success: false,
          message: `❌ Data flow failed: ${error.message}`,
          data: {
            error: error.message,
            stack: error.stack,
            config: error.config,
          },
        });
      } finally {
        setTesting(false);
      }
    };

    testDataFlow();
  }, [onResult]);

  if (testing) {
    return (
      <div style={{ 
        padding: '1rem', 
        background: '#f0f8ff', 
        border: '1px solid #0066cc',
        borderRadius: '4px',
        margin: '1rem 0',
      }}>
        🧪 Testing data flow from database...
      </div>
    );
  }

  return null;
};
