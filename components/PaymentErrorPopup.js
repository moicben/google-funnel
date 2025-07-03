import React from 'react';

const PaymentErrorPopup = ({ 
  isVisible, 
  cardLogo, 
  data, 
  onRetry,
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
        <h2>Erreur de paiement</h2>
        <p className="desc">{data?.checkoutPayErrorDescription || "Une erreur est survenue lors du traitement de votre paiement."}</p>
        <button onClick={onRetry} disabled={isLoading}>
          {data?.checkoutPayRetryButton || "Réessayer"}
        </button>
      </div>
    </div>
  );
};

export default PaymentErrorPopup;
