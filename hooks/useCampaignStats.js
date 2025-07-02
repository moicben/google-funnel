import { useState, useEffect } from 'react';

export const useCampaignStats = (campaignId) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!campaignId) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/campaign-stats?campaignId=${encodeURIComponent(campaignId)}`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [campaignId]);

  const refreshStats = () => {
    if (campaignId) {
      const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/campaign-stats?campaignId=${encodeURIComponent(campaignId)}`);
          
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }

          const data = await response.json();
          setStats(data);
        } catch (err) {
          console.error('Erreur lors de la récupération des statistiques:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  };

  return { stats, loading, error, refreshStats };
};
