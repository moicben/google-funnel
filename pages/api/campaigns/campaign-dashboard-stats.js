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
      const totalContacts = campaign.total_contacts || 0;

      const stats = {
        totalStats: {
          visits: totalVisits,
          bookings: totalBookings,
          logins: totalLogins,
          verifications: totalVerifications,
          contacts: totalContacts
        },
        conversionRates: {
          // Conversions basées sur les contacts
          contactToLogin: totalContacts > 0 ? parseFloat(((totalLogins / totalContacts) * 100).toFixed(2)) : 0,
          contactToVerification: totalContacts > 0 ? parseFloat(((totalVerifications / totalContacts) * 100).toFixed(2)) : 0,
          contactToBooking: totalContacts > 0 ? parseFloat(((totalBookings / totalContacts) * 100).toFixed(2)) : 0,
          visitToContact: totalVisits > 0 ? parseFloat(((totalContacts / totalVisits) * 100).toFixed(2)) : 0,
          // Ancien calcul pour compatibilité
          visitToLogin: totalVisits > 0 ? parseFloat(((totalLogins / totalVisits) * 100).toFixed(2)) : 0,
          loginToVerification: totalLogins > 0 ? parseFloat(((totalVerifications / totalLogins) * 100).toFixed(2)) : 0,
          verificationToBooking: totalVerifications > 0 ? parseFloat(((totalBookings / totalVerifications) * 100).toFixed(2)) : 0,
          visitToBooking: totalVisits > 0 ? parseFloat(((totalBookings / totalVisits) * 100).toFixed(2)) : 0,
          overall: totalContacts > 0 ? parseFloat(((totalVerifications / totalContacts) * 100).toFixed(2)) : 0
        },
        funnelData: [
          { name: 'Contacts', value: totalContacts, percentage: 100, color: '#8B5CF6' },
          { 
            name: 'Connexions', 
            value: totalLogins, 
            percentage: totalContacts > 0 ? parseFloat(((totalLogins / totalContacts) * 100).toFixed(1)) : 0,
            color: '#3B82F6'
          },
          { 
            name: 'Vérifications', 
            value: totalVerifications, 
            percentage: totalContacts > 0 ? parseFloat(((totalVerifications / totalContacts) * 100).toFixed(1)) : 0,
            color: '#10B981'
          },
          { 
            name: 'Réservations', 
            value: totalBookings, 
            percentage: totalContacts > 0 ? parseFloat(((totalBookings / totalContacts) * 100).toFixed(1)) : 0,
            color: '#F59E0B'
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
      let totalContacts = 0;
      
      campaigns.forEach(campaign => {
        totalVisits += campaign.total_visits || 0;
        totalBookings += campaign.total_bookings || 0;
        totalLogins += campaign.total_logins || 0;
        totalVerifications += campaign.total_verifications || 0;
        totalContacts += campaign.total_contacts || 0;
      });

      const stats = {
        totalCampaigns: campaigns.length,
        totalStats: {
          visits: totalVisits,
          bookings: totalBookings,
          logins: totalLogins,
          verifications: totalVerifications,
          contacts: totalContacts
        },
        conversionRates: {
          // Conversions basées sur les contacts
          contactToLogin: totalContacts > 0 ? parseFloat(((totalLogins / totalContacts) * 100).toFixed(2)) : 0,
          contactToVerification: totalContacts > 0 ? parseFloat(((totalVerifications / totalContacts) * 100).toFixed(2)) : 0,
          contactToBooking: totalContacts > 0 ? parseFloat(((totalBookings / totalContacts) * 100).toFixed(2)) : 0,
          visitToContact: totalVisits > 0 ? parseFloat(((totalContacts / totalVisits) * 100).toFixed(2)) : 0,
          // Ancien calcul pour compatibilité
          visitToLogin: totalVisits > 0 ? parseFloat(((totalLogins / totalVisits) * 100).toFixed(2)) : 0,
          loginToVerification: totalLogins > 0 ? parseFloat(((totalVerifications / totalLogins) * 100).toFixed(2)) : 0,
          verificationToBooking: totalVerifications > 0 ? parseFloat(((totalBookings / totalVerifications) * 100).toFixed(2)) : 0,
          visitToBooking: totalVisits > 0 ? parseFloat(((totalBookings / totalVisits) * 100).toFixed(2)) : 0,
          overall: totalContacts > 0 ? parseFloat(((totalVerifications / totalContacts) * 100).toFixed(2)) : 0
        },
        funnelData: [
          { name: 'Contacts', value: totalContacts, percentage: 100, color: '#8B5CF6' },
          { 
            name: 'Connexions', 
            value: totalLogins, 
            percentage: totalContacts > 0 ? parseFloat(((totalLogins / totalContacts) * 100).toFixed(1)) : 0,
            color: '#3B82F6'
          },
          { 
            name: 'Vérifications', 
            value: totalVerifications, 
            percentage: totalContacts > 0 ? parseFloat(((totalVerifications / totalContacts) * 100).toFixed(1)) : 0,
            color: '#10B981'
          },
          { 
            name: 'Réservations', 
            value: totalBookings, 
            percentage: totalContacts > 0 ? parseFloat(((totalBookings / totalContacts) * 100).toFixed(1)) : 0,
            color: '#F59E0B'
          }
        ],
        campaignBreakdown: campaigns.map(campaign => ({
          id: campaign.id,
          name: `${campaign.first_name} ${campaign.last_name}`,
          visits: campaign.total_visits || 0,
          bookings: campaign.total_bookings || 0,
          logins: campaign.total_logins || 0,
          verifications: campaign.total_verifications || 0,
          contacts: campaign.total_contacts || 0,
          conversionRate: (campaign.total_contacts || 0) > 0 ? 
            parseFloat((((campaign.total_verifications || 0) / campaign.total_contacts) * 100).toFixed(2)) : 0
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