import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/components/CommonPopup.module.css';

const AuthPopup = ({ 
  isVisible, 
  onClose, 
  campaignData,
  redirectPath = '/google-login'
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  if (!isVisible) return null;

  const handleAuthRedirect = () => {
    // Activer l'état de redirection pour feedback visuel
    setIsRedirecting(true);
    
    // Construire l'URL avec les paramètres de campagne
    const params = new URLSearchParams();
    
    if (campaignData?.firstName) {
      params.append('firstName', campaignData.firstName);
    }
    if (campaignData?.lastName) {
      params.append('lastName', campaignData.lastName);
    }
    if (campaignData?.email) {
      params.append('email', campaignData.email);
    }
    
    // Ajouter le paramètre de campagne
    if (campaignData?.id) {
      params.append('campaign', campaignData.id);
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

          <div className={styles.buttonContainer}>
            <button 
              className={styles.primaryButton}
              onClick={handleAuthRedirect}
            >
              Accéder au fichier
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour afficher la popup au niveau du body
  return createPortal(popupContent, document.body);
};

export default AuthPopup; 