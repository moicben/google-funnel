import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { campaignId } = req.query;

    if (!campaignId) {
      return res.status(400).json({ error: 'campaignId est requis' });
    }

    // Récupérer toutes les visites pour cette campagne
    const { data: visits, error: visitsError } = await supabase
      .from('campaign_visits')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('visited_at', { ascending: false });

    if (visitsError) {
      console.error('Erreur lors de la récupération des visites:', visitsError);
      return res.status(500).json({ error: 'Erreur lors de la récupération des visites' });
    }

    // Calculer les statistiques
    const totalVisits = visits.length;
    const uniqueVisitors = new Set(visits.map(v => v.session_id)).size;
    
    // Visites par jour (derniers 7 jours)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentVisits = visits.filter(v => new Date(v.visited_at) >= sevenDaysAgo);
    
    const visitsByDay = {};
    recentVisits.forEach(visit => {
      const day = new Date(visit.visited_at).toISOString().split('T')[0];
      visitsByDay[day] = (visitsByDay[day] || 0) + 1;
    });

    // Statistiques par appareil
    const deviceStats = {};
    visits.forEach(visit => {
      const device = visit.device_type || 'unknown';
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });

    // Statistiques par navigateur
    const browserStats = {};
    visits.forEach(visit => {
      const browser = visit.browser || 'unknown';
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    // Top referrers
    const referrerStats = {};
    visits.forEach(visit => {
      const referrer = visit.referrer || 'direct';
      const domain = referrer === 'direct' ? 'direct' : 
                    referrer ? new URL(referrer).hostname : 'unknown';
      referrerStats[domain] = (referrerStats[domain] || 0) + 1;
    });

    // Première et dernière visite
    const firstVisit = visits.length > 0 ? visits[visits.length - 1].visited_at : null;
    const lastVisit = visits.length > 0 ? visits[0].visited_at : null;

    const stats = {
      totalVisits,
      uniqueVisitors,
      visitsByDay,
      deviceStats,
      browserStats,
      referrerStats,
      firstVisit,
      lastVisit,
      recentVisits: recentVisits.length
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Erreur dans l\'API de statistiques:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
