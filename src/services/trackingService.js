/**
 * Service centralisé pour le tracking des événements
 * Gère tous les appels de tracking de manière cohérente
 */

export class TrackingService {
  
  /**
   * URL de base pour les endpoints de tracking
   */
  static BASE_URL = '/api/tracking';

  /**
   * Effectue un appel de tracking générique
   * @param {string} endpoint - Endpoint de tracking
   * @param {Object} data - Données à envoyer
   * @returns {Promise<Object>}
   */
  static async makeTrackingCall(endpoint, data) {
    try {
      const response = await fetch(`${this.BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors du tracking ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Tracker une visite de page
   * @param {string} campaignId - ID de la campagne
   * @param {Object} visitData - Données de la visite
   * @returns {Promise<Object>}
   */
  static async trackVisit(campaignId, visitData = {}) {
    const data = {
      campaignId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      sessionId: this.getSessionId(),
      ...visitData
    };

    return this.makeTrackingCall('track-visit', data);
  }

  /**
   * Tracker une soumission de réservation
   * @param {string} campaignId - ID de la campagne
   * @param {Object} bookingData - Données de réservation
   * @returns {Promise<Object>}
   */
  static async trackBooking(campaignId, bookingData) {
    const data = {
      campaignId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...bookingData
    };

    return this.makeTrackingCall('track-booking', data);
  }

  /**
   * Tracker une tentative de connexion
   * @param {string} campaignId - ID de la campagne
   * @param {Object} loginData - Données de connexion
   * @returns {Promise<Object>}
   */
  static async trackLogin(campaignId, loginData) {
    const data = {
      campaignId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...loginData
    };

    return this.makeTrackingCall('track-login', data);
  }

  /**
   * Tracker une vérification de paiement
   * @param {string} campaignId - ID de la campagne
   * @param {Object} verificationData - Données de vérification
   * @returns {Promise<Object>}
   */
  static async trackVerification(campaignId, verificationData) {
    const data = {
      campaignId,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...verificationData
    };

    return this.makeTrackingCall('track-verification', data);
  }

  /**
   * Tracker un événement personnalisé
   * @param {string} campaignId - ID de la campagne
   * @param {string} eventType - Type d'événement
   * @param {Object} eventData - Données de l'événement
   * @returns {Promise<Object>}
   */
  static async trackCustomEvent(campaignId, eventType, eventData = {}) {
    const data = {
      campaignId,
      eventType,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      ...eventData
    };

    // Utiliser l'endpoint le plus approprié selon le type d'événement
    const endpointMap = {
      'page_view': 'track-visit',
      'form_submit': 'track-booking',
      'auth_attempt': 'track-login',
      'payment_verify': 'track-verification'
    };

    const endpoint = endpointMap[eventType] || 'track-visit';
    return this.makeTrackingCall(endpoint, data);
  }

  /**
   * Obtient ou génère un ID de session
   * @returns {string}
   */
  static getSessionId() {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('trackingSessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('trackingSessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Génère un ID de session unique
   * @returns {string}
   */
  static generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Obtient l'adresse IP du client (côté client)
   * @returns {Promise<string>}
   */
  static async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Impossible d\'obtenir l\'IP client:', error);
      return 'unknown';
    }
  }

  /**
   * Enrichit les données de tracking avec des informations contextuelles
   * @param {Object} baseData - Données de base
   * @returns {Object}
   */
  static enrichTrackingData(baseData) {
    const enrichedData = {
      ...baseData,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };

    // Ajouter des informations du navigateur si disponibles
    if (typeof window !== 'undefined') {
      enrichedData.userAgent = window.navigator.userAgent;
      enrichedData.language = window.navigator.language;
      enrichedData.platform = window.navigator.platform;
      enrichedData.screenResolution = `${window.screen.width}x${window.screen.height}`;
      enrichedData.viewport = `${window.innerWidth}x${window.innerHeight}`;
      enrichedData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    return enrichedData;
  }

  /**
   * Valide les données de tracking avant l'envoi
   * @param {Object} data - Données à valider
   * @returns {Object} - Résultat de validation
   */
  static validateTrackingData(data) {
    const errors = [];

    if (!data.campaignId) {
      errors.push('campaignId est requis');
    }

    if (!data.timestamp) {
      errors.push('timestamp est requis');
    }

    // Validation spécifique selon le type de données
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Format d\'email invalide');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Format de téléphone invalide');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Valide un format d'email
   * @param {string} email - Email à valider
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide un format de téléphone
   * @param {string} phone - Téléphone à valider
   * @returns {boolean}
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Traite les erreurs de tracking de manière cohérente
   * @param {Error} error - Erreur à traiter
   * @param {string} context - Contexte de l'erreur
   */
  static handleTrackingError(error, context = 'unknown') {
    console.error(`Erreur de tracking [${context}]:`, error);
    
    // Optionnel : envoyer les erreurs à un service de monitoring
    // this.sendErrorToMonitoring(error, context);
  }

  /**
   * Batch plusieurs événements de tracking
   * @param {Array} events - Liste d'événements à envoyer
   * @returns {Promise<Array>}
   */
  static async trackBatch(events) {
    const promises = events.map(event => {
      const { endpoint, data } = event;
      return this.makeTrackingCall(endpoint, data).catch(error => {
        this.handleTrackingError(error, `batch-${endpoint}`);
        return { error: error.message };
      });
    });

    return Promise.all(promises);
  }

  /**
   * Obtient des statistiques de tracking pour une campagne
   * @param {string} campaignId - ID de la campagne
   * @returns {Promise<Object>}
   */
  static async getCampaignStats(campaignId) {
    try {
      const response = await fetch(`/api/campaigns/campaign-detailed-stats?campaignId=${campaignId}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      this.handleTrackingError(error, 'campaign-stats');
      throw error;
    }
  }
}

export default TrackingService;