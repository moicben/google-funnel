import { LeadService, CampaignTotalService } from '../../../src/lib/db/supabase';

export default async function handler(req, res) {
  console.log('API track-login appelée avec méthode:', req.method);
  console.log('Corps de la requête:', { ...req.body, password: req.body.password ? '***' : 'vide' });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { 
      campaignId, 
      email, 
      firstName,
      password
    } = req.body;

    console.log('Données extraites:', { campaignId, email, firstName, password: password ? '***' : 'vide' });

    // Validation des données requises
    if (!campaignId || !email) {
      console.error('Validation échouée:', { campaignId: !!campaignId, email: !!email });
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
      password, // ATTENTION: Stockage du mot de passe - considérez la sécurité
      ip_address: ip,
      user_agent: userAgent,
      session_id: sessionId
    };

    console.log('Données lead préparées:', { ...leadData, password: leadData.password ? '***' : 'vide' });
    console.log('Appel LeadService.createOrUpdateLead...');

    const lead = await LeadService.createOrUpdateLead(campaignId, leadData, 'login');
    console.log('Lead créé/mis à jour:', { id: lead?.id, email: lead?.email });

    // Mettre à jour les totaux de campagne seulement si c'est une nouvelle IP
    await CampaignTotalService.updateCampaignTotals(campaignId, 'login', lead.isNewIP);

    res.status(200).json({ 
      success: true, 
      lead: {
        id: lead.id,
        email: lead.email,
        first_name: lead.first_name,
        login_submitted: !!lead.login_submitted_at,
        login_count: lead.login_count || 0
      }
    });

  } catch (error) {
    console.error('Erreur lors du tracking de login:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors du tracking',
      details: error.message 
    });
  }
}
