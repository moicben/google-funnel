import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../hooks/usePageMeta';
import BookingPopup from '../components/BookingPopup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'ID de campagne depuis l'URL
    const { campaign } = router.query;
    if (campaign) {
      setCampaignId(campaign);
      
      // Charger les données de la campagne
      fetch('/api/campaigns')
        .then(res => res.json())
        .then(data => {
          if (data.campaigns && data.campaigns[campaign]) {
            setCampaignData(data.campaigns[campaign]);
            console.log(`Campagne chargée: ${campaign}`, data.campaigns[campaign]);
          } else {
            console.warn(`Campagne non trouvée: ${campaign}`);
          }
        })
        .catch(err => console.error('Erreur lors du chargement de la campagne:', err));
    }
  }, [router.query]);

  const handleScreenClick = (e) => {
    // Ne pas ouvrir la popup si on clique sur la popup elle-même
    const popupElement = e.target.closest('[data-popup]');
    if (popupElement) {
      return;
    }
    
    // Ouvrir la popup pour tous les autres clics (y compris sur l'iframe)
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Titre dynamique basé sur les données de campagne
  const getPageTitle = () => {
    if (campaignData) {
      return `Réservez avec ${campaignData.firstName} ${campaignData.lastName}`;
    }
    return 'Choisissez votre créneau';
  };

  // Description dynamique basée sur les données de campagne  
  const getPageDescription = () => {
    if (campaignData) {
      return `Réservez facilement votre créneau avec ${campaignData.firstName} ${campaignData.lastName}. Calendrier interactif disponible.`;
    }
    return 'Sélectionnez facilement votre créneau de réservation dans notre calendrier interactif';
  };

  return (
    <>
      <PageHead 
        title={getPageTitle()}
        description={getPageDescription()}
        options={{
          keywords: 'réservation, calendrier, créneau, rendez-vous',
          favicon: '/calendar-favicon.ico'
        }}
      />
      
      {/* Affichage des informations de campagne pour le debug */}
      {campaignId && (
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          <div>Campagne ID: {campaignId}</div>
          {campaignData && (
            <>
              <div>Responsable: {campaignData.firstName} {campaignData.lastName}</div>
              <div>Email: {campaignData.email}</div>
            </>
          )}
        </div>
      )}
      
      <div onClick={handleScreenClick} style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <iframe 
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0c8o32xRySarMK1ME9TybZ9pKjXf4PjCgxKAxe8AZ2mCzx07AZFRzBUGkk1WmnX2rEW1AYsN1B?gv=true" 
          style={{ border: 0 }} 
          width="100%" 
          height="1000" 
          frameBorder="0"
        />
        {/* Div transparente pour capturer les clics sur l'iframe */}
        <div 
          onClick={handleScreenClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1000px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            zIndex: 1
          }}
          title="Choisissez un créneau horaire"
        />
      </div>
      
      <BookingPopup 
        showPopup={showPopup} 
        onClose={closePopup} 
        campaignData={campaignData}
      />

    </div>
    </>
  );
};

export default Home;