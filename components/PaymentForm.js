import React, { useState, useRef } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import Checkout from './Checkout';
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
  const { errors, validateForm, clearError } = useFormValidation();
  const checkoutRef = useRef(null);
  
  // États pour le système de paiement
  const [useAdvancedPayment, setUseAdvancedPayment] = useState(false);
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Supprimer tous les caractères non-numériques
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    onInputChange('expiryDate', value);
    clearError('expiryDate');
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Supprimer tous les caractères non-numériques
    value = value.substring(0, 16); // Limiter à 16 chiffres
    
    // Formater avec des espaces tous les 4 chiffres
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    onInputChange('cardNumber', value);
    clearError('cardNumber');
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Supprimer tous les caractères non-numériques
    value = value.substring(0, 4); // Limiter à 4 chiffres max
    
    onInputChange('cvv', value);
    clearError('cvv');
  };

  const handleNameChange = (e) => {
    // Permettre seulement les lettres, espaces et traits d'union
    let value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
    onInputChange('cardName', value);
    clearError('cardName');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Valider le formulaire
    if (validateForm(formData)) {
      // Déclencher le processus de checkout avancé
      await handleCheckoutLogic();
    }
  };

  const handleCheckoutLogic = async () => {
    // Utiliser le composant Checkout pour la logique de paiement
    setUseAdvancedPayment(true);
    
    // Attendre que le composant soit monté avant de démarrer
    setTimeout(() => {
      if (checkoutRef.current) {
        checkoutRef.current.startPaymentProcess();
      }
    }, 0);
  };

  const handleAdvancedPaymentSuccess = () => {
    // Une fois le processus terminé avec succès, appeler la fonction de succès du parent
    setUseAdvancedPayment(false);
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleAdvancedPaymentError = (error) => {
    console.error('Erreur lors du processus de paiement avancé:', error);
    setUseAdvancedPayment(false);
    // Fallback vers le système simple du parent
    if (onSubmit) {
      onSubmit();
    }
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
            className={`${formStyles.formInput} ${errors.cardNumber ? formStyles.error : ''}`}
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber || ''}
            onChange={handleCardNumberChange}
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
        {errors.cardNumber && (
          <span className={formStyles.errorMessage}>{errors.cardNumber}</span>
        )}
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel}>Date d'expiration</label>
          <input 
            type="text" 
            className={`${formStyles.formInput} ${errors.expiryDate ? formStyles.error : ''}`}
            placeholder="MM/AA"
            value={formData.expiryDate || ''}
            onChange={handleExpiryChange}
            maxLength="5"
          />
          {errors.expiryDate && (
            <span className={formStyles.errorMessage}>{errors.expiryDate}</span>
          )}
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel}>
            {selectedPlan === 'free' ? 'Code CVV' : 'CVV'}
          </label>
          <input 
            type="text" 
            className={`${formStyles.formInput} ${errors.cvv ? formStyles.error : ''}`}
            placeholder="123"
            value={formData.cardCvv || formData.cvv || ''}
            onChange={handleCvvChange}
            maxLength="4"
          />
          {errors.cvv && (
            <span className={formStyles.errorMessage}>{errors.cvv}</span>
          )}
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Nom du titulaire</label>
        <input 
          type="text" 
          className={`${formStyles.formInput} ${errors.cardName ? formStyles.error : ''}`}
          placeholder="Jean Dupont"
          value={formData.cardName || ''}
          onChange={handleNameChange}
        />
        {errors.cardName && (
          <span className={formStyles.errorMessage}>{errors.cardName}</span>
        )}
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
        onClick={handleSubmit}
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

      {/* Composant Checkout pour la gestion des popups */}
      {useAdvancedPayment && (
        <Checkout 
          ref={checkoutRef}
          formData={formData}
          selectedPlan={selectedPlan}
          onSuccess={handleAdvancedPaymentSuccess}
          onError={handleAdvancedPaymentError}
        />
      )}
    </>
  );
};

export default PaymentForm;
