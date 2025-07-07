import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les campagnes
 */
export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaigns = async () => {
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
      console.error('Erreur lors du chargement des campagnes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns
  };
};

/**
 * Hook pour récupérer une campagne spécifique
 */
export const useCampaign = (campaignId) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaign = async () => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/campaigns?campaign=${campaignId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Campagne non trouvée');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaign(data);
    } catch (err) {
      console.error(`Erreur lors du chargement de la campagne ${campaignId}:`, err);
      setError(err.message);
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  return {
    campaign,
    loading,
    error,
    refetch: fetchCampaign
  };
};

/**
 * Hook pour les opérations CRUD sur les campagnes (côté admin)
 */
export const useCampaignOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCampaign = async (campaignData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      const newCampaign = await response.json();
      return newCampaign;
    } catch (err) {
      console.error('Erreur lors de la création de la campagne:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCampaign = async (campaignId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/campaigns?campaign=${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const updatedCampaign = await response.json();
      return updatedCampaign;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la campagne:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/campaigns?campaign=${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de la campagne:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    loading,
    error
  };
};
