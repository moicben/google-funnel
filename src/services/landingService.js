/**
 * Service pour la logique métier des landing pages
 * Centralise les fonctions communes utilisées par les landing pages
 */

export class LandingService {
  
  /**
   * Détecte si l'utilisateur est sur mobile
   * @returns {boolean}
   */
  static isMobile() {
    return typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  /**
   * Formate le nom complet d'un utilisateur
   * @param {Object} campaignData - Données de la campagne
   * @returns {string|null}
   */
  static getFullName(campaignData) {
    if (!campaignData?.firstName || !campaignData?.lastName) return null;
    return `${campaignData.firstName} ${campaignData.lastName}`;
  }

  /**
   * Génère les props standardisées pour les popups
   * @param {Object} campaignData - Données de la campagne
   * @param {Object} additionalProps - Props supplémentaires
   * @returns {Object}
   */
  static getStandardPopupProps(campaignData, additionalProps = {}) {
    return {
      campaignData: campaignData ? {
        ...campaignData,
        fullName: this.getFullName(campaignData)
      } : null,
      ...additionalProps
    };
  }

  /**
   * Gère la vérification des clics sur les popups
   * @param {Event} e - Événement de clic
   * @returns {boolean} - True si le clic est sur une popup
   */
  static isClickOnPopup(e) {
    const popupElement = e.target.closest('[data-popup]');
    return Boolean(popupElement);
  }

  /**
   * Prépare les gestionnaires d'événements pour les landing pages
   * @param {Object} popupManager - Gestionnaire de popup
   * @param {Object} campaignData - Données de la campagne
   * @param {string} landingType - Type de landing page
   * @returns {Object}
   */
  static createEventHandlers(popupManager, campaignData, landingType) {
    const standardProps = this.getStandardPopupProps(campaignData, {
      redirectPath: '/google-login',
      landingType: landingType
    });

    return {
      handleBookingClick: (e) => {
        if (this.isClickOnPopup(e)) return;
        e.stopPropagation();
        popupManager.openBookingPopup(standardProps);
      },
      
      handleAuthClick: (e) => {
        if (this.isClickOnPopup(e)) return;
        e.stopPropagation();
        popupManager.openAuthPopup(standardProps);
      },
      
      handleFileClick: (e, file) => {
        if (this.isClickOnPopup(e)) return;
        e.stopPropagation();
        console.log(`Clic sur fichier: ${file?.name || 'inconnu'}`, 'campaignData:', campaignData);
        popupManager.openAuthPopup(standardProps);
      },
      
      handleOverlayClick: (e) => {
        if (this.isClickOnPopup(e)) return;
        e.stopPropagation();
        console.log('Clic sur overlay', 'campaignData:', campaignData);
        
        // Logique différente selon le type de landing
        if (landingType === 'calendar') {
          popupManager.openBookingPopup(standardProps);
        } else {
          popupManager.openAuthPopup(standardProps);
        }
      }
    };
  }

  /**
   * Génère les métadonnées de page dynamiques
   * @param {Object} campaignData - Données de la campagne
   * @param {boolean} loading - État de chargement
   * @param {string} landingType - Type de landing page
   * @returns {Object}
   */
  static generatePageMeta(campaignData, loading, landingType) {
    const fullName = this.getFullName(campaignData);
    
    const metaConfigs = {
      calendar: {
        title: loading ? 'Chargement...' : fullName ? `Réservez avec ${fullName}` : 'Choisissez votre créneau',
        description: loading ? 'Chargement de votre calendrier de réservation...' : 
          fullName ? `Réservez facilement votre créneau avec ${fullName}. Calendrier interactif disponible.` :
          'Sélectionnez facilement votre créneau de réservation dans notre calendrier interactif',
        keywords: 'réservation, calendrier, créneau, rendez-vous',
        favicon: '/calendar-favicon.ico'
      },
      
      drive: {
        title: loading ? 'Chargement...' : fullName ? `${fullName} - Mon Drive` : 'Mon Drive',
        description: loading ? 'Chargement de votre Drive...' : 
          fullName ? `Accédez aux fichiers partagés de ${fullName}. Stockage cloud sécurisé.` :
          'Accédez à vos fichiers dans le cloud de manière sécurisée',
        keywords: 'drive, stockage, fichiers, cloud, partage',
        favicon: '/drive-favicon.ico'
      }
    };

    return metaConfigs[landingType] || metaConfigs.calendar;
  }

  /**
   * Gère le timing d'affichage des overlays selon le device
   * @param {Function} setShowOverlay - Fonction pour définir l'état de l'overlay
   * @param {number} mobileDelay - Délai sur mobile (par défaut 2000ms)
   * @returns {Function} - Fonction de cleanup
   */
  static setupOverlayTiming(setShowOverlay, mobileDelay = 2000) {
    const isMobile = this.isMobile();
    
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, mobileDelay);
      
      return () => clearTimeout(timer);
    } else {
      // Sur desktop, afficher immédiatement
      setShowOverlay(true);
      return () => {};
    }
  }

  /**
   * Génère des données de fichiers simulées pour Drive
   * @param {Object} campaignData - Données de la campagne
   * @returns {Array}
   */
  static generateDriveItems(campaignData) {
    const baseItems = [
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

    // Personnaliser selon la campagne si nécessaire
    if (campaignData?.title) {
      baseItems[1].name = `${campaignData.title} - Présentation`;
    }

    return baseItems;
  }

  /**
   * Valide les données d'une campagne
   * @param {Object} campaignData - Données de la campagne
   * @returns {Object} - Résultat de validation
   */
  static validateCampaignData(campaignData) {
    const errors = [];
    
    if (!campaignData) {
      errors.push('Données de campagne manquantes');
    } else {
      if (!campaignData.firstName) errors.push('Prénom manquant');
      if (!campaignData.lastName) errors.push('Nom manquant');
      if (!campaignData.email) errors.push('Email manquant');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export default LandingService;