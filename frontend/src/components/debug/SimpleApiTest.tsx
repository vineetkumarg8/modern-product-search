import React, { useEffect, useState } from 'react';

interface SimpleApiTestProps {
  onResult: (result: { success: boolean; message: string; data?: any }) => void;
}

export const SimpleApiTest: React.FC<SimpleApiTestProps> = ({ onResult }) => {
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const testSimpleApi = async () => {
      setTesting(true);
      
      try {
        // eslint-disable-next-line no-console
        console.log('🧪 Testing simple API connectivity...');
        
        // Test 1: Direct fetch to backend
        const directResponse = await fetch('http://localhost:8080/api/v1/products?size=2', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!directResponse.ok) {
          throw new Error(`Direct API failed: ${directResponse.status} ${directResponse.statusText}`);
        }
        
        const directData = await directResponse.json();
        // eslint-disable-next-line no-console
        console.log('✅ Direct API test successful:', directData);
        
        // Test 2: Proxy fetch
        let proxyData;
        try {
          const proxyResponse = await fetch('/api/v1/products?size=2', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          
          if (proxyResponse.ok) {
            proxyData = await proxyResponse.json();
            // eslint-disable-next-line no-console
            console.log('✅ Proxy API test successful:', proxyData);
          } else {
            // eslint-disable-next-line no-console
            console.warn('⚠️ Proxy failed, but direct API works');
          }
        } catch (proxyError: any) {
          // eslint-disable-next-line no-console
          console.warn('⚠️ Proxy error:', proxyError.message);
        }
        
        const resultData = proxyData || directData;
        
        onResult({
          success: true,
          message: `✅ API connectivity working! ${proxyData ? 'Proxy' : 'Direct'} connection successful.`,
          data: {
            method: proxyData ? 'proxy' : 'direct',
            totalProducts: resultData.data?.totalElements || 0,
            productsReceived: resultData.data?.content?.length || 0,
            sampleProduct: resultData.data?.content?.[0]?.title || 'No products',
          },
        });
        
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error('❌ Simple API test failed:', error);
        
        onResult({
          success: false,
          message: `❌ API connectivity failed: ${error.message}`,
          data: { 
            error: error.message,
            type: error.name,
          },
        });
      } finally {
        setTesting(false);
      }
    };

    testSimpleApi();
  }, [onResult]);

  if (testing) {
    return (
      <div style={{ 
        padding: '1rem', 
        background: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        margin: '1rem 0',
      }}>
        🧪 Testing simple API connectivity...
      </div>
    );
  }

  return null;
};
