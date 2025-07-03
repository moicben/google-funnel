import { getCampaignData, getCampaignStats } from '../../services/campaignStatsService';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const campaigns = getCampaignData();
    const { campaignId } = req.query;
    
    if (campaignId && campaignId !== 'all') {
      // Statistiques pour une campagne spécifique
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campagne non trouvée' });
      }
      
      const stats = getCampaignStats([campaign]);
      return res.status(200).json({
        campaign,
        stats,
        type: 'single'
      });
    } else {
      // Statistiques globales
      const stats = getCampaignStats(campaigns);
      return res.status(200).json({
        campaigns,
        stats,
        type: 'all'
      });
    }
  } catch (error) {
    console.error('Erreur API stats:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
