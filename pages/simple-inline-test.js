import { useState } from 'react';

export default function SimpleInlineTest() {
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/campaigns/campaign-dashboard-stats?campaignId=all');
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      setApiResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#333' }}>Test avec Styles Inline</h1>
      
      <p>Cette page utilise uniquement des styles inline pour éviter les problèmes CSS.</p>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Chargement...' : 'Tester API Dashboard'}
      </button>

      {apiResult && (
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '15px',
          borderRadius: '5px',
          overflow: 'auto'
        }}>
          <h3>Résultat API:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(apiResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 