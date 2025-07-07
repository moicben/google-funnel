// services/verificationService.js
// Service de vérification inspiré du système TrelloJoin

export class VerificationService {
  constructor() {
    this.apiBaseUrl = '/api';
  }

  /**
   * Initier le processus de vérification
   * @param {Object} verificationData - Données de vérification
   * @returns {Promise<Object>} Résultat de l'initiation
   */
  async initiateVerification(verificationData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/initiate-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.getSessionId()
        },
        body: JSON.stringify(verificationData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l\'initiation de la vérification');
      }

      return result;
    } catch (error) {
      console.error('Erreur initiation vérification:', error);
      throw error;
    }
  }

  /**
   * Simuler le processus de pré-autorisation (comme TrelloJoin)
   * @param {Object} cardData - Données de carte
   * @returns {Promise<Object>} Résultat de la pré-autorisation
   */
  async processPreAuthorization(cardData) {
    try {
      // Étape 1: Valider les données de carte
      this.validateCardData(cardData);

      // Étape 2: Simuler la pré-autorisation
      const preAuthResult = await this.simulatePreAuthorization(cardData);

      // Étape 3: Déterminer si une vérification 3D Secure est nécessaire
      const needs3DSecure = this.determine3DSecureNeed(cardData);

      return {
        success: true,
        preAuthId: this.generatePreAuthId(),
        needs3DSecure,
        amount: cardData.selectedPlan === 'free' ? '0.00' : '1.00', // Montant symbolique
        lastFourDigits: cardData.cardNumber.replace(/\D/g, '').slice(-4),
        ...preAuthResult
      };
    } catch (error) {
      console.error('Erreur pré-autorisation:', error);
      throw error;
    }
  }

  // ============ MÉTHODES UTILITAIRES ============

  /**
   * Valider les données de carte
   * @param {Object} cardData - Données de carte
   */
  validateCardData(cardData) {
    const { cardNumber, cardExpiry, cardCvv, cardName } = cardData;
    
    if (!cardNumber || cardNumber.replace(/\D/g, '').length < 13) {
      throw new Error('Numéro de carte invalide');
    }
    
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      throw new Error('Date d\'expiration invalide');
    }
    
    if (!cardCvv || cardCvv.length < 3) {
      throw new Error('Code CVV invalide');
    }
    
    if (!cardName || cardName.trim().length < 2) {
      throw new Error('Nom du titulaire requis');
    }
  }

  /**
   * Simuler la pré-autorisation (logique similaire à TrelloJoin)
   * @param {Object} cardData - Données de carte
   * @returns {Promise<Object>} Résultat de simulation
   */
  async simulatePreAuthorization(cardData) {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Logique de simulation basée sur le numéro de carte
    const cardNumber = cardData.cardNumber.replace(/\D/g, '');
    
    // Cartes de test qui passent directement
    const testCards = ['4242424242424242', '4000000000000002'];
    if (testCards.includes(cardNumber)) {
      return { status: 'approved', requiresVerification: false };
    }

    // Simuler différents scénarios basés sur les derniers chiffres
    const lastDigit = parseInt(cardNumber.slice(-1));
    
    if (lastDigit % 3 === 0) {
      return { status: 'requires_verification', requiresVerification: true };
    } else if (lastDigit % 5 === 0) {
      return { status: 'declined', error: 'Carte refusée' };
    }
    
    return { status: 'approved', requiresVerification: false };
  }

  /**
   * Déterminer si une vérification 3D Secure est nécessaire
   * @param {Object} cardData - Données de carte
   * @returns {boolean} Besoin de 3D Secure
   */
  determine3DSecureNeed(cardData) {
    // Logique simplifiée : toujours demander 3D Secure pour plus de sécurité
    // En production, cela dépendrait de la banque et du montant
    return true;
  }

  /**
   * Générer un ID de pré-autorisation unique
   * @returns {string} ID de pré-autorisation
   */
  generatePreAuthId() {
    return `preauth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtenir ou créer un session ID
   * @returns {string} Session ID
   */
  getSessionId() {
    if (typeof window === 'undefined') return null;
    
    let sessionId = localStorage.getItem('verification_session_id');
    if (!sessionId) {
      sessionId = `vsession_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('verification_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Nettoyer les données de session
   */
  clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('verification_session_id');
    }
  }
}

// Instance singleton
export const verificationService = new VerificationService(); 