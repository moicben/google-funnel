import { useEffect, useRef } from 'react';

// Générer un ID de session unique
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Obtenir ou créer un ID de session depuis localStorage
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('visit_session_id');
  
  // Vérifier si la session a expiré (24h)
  const sessionTimestamp = localStorage.getItem('visit_session_timestamp');
  const now = Date.now();
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 heures
  
  if (!sessionId || !sessionTimestamp || (now - parseInt(sessionTimestamp)) > sessionDuration) {
    sessionId = generateSessionId();
    localStorage.setItem('visit_session_id', sessionId);
    localStorage.setItem('visit_session_timestamp', now.toString());
  }
  
  return sessionId;
};

export const useVisitTracker = (campaignId) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Ne tracker qu'une seule fois par session et seulement si campaignId existe
    if (!campaignId || hasTracked.current) return;

    // Stocker le campaignId dans localStorage pour le tracking des actions suivantes
    localStorage.setItem('current_campaign_id', campaignId);

    const trackVisit = async () => {
      try {
        const sessionId = getSessionId();
        const referrer = document.referrer || '';

        const response = await fetch('/api/tracking/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignId,
            sessionId,
            referrer
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Visite trackée avec succès:', result);
          hasTracked.current = true;
        } else {
          console.warn('Erreur lors du tracking de la visite:', response.statusText);
        }
      } catch (error) {
        console.warn('Erreur lors du tracking de la visite:', error);
      }
    };

    // Délai pour éviter de tracker trop tôt
    const timeoutId = setTimeout(trackVisit, 1000);

    return () => clearTimeout(timeoutId);
  }, [campaignId]);

  return { hasTracked: hasTracked.current };
};
