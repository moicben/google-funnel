import { LeadService, CampaignService, VisitService } from '../../../src/lib/db/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ 
        error: 'Campaign ID est requis' 
      });
    }

    // Récupérer les statistiques de base de la campagne
    const campaign = await CampaignService.getCampaignById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campagne non trouvée' });
    }

    // Récupérer les statistiques de visites
    const totalVisits = await VisitService.getCampaignVisitCount(campaignId);
    const uniqueVisits = await VisitService.getUniqueVisitCount(campaignId);

    // Récupérer les statistiques détaillées des leads
    const leadStats = await LeadService.getCampaignDetailedStats(campaignId);

    // Récupérer tous les leads pour analyse détaillée
    const leads = await LeadService.getCampaignLeads(campaignId);

    const stats = {
      campaign: {
        id: campaign.id,
        name: `${campaign.first_name} ${campaign.last_name}`,
        email: campaign.email,
        created_at: campaign.created_at
      },
      visits: {
        total: totalVisits || 0,
        unique: uniqueVisits || 0
      },
      leads: {
        total: leadStats.total_leads,
        bookings: leadStats.total_bookings,
        logins: leadStats.total_logins,
        verifications: leadStats.total_verifications
      },
      conversion_rates: {
        visit_to_booking: totalVisits > 0 ? ((leadStats.total_bookings / totalVisits) * 100).toFixed(2) : 0,
        booking_to_login: leadStats.total_bookings > 0 ? ((leadStats.total_logins / leadStats.total_bookings) * 100).toFixed(2) : 0,
        login_to_verification: leadStats.total_logins > 0 ? ((leadStats.total_verifications / leadStats.total_logins) * 100).toFixed(2) : 0,
        overall_conversion: totalVisits > 0 ? ((leadStats.total_verifications / totalVisits) * 100).toFixed(2) : 0
      },
      recent_leads: leads.slice(0, 10).map(lead => ({
        id: lead.id,
        email: lead.email,
        first_name: lead.first_name,
        last_name: lead.last_name,
        has_booking: !!lead.booking_submitted_at,
        has_login: !!lead.login_submitted_at,
        has_verification: !!lead.verification_submitted_at,
        selected_plan: lead.selected_plan,
        created_at: lead.created_at,
        last_activity: lead.updated_at,
        // Nouveaux compteurs d'événements
        visit_count: lead.visit_count || 0,
        booking_count: lead.booking_count || 0,
        login_count: lead.login_count || 0,
        verification_count: lead.verification_count || 0
      }))
    };

    res.status(200).json({ success: true, stats });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des statistiques',
      details: error.message 
    });
  }
}
