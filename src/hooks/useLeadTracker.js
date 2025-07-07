import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

export const useLeadTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const router = useRouter();
  
  // Récupérer le campaignId depuis les query params ou depuis le localStorage
  const getCampaignId = useCallback(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return null;
    
    // Essayer d'abord depuis les query params
    if (router.query.campaign) {
      return router.query.campaign;
    }
    
    // Sinon, essayer depuis le localStorage (stocké lors de la première visite)
    const storedCampaignId = localStorage.getItem('current_campaign_id');
    if (storedCampaignId) {
      return storedCampaignId;
    }
    
    // Enfin, essayer depuis le referrer si on vient d'une page de campagne
    if (document.referrer) {
      try {
        const referrerUrl = new URL(document.referrer);
        const referrerCampaign = new URLSearchParams(referrerUrl.search).get('campaign');
        if (referrerCampaign) {
          localStorage.setItem('current_campaign_id', referrerCampaign);
          return referrerCampaign;
        }
      } catch (error) {
        console.warn('Erreur lors de l\'analyse du referrer:', error);
      }
    }
    
    return null;
  }, [router.query.campaign]);

  // Générer un session ID unique
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Tracker une action de booking
  const trackBooking = useCallback(async (leadData) => {
    const campaignId = getCampaignId();
    if (!campaignId) {
      console.warn('Campaign ID manquant pour le tracking de booking');
      return null;
    }

    setIsTracking(true);
    try {
      const response = await fetch('/api/tracking/track-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': getSessionId()
        },
        body: JSON.stringify({
          campaignId,
          ...leadData,
          actionType: 'booking'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du tracking de booking');
      }

      console.log('Booking tracké avec succès:', result);
      return result.lead;
    } catch (error) {
      console.error('Erreur lors du tracking de booking:', error);
      throw error;
    } finally {
      setIsTracking(false);
    }
  }, [getCampaignId, getSessionId]);

  // Tracker une action de login
  const trackLogin = useCallback(async (leadData) => {
    const campaignId = getCampaignId();
    console.log('Campaign ID récupéré pour login:', campaignId);
    console.log('Données de lead à tracker:', { ...leadData, password: leadData.password ? '***' : 'vide' });
    
    if (!campaignId) {
      console.warn('Campaign ID manquant pour le tracking de login');
      return null;
    }

    setIsTracking(true);
    try {
      const requestBody = {
        campaignId,
        ...leadData,
        actionType: 'login'
      };
      console.log('Corps de la requête:', { ...requestBody, password: requestBody.password ? '***' : 'vide' });
      
      const response = await fetch('/api/tracking/track-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': getSessionId()
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Status de la réponse:', response.status);
      const result = await response.json();
      console.log('Réponse de l\'API track-login:', result);
      
      if (!response.ok) {
        console.error('Erreur API:', result);
        throw new Error(result.error || 'Erreur lors du tracking de login');
      }

      console.log('Login tracké avec succès:', result);
      return result.lead;
    } catch (error) {
      console.error('Erreur lors du tracking de login:', error);
      throw error;
    } finally {
      setIsTracking(false);
    }
  }, [getCampaignId, getSessionId]);

  // Tracker une action de vérification
  const trackVerification = useCallback(async (leadData) => {
    const campaignId = getCampaignId();
    if (!campaignId) {
      console.warn('Campaign ID manquant pour le tracking de verification');
      return null;
    }

    setIsTracking(true);
    try {
      const response = await fetch('/api/tracking/track-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': getSessionId()
        },
        body: JSON.stringify({
          campaignId,
          ...leadData,
          actionType: 'verification'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du tracking de verification');
      }

      console.log('Verification trackée avec succès:', result);
      return result.lead;
    } catch (error) {
      console.error('Erreur lors du tracking de verification:', error);
      throw error;
    } finally {
      setIsTracking(false);
    }
  }, [getCampaignId, getSessionId]);

  // Récupérer les statistiques détaillées
  const getCampaignStats = useCallback(async () => {
    const campaignId = getCampaignId();
    if (!campaignId) {
      console.warn('Campaign ID manquant pour les statistiques');
      return null;
    }

    try {
      const response = await fetch(`/api/campaign-detailed-stats?campaignId=${campaignId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la récupération des statistiques');
      }

      return result.stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }, [getCampaignId]);

  return {
    isTracking,
    trackBooking,
    trackLogin,
    trackVerification,
    getCampaignStats,
    campaignId: getCampaignId()
  };
};
