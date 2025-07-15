import React, { useState, useEffect } from 'react';
import { POPUP_TYPES } from '../../hooks/usePopupManager';

// Import des composants popup
import AuthPopup from './AuthPopup';
import LoadingPopup from './LoadingPopup';
import EndPopup from './EndPopup';
import BookingPopup from '../booking/BookingPopup';
import ThreeDSecurePopup from '../payment/ThreeDSecurePopup';
import CardVerificationErrorPopup from '../payment/CardVerificationErrorPopup';
import PaymentErrorPopup from '../payment/PaymentErrorPopup';

/**
 * Composant qui rend la popup appropriée selon le type demandé
 * @param {Object} props - Props du PopupRenderer
 * @param {boolean} props.isVisible - Visibilité de la popup
 * @param {string} props.type - Type de popup à afficher
 * @param {Object} props.data - Données à passer à la popup
 * @param {Object} props.config - Configuration additionnelle
 * @param {Function} props.onClose - Callback de fermeture
 * @param {Function} props.onSwitch - Callback pour changer de type
 * @returns {JSX.Element|null} Composant popup ou null
 */
const PopupRenderer = ({ 
  isVisible, 
  type, 
  data = {}, 
  config = {}, 
  onClose, 
  onSwitch 
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousType, setPreviousType] = useState(null);
  
  console.log('PopupRenderer rendu avec:', { isVisible, type, data, config });
  
  // Gérer les transitions entre types de popups
  useEffect(() => {
    if (previousType && previousType !== type && isVisible) {
      setIsTransitioning(true);
      
      // Réinitialiser l'état de transition après un court délai
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    setPreviousType(type);
  }, [type, isVisible, previousType]);
  
  // Ne rien afficher si pas visible ou pas de type
  if (!isVisible || !type) {
    return null;
  }

  // Helper pour créer un wrapper avec transition
  const withTransition = (Component) => {
    return (
      <div 
        className={`popup-transition ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
          opacity: isTransitioning ? 0.7 : 1,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        {Component}
      </div>
    );
  };

  // Props communes à passer à toutes les popups
  const commonProps = {
    isVisible,
    onClose,
    onSwitch,
    isTransitioning,
    previousType,
    ...data,
    ...config
  };

  // Render selon le type de popup
  switch (type) {
    case POPUP_TYPES.AUTH:
      return withTransition(
        <AuthPopup 
          {...commonProps}
          campaignData={data.campaignData}
          redirectPath={data.redirectPath || '/google-login'}
        />
      );

    case POPUP_TYPES.BOOKING:
      return withTransition(
        <BookingPopup 
          {...commonProps}
          campaignData={data.campaignData}
        />
      );

    case POPUP_TYPES.LOADING:
      return withTransition(
        <LoadingPopup 
          {...commonProps}
          selectedPlan={data.selectedPlan}
          cardLogo={data.cardLogo}
          brandName={data.brandName || "Google Workspace"}
        />
      );

    case POPUP_TYPES.THREE_D_SECURE:
      return withTransition(
        <ThreeDSecurePopup 
          {...commonProps}
          amount={data.amount}
          lastFourDigits={data.lastFourDigits}
          formattedDate={data.formattedDate}
          formattedTime={data.formattedTime}
          cardNumber={data.cardNumber}
        />
      );

    case POPUP_TYPES.END:
      return withTransition(
        <EndPopup 
          {...commonProps}
          selectedPlan={data.selectedPlan}
          onRetry={data.onRetry}
          cardNumber={data.cardNumber}
        />
      );

    case POPUP_TYPES.CARD_VERIFICATION_ERROR:
      return withTransition(
        <CardVerificationErrorPopup 
          {...commonProps}
          onRetry={data.onRetry}
          cardNumber={data.cardNumber}
        />
      );

    case POPUP_TYPES.PAYMENT_ERROR:
      return withTransition(
        <PaymentErrorPopup 
          {...commonProps}
          onRetry={data.onRetry}
          errorMessage={data.errorMessage}
        />
      );

    default:
      console.warn(`Type de popup non supporté: ${type}`);
      return null;
  }
};

export default PopupRenderer; 