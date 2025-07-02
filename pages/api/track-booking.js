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
      lastName, 
      phone, 
      description,
      actionType = 'booking'
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
    
    // Générer un session ID simple (vous pouvez utiliser une librairie plus sophistiquée)
    const sessionId = req.headers['x-session-id'] || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const leadData = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      description,
      ip_address: ip,
      user_agent: userAgent,
      session_id: sessionId
    };

    const lead = await LeadService.createOrUpdateLead(campaignId, leadData, actionType);

    res.status(200).json({ 
      success: true, 
      lead: {
        id: lead.id,
        email: lead.email,
        first_name: lead.first_name,
        last_name: lead.last_name,
        booking_submitted: !!lead.booking_submitted_at
      }
    });

  } catch (error) {
    console.error('Erreur lors du tracking de booking:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors du tracking',
      details: error.message 
    });
  }
}
