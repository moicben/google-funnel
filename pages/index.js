import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCampaign } from '../src/hooks/useCampaigns';
import { getLandingConfig } from '../config/paths';

const LandingRouter = () => {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  
  // Utiliser le hook personnalisé pour récupérer les données de campagne
  const { campaign: campaignData, loading, error } = useCampaign(campaignId);

  useEffect(() => {
    // Attendre que les données de campagne soient chargées
    if (loading) return;
    
    // Gérer les erreurs de chargement
    if (error) {
      console.warn(`Erreur lors du chargement de la campagne: ${error}`);
      // Rediriger vers calendar par défaut en cas d'erreur
      redirectToLanding('calendar');
      return;
    }
    
    // Déterminer le type de landing
    const landingType = campaignData?.landingType || 'calendar';
    
    // Vérifier que le type de landing est valide
    const landingConfig = getLandingConfig(landingType);
    if (!landingConfig) {
      console.warn(`Type de landing inconnu: ${landingType}, redirection vers calendar`);
      redirectToLanding('calendar');
      return;
    }
    
    // Rediriger vers la landing page appropriée
    redirectToLanding(landingType);
  }, [campaignData, loading, error]);

  const redirectToLanding = (landingType) => {
    const targetUrl = campaignId 
      ? `/landings/${landingType}?campaign=${campaignId}`
      : `/landings/${landingType}`;
    
    // Remplacer l'URL actuelle pour éviter les boucles de redirection
    router.replace(targetUrl);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #4285f4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: '#5f6368',
            fontSize: '14px',
            margin: 0
          }}>Chargement...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Affichage en cas d'erreur (ne devrait pas être atteint car on redirige)
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '1rem'
          }}>⚠️</div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '500',
            color: '#202124',
            margin: '0 0 0.5rem'
          }}>Erreur de chargement</h2>
          <p style={{
            color: '#5f6368',
            fontSize: '14px',
            margin: 0
          }}>La campagne demandée n'a pas pu être chargée.</p>
        </div>
      </div>
    );
  }

  // Retour null pendant la redirection
  return null;
};

export default LandingRouter;