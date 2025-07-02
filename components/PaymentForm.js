import React from 'react';
import formStyles from '../styles/components/Form.module.css';
import buttonStyles from '../styles/components/Button.module.css';
import styles from '../styles/components/PlanSummary.module.css';

const PaymentForm = ({ 
  selectedPlan, 
  formData, 
  onInputChange, 
  onSubmit,
  isSubmitting = false 
}) => {
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Supprimer tous les caractères non-numériques
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    onInputChange('cardExpiry', value);
  };

  return (
    <>
      <h3 className={formStyles.paymentFormTitle}>
        {selectedPlan === 'free' ? 'Vérification d\'identité' : 'Informations de paiement'}
      </h3>
      {selectedPlan !== 'free' && (
        <p className={formStyles.paymentSubtitle}>
          Aucun prélèvement pendant 30 jours
        </p>
      )}
      
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>
          {selectedPlan === 'free' ? 'Numéro de carte' : 'Numéro de carte'}
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type="text" 
            className={formStyles.formInput}
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => onInputChange('cardNumber', e.target.value)}
            maxLength="19"
            style={{ paddingRight: '60px' }}
          />
          <img 
            src="/card-network.png"
            alt="Cartes acceptées"
            style={{
              position: 'absolute',
              right: '10px',
              height: '20px',
              width: 'auto',
              zIndex: 1
            }}
          />
        </div>
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel}>Date d'expiration</label>
          <input 
            type="text" 
            className={formStyles.formInput}
            placeholder="MM/AA"
            value={formData.cardExpiry}
            onChange={handleExpiryChange}
            maxLength="5"
          />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel}>
            {selectedPlan === 'free' ? 'Code CVV' : 'CVV'}
          </label>
          <input 
            type="text" 
            className={formStyles.formInput}
            placeholder="123"
            value={formData.cardCvv}
            onChange={(e) => onInputChange('cvv', e.target.value)}
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
          onChange={(e) => onInputChange('cardName', e.target.value)}
        />
      </div>

      <div className={styles.paymentSecurity}>
        <p className={styles.securityNote}>
          {selectedPlan === 'free' 
            ? '🔒 Vérification instantanée • Aucun débit' 
            : '🔒 Paiement 100% sécurisé • Rappel avant facturation'
          }
        </p>
      </div>

      <button 
        onClick={onSubmit}
        className={`${buttonStyles.planBtn} ${buttonStyles.primaryBtn}`}
        style={{ width: '100%', marginTop: '20px' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #ffffff40',
              borderTop: '2px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Vérification...</span>
          </div>
        ) : (
          selectedPlan === 'free' 
            ? 'Vérifier mon identité' 
            : 'Démarrer l\'essai gratuit'
        )}
      </button>
    </>
  );
};

export default PaymentForm;
