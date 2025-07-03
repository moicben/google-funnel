import React from 'react';
import styles from '../styles/components/VerificationPopups.module.css';

const VerificationSuccessPopup = ({ 
  show, 
  selectedPlan, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className={styles.verificationWrapper}>
      <div className={styles.verificationPopup}>
        <div className={styles.header}>
          <img 
            src="google-workspace.svg" 
            alt="Google Workspace" 
            className={styles.workspaceLogo}
          />
        </div>
        
        {/* Icône de succès avec animation */}
        <div className={styles.successIcon}>
          <div className={styles.checkmarkContainer}>
            <svg 
              className={styles.checkmark} 
              viewBox="0 0 52 52"
              width="80" 
              height="80"
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

        <h2 className={styles.successTitle}>
          Vérification réussie !
        </h2>
        
        <p className={styles.successMessage}>
          {selectedPlan === 'free' 
            ? 'Votre compte Google Workspace Personnel a été activé avec succès. Vous pouvez maintenant utiliser tous les services Google gratuitement.'
            : `Votre essai gratuit de 30 jours pour ${selectedPlan === 'starter' ? 'Business Starter' : 'Business Standard'} a été activé. Aucun prélèvement pendant 30 jours.`
          }
        </p>

        <div className={styles.successDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>✅</span>
            <span>Vérification d'identité validée</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>🔒</span>
            <span>Données sécurisées et chiffrées</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>⚡</span>
            <span>
              {selectedPlan === 'free' 
                ? 'Accès immédiat à vos services'
                : 'Essai gratuit activé'
              }
            </span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className={styles.successButton}
        >
          {selectedPlan === 'free' 
            ? 'Accéder à Gmail' 
            : 'Continuer'
          }
        </button>

        <p className={styles.successFooter}>
          {selectedPlan === 'free' 
            ? 'Profitez de vos services Google Workspace gratuits !'
            : 'Vous recevrez un rappel par email 3 jours avant la fin de votre essai.'
          }
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccessPopup; 