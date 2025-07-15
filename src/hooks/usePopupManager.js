import { useState, useCallback } from 'react';

// Types de popup disponibles
export const POPUP_TYPES = {
  AUTH: 'auth',
  BOOKING: 'booking',
  LOADING: 'loading',
  THREE_D_SECURE: 'threeDSecure',
  END: 'end',
  CARD_VERIFICATION_ERROR: 'cardVerificationError',
  PAYMENT_ERROR: 'paymentError'
};

/**
 * Hook personnalisé pour la gestion centralisée des popups
 * @returns {Object} Interface de gestion des popups
 */
export const usePopupManager = () => {
  const [popupState, setPopupState] = useState({
    isVisible: false,
    type: null,
    data: null,
    config: {},
    history: [],
    isTransitioning: false
  });

  /**
   * Ouvrir une popup avec type et données spécifiques
   * @param {string} type - Type de popup (voir POPUP_TYPES)
   * @param {Object} data - Données à passer à la popup
   * @param {Object} config - Configuration additionnelle
   */
  const openPopup = useCallback((type, data = {}, config = {}) => {
    if (!Object.values(POPUP_TYPES).includes(type)) {
      console.warn(`Type de popup non reconnu: ${type}`);
      return;
    }

    setPopupState({
      isVisible: true,
      type,
      data,
      config
    });
  }, []);

  /**
   * Fermer la popup actuellement ouverte
   */
  const closePopup = useCallback(() => {
    setPopupState({
      isVisible: false,
      type: null,
      data: null,
      config: {},
      history: [],
      isTransitioning: false
    });
  }, []);

  /**
   * Changer le type de popup sans fermer (pour transitions)
   * @param {string} newType - Nouveau type de popup
   * @param {Object} newData - Nouvelles données
   * @param {Object} newConfig - Nouvelle configuration
   */
  const switchPopup = useCallback((newType, newData = {}, newConfig = {}) => {
    if (!Object.values(POPUP_TYPES).includes(newType)) {
      console.warn(`Type de popup non reconnu: ${newType}`);
      return;
    }

    setPopupState(prevState => {
      // Ajouter l'état précédent à l'historique
      const currentHistory = prevState.history || [];
      const newHistory = prevState.type 
        ? [...currentHistory, {
            type: prevState.type,
            data: prevState.data,
            config: prevState.config,
            timestamp: Date.now()
          }]
        : currentHistory;

      console.log(`🔄 Transition popup: ${prevState.type} → ${newType}`);
      
      return {
        ...prevState,
        type: newType,
        data: { ...prevState.data, ...newData },
        config: { ...prevState.config, ...newConfig },
        history: newHistory,
        isTransitioning: true
      };
    });

    // Réinitialiser l'état de transition après un délai
    setTimeout(() => {
      setPopupState(prevState => ({
        ...prevState,
        isTransitioning: false
      }));
    }, 300);
  }, []);

  /**
   * Revenir à la popup précédente dans l'historique
   */
  const goBackPopup = useCallback(() => {
    setPopupState(prevState => {
      const history = prevState.history || [];
      if (history.length === 0) {
        console.warn('Aucune popup précédente dans l\'historique');
        return prevState;
      }

      const previousPopup = history[history.length - 1];
      const newHistory = history.slice(0, -1);

      console.log(`🔙 Retour à la popup précédente: ${prevState.type} → ${previousPopup.type}`);

      return {
        ...prevState,
        type: previousPopup.type,
        data: previousPopup.data,
        config: previousPopup.config,
        history: newHistory,
        isTransitioning: true
      };
    });

    // Réinitialiser l'état de transition après un délai
    setTimeout(() => {
      setPopupState(prevState => ({
        ...prevState,
        isTransitioning: false
      }));
    }, 300);
  }, []);

  /**
   * Vérifier si une popup est ouverte
   * @param {string} type - Type spécifique à vérifier (optionnel)
   * @returns {boolean}
   */
  const isPopupOpen = useCallback((type = null) => {
    if (type) {
      return popupState.isVisible && popupState.type === type;
    }
    return popupState.isVisible;
  }, [popupState.isVisible, popupState.type]);

  return {
    // État
    isVisible: popupState.isVisible,
    type: popupState.type,
    data: popupState.data,
    config: popupState.config,
    history: popupState.history,
    isTransitioning: popupState.isTransitioning,
    
    // Actions
    openPopup,
    closePopup,
    switchPopup,
    goBackPopup,
    isPopupOpen,
    
    // Helpers pour types spécifiques
    openAuthPopup: useCallback((data, config) => openPopup(POPUP_TYPES.AUTH, data, config), [openPopup]),
    openBookingPopup: useCallback((data, config) => openPopup(POPUP_TYPES.BOOKING, data, config), [openPopup]),
    openLoadingPopup: useCallback((data, config) => openPopup(POPUP_TYPES.LOADING, data, config), [openPopup]),
    
    // Helpers avancés
    canGoBack: (popupState.history || []).length > 0,
    historyLength: (popupState.history || []).length,
    getCurrentPopupInfo: () => ({
      type: popupState.type,
      isVisible: popupState.isVisible,
      isTransitioning: popupState.isTransitioning,
      historyLength: (popupState.history || []).length
    })
  };
}; 