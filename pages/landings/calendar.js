import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../../src/hooks/usePageMeta';
import { useCampaign } from '../../src/hooks/useCampaigns';
import { useVisitTracker } from '../../src/hooks/useVisitTracker';
import { usePopupManager, POPUP_TYPES } from '../../src/hooks/usePopupManager';
import PopupRenderer from '../../src/components/common/PopupRenderer';
import GoogleLoader from '../../src/components/common/GoogleLoader';
import LandingService from '../../src/services/landingService';
import styles from '../../src/styles/modules/Index.module.css';

const CalendarLanding = () => {
  const [showAuthorCache, setShowAuthorCache] = useState(false);
  const [showOverlayFilter, setShowOverlayFilter] = useState(false);
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  
  // Utiliser le hook personnalisé pour récupérer les données de campagne
  const { campaign: campaignData, loading, error } = useCampaign(campaignId);
  
  // Tracker les visites de campagne
  useVisitTracker(campaignId);

  // Gestionnaire de popup centralisé
  const popupManager = usePopupManager();

  useEffect(() => {
    if (error) {
      console.warn(`Erreur lors du chargement de la campagne: ${error}`);
    }
  }, [error]);

  // Afficher le cache de l'auteur après 2 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuthorCache(true);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  // Afficher le filtre overlay après un délai (responsive)
  useEffect(() => {
    return LandingService.setupOverlayTiming(setShowOverlayFilter);
  }, []);

  const handleScreenClick = (e) => {
    // Ne pas ouvrir la popup si on clique sur la popup elle-même
    const popupElement = e.target.closest('[data-popup]');
    if (popupElement) {
      return;
    }
    
    // Empêcher la propagation de l'événement
    e.stopPropagation();
    
    console.log('Clic sur calendrier, campaignData:', campaignData);
    
    // Ouvrir la popup SEULEMENT si le filtre est visible
    if (showOverlayFilter) {
      popupManager.openCalendarPopup({
        campaignData: campaignData
      });
    }
  };



  const handlePopupClose = () => {
    popupManager.closePopup();
  };

  // Utilisation du service pour les métadonnées de page
  const pageMeta = LandingService.generatePageMeta(campaignData, loading, 'calendar');
  
  // Utilisation du service pour les gestionnaires d'événements
  const eventHandlers = LandingService.createEventHandlers(popupManager, campaignData, 'calendar');

  // Affichage en cas d'erreur
  if (error) {
    return (
      <>
        <PageHead 
          title="Erreur de chargement"
          description="Une erreur s'est produite lors du chargement de la campagne"
        />
        <div className={styles.container}>
          <div className={styles.errorMessage}>
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
        title={pageMeta.title}
        description={pageMeta.description}
        options={{
          keywords: pageMeta.keywords,
          favicon: pageMeta.favicon
        }}
      />
      
      {/* Cache avec informations de l'auteur */}
      {campaignData && showAuthorCache && (
        <div className={styles.authorCache}>
          <img 
            src={campaignData.profileImage} 
            alt={`${campaignData.firstName} ${campaignData.lastName}`}
            className={styles.authorImage}
          />
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>
              {campaignData.firstName} {campaignData.lastName}
            </div>
            <div className={styles.authorTitle}>
              {campaignData.title}
            </div>
          </div>
          {/* Logo Google Calendar visible seulement sur mobile */}
          <img 
            src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png"
            alt="Google Calendar"
            className={styles.googleCalendarLogo}
          />
        </div>
      )}
      
      <div onClick={handleScreenClick} className={styles.container}>
        <div className={styles.iframeContainer}>
          <iframe 
            src={campaignData?.iframeUrl || null} 
            className={styles.iframe}
            frameBorder="0"
          />
          {/* Div transparente pour capturer les clics sur l'iframe */}
          <div 
            onClick={eventHandlers.handleOverlayClick}
            className={`${styles.clickOverlay} ${showOverlayFilter ? styles.visible : ''}`}
            title="Choisissez un créneau horaire"
          />
        </div>
        
        {/* Loader superposé pendant le chargement */}
        {loading && (
          <GoogleLoader loadingText="Chargement du calendrier..." />
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

export default CalendarLanding; 