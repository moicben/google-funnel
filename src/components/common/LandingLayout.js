import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../../hooks/usePageMeta';
import { useCampaign } from '../../hooks/useCampaigns';
import { useVisitTracker } from '../../hooks/useVisitTracker';
import { usePopupManager } from '../../hooks/usePopupManager';
import PopupRenderer from './PopupRenderer';
import GoogleLoader from './GoogleLoader';

const LandingLayout = ({ 
  children, 
  pageTitle, 
  pageDescription, 
  pageKeywords,
  favicon,
  containerClassName = '',
  showLoader = true,
  loaderText = 'Chargement...',
  onCampaignLoad,
  onError
}) => {
  const [showOverlayFilter, setShowOverlayFilter] = useState(false);
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  
  // Hooks communs à toutes les landing pages
  const { campaign: campaignData, loading, error } = useCampaign(campaignId);
  const popupManager = usePopupManager();
  
  // Tracker les visites de campagne
  useVisitTracker(campaignId);

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      console.warn(`Erreur lors du chargement de la campagne: ${error}`);
      onError?.(error);
    }
  }, [error, onError]);

  // Callback quand la campagne est chargée
  useEffect(() => {
    if (campaignData && !loading) {
      onCampaignLoad?.(campaignData);
    }
  }, [campaignData, loading, onCampaignLoad]);

  // Afficher le filtre overlay après un délai (responsive)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowOverlayFilter(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowOverlayFilter(true);
    }
  }, []);

  // Utility functions partagées
  const getFullName = (campaignData) => {
    if (!campaignData?.firstName || !campaignData?.lastName) return null;
    return `${campaignData.firstName} ${campaignData.lastName}`;
  };

  const getStandardPopupProps = (campaignData, additionalProps = {}) => {
    return {
      campaignData: campaignData ? {
        ...campaignData,
        fullName: getFullName(campaignData)
      } : null,
      ...additionalProps
    };
  };

  const handlePopupClose = () => {
    popupManager.closePopup();
  };

  // Gestion dynamique du titre
  const getDynamicTitle = () => {
    if (typeof pageTitle === 'function') {
      return pageTitle(campaignData, loading);
    }
    return pageTitle || 'Chargement...';
  };

  // Gestion dynamique de la description
  const getDynamicDescription = () => {
    if (typeof pageDescription === 'function') {
      return pageDescription(campaignData, loading);
    }
    return pageDescription || 'Chargement...';
  };

  // Affichage en cas d'erreur
  if (error) {
    return (
      <>
        <PageHead 
          title="Erreur de chargement"
          description="Une erreur s'est produite lors du chargement de la campagne"
        />
        <div className="error-container">
          <div className="error-message">
            <h2>Erreur de chargement</h2>
            <p>La campagne demandée n'a pas pu être chargée.</p>
            <p>Veuillez vérifier le lien ou contacter l'administrateur.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead 
        title={getDynamicTitle()}
        description={getDynamicDescription()}
        options={{
          keywords: pageKeywords,
          favicon: favicon
        }}
      />
      
      <div className={containerClassName}>
        {children({
          campaignData,
          loading,
          error,
          showOverlayFilter,
          popupManager,
          getFullName,
          getStandardPopupProps,
          handlePopupClose
        })}
        
        {/* Loader unifié */}
        {loading && showLoader && (
          <GoogleLoader loadingText={loaderText} />
        )}
        
        {/* Système de popup centralisé */}
        <PopupRenderer
          isVisible={popupManager.isVisible}
          type={popupManager.type}
          data={popupManager.data}
          config={popupManager.config}
          onClose={handlePopupClose}
        />
      </div>
    </>
  );
};

export default LandingLayout;