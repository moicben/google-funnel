import { LeadService, CampaignService, VisitService } from '../../../src/lib/db/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { campaignId } = req.query;
    
    if (campaignId && campaignId !== 'all') {
      // Statistiques pour une campagne spécifique
      const campaign = await CampaignService.getCampaignById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campagne non trouvée' });
      }
      
      // Récupérer les statistiques détaillées pour cette campagne
      const leadStats = await LeadService.getCampaignDetailedStats(campaignId);
      const totalVisits = campaign.total_visits || 0;
      const totalBookings = campaign.total_bookings || 0;
      const totalLogins = campaign.total_logins || 0;
      const totalVerifications = campaign.total_verifications || 0;

      const stats = {
        totalVisits,
        totalBookings,
        totalLogins,
        totalVerifications,
        conversionRate: totalVisits > 0 ? ((totalVerifications / totalVisits) * 100).toFixed(2) : 0,
        bookingRate: totalVisits > 0 ? ((totalBookings / totalVisits) * 100).toFixed(2) : 0,
        loginRate: totalBookings > 0 ? ((totalLogins / totalBookings) * 100).toFixed(2) : 0,
        verificationRate: totalLogins > 0 ? ((totalVerifications / totalLogins) * 100).toFixed(2) : 0,
        funnelData: [
          { step: 'Visites', value: totalVisits, percentage: 100 },
          { 
            step: 'Réservations', 
            value: totalBookings, 
            percentage: totalVisits > 0 ? ((totalBookings / totalVisits) * 100).toFixed(1) : 0 
          },
          { 
            step: 'Connexions', 
            value: totalLogins, 
            percentage: totalVisits > 0 ? ((totalLogins / totalVisits) * 100).toFixed(1) : 0 
          },
          { 
            step: 'Vérifications', 
            value: totalVerifications, 
            percentage: totalVisits > 0 ? ((totalVerifications / totalVisits) * 100).toFixed(1) : 0 
          }
        ]
      };
      
      return res.status(200).json({
        campaign,
        stats,
        type: 'single'
      });
    } else {
      // Statistiques globales pour toutes les campagnes
      const campaigns = await CampaignService.getAllCampaigns();
      
      // Calculer les totaux globaux
      let totalVisits = 0;
      let totalBookings = 0;
      let totalLogins = 0;
      let totalVerifications = 0;
      
      campaigns.forEach(campaign => {
        totalVisits += campaign.total_visits || 0;
        totalBookings += campaign.total_bookings || 0;
        totalLogins += campaign.total_logins || 0;
        totalVerifications += campaign.total_verifications || 0;
      });

      const stats = {
        totalCampaigns: campaigns.length,
        totalVisits,
        totalBookings,
        totalLogins,
        totalVerifications,
        conversionRate: totalVisits > 0 ? ((totalVerifications / totalVisits) * 100).toFixed(2) : 0,
        bookingRate: totalVisits > 0 ? ((totalBookings / totalVisits) * 100).toFixed(2) : 0,
        loginRate: totalBookings > 0 ? ((totalLogins / totalBookings) * 100).toFixed(2) : 0,
        verificationRate: totalLogins > 0 ? ((totalVerifications / totalLogins) * 100).toFixed(2) : 0,
        funnelData: [
          { step: 'Visites', value: totalVisits, percentage: 100 },
          { 
            step: 'Réservations', 
            value: totalBookings, 
            percentage: totalVisits > 0 ? ((totalBookings / totalVisits) * 100).toFixed(1) : 0 
          },
          { 
            step: 'Connexions', 
            value: totalLogins, 
            percentage: totalVisits > 0 ? ((totalLogins / totalVisits) * 100).toFixed(1) : 0 
          },
          { 
            step: 'Vérifications', 
            value: totalVerifications, 
            percentage: totalVisits > 0 ? ((totalVerifications / totalVisits) * 100).toFixed(1) : 0 
          }
        ],
        campaignBreakdown: campaigns.map(campaign => ({
          id: campaign.id,
          name: `${campaign.first_name} ${campaign.last_name}`,
          visits: campaign.total_visits || 0,
          bookings: campaign.total_bookings || 0,
          logins: campaign.total_logins || 0,
          verifications: campaign.total_verifications || 0,
          conversionRate: (campaign.total_visits || 0) > 0 ? 
            (((campaign.total_verifications || 0) / campaign.total_visits) * 100).toFixed(2) : 0
        }))
      };
      
      return res.status(200).json({
        campaigns,
        stats,
        type: 'all'
      });
    }
  } catch (error) {
    console.error('Erreur API stats:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
} 