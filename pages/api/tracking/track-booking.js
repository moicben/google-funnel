import { LeadService, CampaignTotalService } from '../../../src/lib/db/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { 
      campaignId, 
      email, 
      firstName, 
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
      phone,
      description,
      ip_address: ip,
      user_agent: userAgent,
      session_id: sessionId
    };

    const lead = await LeadService.createOrUpdateLead(campaignId, leadData, actionType);

    // Mettre à jour les totaux de campagne seulement si c'est une nouvelle IP
    await CampaignTotalService.updateCampaignTotals(campaignId, actionType, lead.isNewIP);

    res.status(200).json({ 
      success: true, 
      lead: {
        campaign_id: lead.campaign_id,
        id: lead.id,
        email: lead.email,
        first_name: lead.first_name,
        booking_submitted: !!lead.booking_submitted_at,
        booking_count: lead.booking_count || 0
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
