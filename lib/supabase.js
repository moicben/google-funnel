import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

// Client public pour les opérations côté client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin pour les opérations côté serveur (API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Structure des données de campagne (pour référence)
// {
//   id: string,
//   iframe_url: string,
//   first_name: string,
//   last_name: string,
//   email: string,
//   profile_image?: string,
//   title?: string,
//   description?: string,
//   created_at?: string,
//   updated_at?: string,
//   is_active?: boolean
// }

// Service pour les campagnes
export class CampaignService {
  
  /**
   * Récupère toutes les campagnes actives
   */
  static async getAllCampaigns() {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des campagnes:', error);
      throw error;
    }
  }

  /**
   * Récupère une campagne par son ID
   */
  static async getCampaignById(id) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la campagne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle campagne (côté serveur uniquement)
   */
  static async createCampaign(campaignData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('campaigns')
        .insert([campaignData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      throw error;
    }
  }

  /**
   * Met à jour une campagne (côté serveur uniquement)
   */
  static async updateCampaign(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la campagne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Désactive une campagne (soft delete)
   */
  static async deactivateCampaign(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('campaigns')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la désactivation de la campagne ${id}:`, error);
      throw error;
    }
  }
}

// Service pour les visites de campagne
export class VisitService {
  
  /**
   * Enregistre une visite de campagne
   */
  static async trackVisit(campaignId, visitData = {}) {
    try {
      const visitRecord = {
        campaign_id: campaignId,
        visitor_ip: visitData.ip,
        user_agent: visitData.userAgent,
        referrer: visitData.referrer,
        session_id: visitData.sessionId,
        country: visitData.country,
        city: visitData.city,
        device_type: visitData.deviceType,
        browser: visitData.browser,
        os: visitData.os,
        visited_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('campaign_visits')
        .insert([visitRecord])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la visite:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques de visites pour une campagne
   */
  static async getCampaignStats(campaignId) {
    try {
      const { data, error } = await supabase
        .from('campaign_visits')
        .select('*')
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des stats pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère le nombre total de visites pour une campagne
   */
  static async getCampaignVisitCount(campaignId) {
    try {
      const { count, error } = await supabase
        .from('campaign_visits')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      return count;
    } catch (error) {
      console.error(`Erreur lors du comptage des visites pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les visites uniques par session pour une campagne
   */
  static async getUniqueVisitCount(campaignId) {
    try {
      const { data, error } = await supabase
        .from('campaign_visits')
        .select('session_id')
        .eq('campaign_id', campaignId);
      
      if (error) throw error;
      
      // Compter les sessions uniques
      const uniqueSessions = new Set(data.map(visit => visit.session_id));
      return uniqueSessions.size;
    } catch (error) {
      console.error(`Erreur lors du comptage des visites uniques pour ${campaignId}:`, error);
      throw error;
    }
  }
}
