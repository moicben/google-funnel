import { useState, useEffect } from 'react';

/**
 * Hook pour récupérer les campagnes avec leurs statistiques de visites
 */
export const useCampaignsWithStats = () => {
  const [campaigns, setCampaigns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaignsWithStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/campaigns');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns || {});
    } catch (err) {
      console.error('Erreur lors du chargement des campagnes avec stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsWithStats();
  }, []);

  // Fonction utilitaire pour obtenir le total de visites pour toutes les campagnes
  const getTotalVisitsAllCampaigns = () => {
    return Object.values(campaigns).reduce((total, campaign) => {
      return total + (campaign.totalVisits || 0);
    }, 0);
  };

  // Fonction utilitaire pour obtenir les campagnes triées par nombre de visites
  const getCampaignsSortedByVisits = () => {
    return Object.entries(campaigns)
      .map(([id, campaign]) => ({ id, ...campaign }))
      .sort((a, b) => (b.totalVisits || 0) - (a.totalVisits || 0));
  };

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaignsWithStats,
    getTotalVisitsAllCampaigns,
    getCampaignsSortedByVisits
  };
};

/**
 * Hook pour récupérer une campagne spécifique avec ses stats
 */
export const useCampaignWithStats = (campaignId) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaignWithStats = async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/campaigns?campaign=${campaignId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaign(data);
    } catch (err) {
      console.error(`Erreur lors du chargement de la campagne ${campaignId}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignWithStats();
  }, [campaignId]);

  return {
    campaign,
    loading,
    error,
    refetch: fetchCampaignWithStats
  };
};
