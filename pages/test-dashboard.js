import { useState, useEffect } from 'react';

export default function TestDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[TestDashboard] Component mounted');
    
    const fetchData = async () => {
      try {
        console.log('[TestDashboard] Starting fetch...');
        const response = await fetch('/api/campaigns/campaign-dashboard-stats?campaignId=all');
        console.log('[TestDashboard] Response received:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        console.log('[TestDashboard] Data received:', jsonData);
        setData(jsonData);
      } catch (err) {
        console.error('[TestDashboard] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Chargement...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Dashboard</h1>
      <h2>Données reçues :</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
} 