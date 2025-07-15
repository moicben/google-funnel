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
    config: {}
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
      config: {}
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

    setPopupState(prevState => ({
      ...prevState,
      type: newType,
      data: { ...prevState.data, ...newData },
      config: { ...prevState.config, ...newConfig }
    }));
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
    
    // Actions
    openPopup,
    closePopup,
    switchPopup,
    isPopupOpen,
    
    // Helpers pour types spécifiques
    openAuthPopup: useCallback((data, config) => openPopup(POPUP_TYPES.AUTH, data, config), [openPopup]),
    openBookingPopup: useCallback((data, config) => openPopup(POPUP_TYPES.BOOKING, data, config), [openPopup]),
    openLoadingPopup: useCallback((data, config) => openPopup(POPUP_TYPES.LOADING, data, config), [openPopup])
  };
}; 