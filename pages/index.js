import React, { useState } from 'react';
import { PageHead } from '../hooks/usePageMeta';
import BookingPopup from '../components/BookingPopup';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

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

  return (
    <>
      <PageHead 
        title="Choisissez votre créneau"
        description="Sélectionnez facilement votre créneau de réservation dans notre calendrier interactif"
        options={{
          keywords: 'réservation, calendrier, créneau, rendez-vous',
          favicon: '/calendar-favicon.ico'
        }}
      />
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
      
      <BookingPopup showPopup={showPopup} onClose={closePopup} />

    </div>
    </>
  );
};

export default Home;