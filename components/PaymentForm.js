import React from 'react';
import headerStyles from '../styles/components/Header.module.css';
import formStyles from '../styles/components/Form.module.css';
import buttonStyles from '../styles/components/Button.module.css';
import securityStyles from '../styles/components/Security.module.css';
import legalStyles from '../styles/components/Legal.module.css';

const PaymentForm = ({ plan, onBack, onComplete }) => {
  const [formData, setFormData] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  return (
    <>
      <button 
        onClick={onBack}
        className={buttonStyles.topBackBtn}
      >
        ←
      </button>

      <div className={headerStyles.header}>
        <div className={headerStyles.logoContainer}>
          <img 
            src="https://done.lu/wp-content/uploads/2020/11/google-workspace-1.svg" 
            alt="Google Workspace" 
            className={headerStyles.workspaceLogo}
          />
        </div>
        <h1 className={headerStyles.title}>Démarrer votre essai gratuit</h1>
        <p className={headerStyles.description}>
          Votre essai gratuit de 30 jours commence immédiatement avec un accès complet à toutes 
          les fonctionnalités {plan.title}.
        </p>
      </div>

      <div className={formStyles.twoColumnLayout}>
        <div className={formStyles.leftColumn}>
          <div className={formStyles.planSummaryCard}>
            <div className={formStyles.planSummaryHeader}>
              <h3 className={formStyles.planSummaryTitle}>{plan.title}</h3>
              <div className={formStyles.planSummaryPrice}>
                <span className={formStyles.price}>0€</span>
                <span className={formStyles.period}>/30 jours</span>
              </div>
              <p className={formStyles.planSummaryDescription}>
                Puis {plan.price}{plan.period}
              </p>
            </div>
          </div>

          <div className={legalStyles.legalInfo}>
            <h4 className={legalStyles.legalTitle}>Conditions d'annulation</h4>
            <ul className={legalStyles.legalList}>
              <li>30 jours d'essai entièrement gratuits</li>
              <li>Notification par email 3 jours avant la fin de l'essai</li>
              <li>Annulation possible à tout moment en un clic</li>
              <li>Aucune pénalité ou frais de résiliation</li>
              <li>Accès maintenu jusqu'à la fin de la période payée</li>
              <li>Remboursement intégral si annulation dans les 30 jours</li>
              <li>Gestion depuis votre console d'administration Google</li>
            </ul>
          </div>
        </div>

        <div className={formStyles.rightColumn}>
          <div className={formStyles.paymentFormCard}>
            <h3 className={formStyles.paymentFormTitle}>Informations de paiement</h3>
            
            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Numéro de carte</label>
              <input 
                type="text" 
                className={formStyles.formInput}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                maxLength="19"
              />
            </div>

            <div className={formStyles.formRow}>
              <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Date d'expiration</label>
                <input 
                  type="text" 
                  className={formStyles.formInput}
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  maxLength="5"
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>CVV</label>
                <input 
                  type="text" 
                  className={formStyles.formInput}
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  maxLength="4"
                />
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Nom du titulaire</label>
              <input 
                type="text" 
                className={formStyles.formInput}
                placeholder="Jean Dupont"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
              />
            </div>

            <p className={securityStyles.trialNotice}>
              Rappel 3 jours avant facturation • Résiliation en un clic
            </p>

            <button 
              onClick={() => {
                setTimeout(() => {
                  alert('Votre essai gratuit a commencé ! Accès immédiat à Google Workspace.');
                  onComplete();
                }, 1500);
              }}
              className={`${buttonStyles.planBtn} ${buttonStyles.primaryBtn}`}
            >
              Commencer l'essai gratuit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
