import { supabase, VisitService, LeadService, CampaignTotalService } from '../../../src/lib/db/supabase';

// Fonction utilitaire pour parser les informations du User-Agent
function parseUserAgent(userAgent) {
  const ua = userAgent || '';
  
  // Détection du type d'appareil
  let deviceType = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'mobile';
  }

  // Détection du navigateur
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';

  // Détection de l'OS
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  return { deviceType, browser, os };
}

// Fonction pour obtenir l'IP du client
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '0.0.0.0';
}

// Fonction pour obtenir la ville à partir de l'IP
async function getCityFromIP(ip) {
  try {
    // Ne pas traiter les IPs locales
    if (ip === '0.0.0.0' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return 'Local';
    }

    // Utiliser ip-api.com (gratuit, plus fiable)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=city,status`);
    if (!response.ok) {
      throw new Error('Erreur API géolocalisation');
    }
    
    const data = await response.json();
    if (data.status === 'success') {
      return data.city || 'Inconnue';
    } else {
      return 'Inconnue';
    }
  } catch (error) {
    console.error('Erreur lors de la géolocalisation:', error);
    return 'Inconnue';
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { campaignId, sessionId, referrer } = req.body;

    if (!campaignId) {
      return res.status(400).json({ error: 'campaignId est requis' });
    }

    // Récupérer les informations du visiteur
    const userAgent = req.headers['user-agent'] || '';
    const clientIP = getClientIP(req);
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    
    // Obtenir la ville à partir de l'IP
    const city = await getCityFromIP(clientIP);

    // Préparer les données de visite pour la table campaign_visits
    const visitData = {
      campaign_id: campaignId,
      visitor_ip: clientIP,
      user_agent: userAgent,
      referrer: referrer || req.headers.referer || '',
      session_id: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      device_type: deviceType,
      browser: browser,
      os: os,
      city: city,
      visited_at: new Date().toISOString()
    };

    // Enregistrer la visite dans Supabase (table campaign_visits)
    const { data: visitRecord, error: visitError } = await supabase
      .from('campaign_visits')
      .insert([visitData])
      .select()
      .single();

    if (visitError) {
      console.error('Erreur lors de l\'enregistrement de la visite:', visitError);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la visite' });
    }

    // Tracker la visite dans la table campaign_leads avec compteurs
    const leadData = {
      ip: clientIP,
      userAgent: userAgent,
      sessionId: visitData.session_id
    };

    const lead = await LeadService.trackVisit(campaignId, leadData);

    // Mettre à jour les totaux de campagne seulement si c'est une nouvelle IP
    await CampaignTotalService.updateCampaignTotals(campaignId, 'visit', lead.isNewIP);

    res.status(200).json({ 
      success: true, 
      visitId: visitRecord.id,
      sessionId: visitData.session_id,
      leadId: lead.id,
      isNewIP: lead.isNewIP
    });

  } catch (error) {
    console.error('Erreur dans l\'API de tracking:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
