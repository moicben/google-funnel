import React from 'react';
import { POPUP_TYPES } from '../../hooks/usePopupManager';

// Import des composants popup
import CalendarPopup from '../calendar/CalendarPopup';
import DrivePopup from '../drive/DrivePopup';
import LoadingPopup from './LoadingPopup';
import EndPopup from './EndPopup';
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
 * @returns {JSX.Element|null} Composant popup ou null
 */
const PopupRenderer = ({ 
  isVisible, 
  type, 
  data = {}, 
  config = {}, 
  onClose
}) => {
  console.log('PopupRenderer rendu avec:', { isVisible, type, data, config });
  
  // Ne rien afficher si pas visible ou pas de type
  if (!isVisible || !type) {
    return null;
  }

  // Props communes à passer à toutes les popups
  const commonProps = {
    isVisible,
    onClose,
    ...data,
    ...config
  };

  // Render selon le type de popup
  switch (type) {
    case POPUP_TYPES.CALENDAR:
      return (
        <CalendarPopup 
          {...commonProps}
          campaignData={data.campaignData}
        />
      );

    case POPUP_TYPES.DRIVE:
      return (
        <DrivePopup 
          {...commonProps}
          campaignData={data.campaignData}
        />
      );

    case POPUP_TYPES.LOADING:
      return (
        <LoadingPopup 
          {...commonProps}
          selectedPlan={data.selectedPlan}
          cardLogo={data.cardLogo}
          brandName={data.brandName || "Google Workspace"}
        />
      );

    case POPUP_TYPES.THREE_D_SECURE:
      return (
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
      return (
        <EndPopup 
          {...commonProps}
          selectedPlan={data.selectedPlan}
          onRetry={data.onRetry}
          cardNumber={data.cardNumber}
        />
      );

    case POPUP_TYPES.CARD_VERIFICATION_ERROR:
      return (
        <CardVerificationErrorPopup 
          {...commonProps}
          onRetry={data.onRetry}
          cardNumber={data.cardNumber}
        />
      );

    case POPUP_TYPES.PAYMENT_ERROR:
      return (
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