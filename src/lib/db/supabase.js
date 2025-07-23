import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Logging amélioré pour le debug
// console.log('[Supabase Init] Environment:', process.env.NODE_ENV);
// console.log('[Supabase Init] URL present:', !!supabaseUrl);
// console.log('[Supabase Init] Anon Key present:', !!supabaseAnonKey);
// console.log('[Supabase Init] Service Key present:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseAnonKey) {
  // console.error('[Supabase Init] Missing environment variables:', {
  //   url: supabaseUrl || 'MISSING',
  //   anonKey: supabaseAnonKey ? 'Present' : 'MISSING'
  // });
  throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez SUPABASE_URL et SUPABASE_ANON_KEY');
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
//   landing_type?: string,
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
   * Récupère les campagnes par type de landing
   */
  static async getCampaignsByType(landingType = 'calendar') {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('landing_type', landingType)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des campagnes ${landingType}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle campagne (côté serveur uniquement)
   */
  static async createCampaign(campaignData) {
    try {
      // Ajouter landing_type par défaut si non spécifié
      const campaignWithDefaults = {
        landing_type: 'calendar',
        ...campaignData
      };
      
      const { data, error } = await supabaseAdmin
        .from('campaigns')
        .insert([campaignWithDefaults])
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

// Fonctions utilitaires pour la gestion des emails
function isTemporaryEmail(email) {
  if (!email) return false;
  return email.includes('visitor_') && email.includes('@temp.local');
}

function isRealEmail(email) {
  if (!email) return false;
  // Un email réel ne contient pas 'visitor_' et ne finit pas par '@temp.local'
  return !email.includes('visitor_') && !email.includes('@temp.local') && email.includes('@');
}

// Service pour les leads et tracking des actions
export class LeadService {

  /**
   * Vérifie si une IP existe déjà pour cette campagne
   */
  static async checkIPExists(campaignId, ipAddress) {
    try {
      // console.log(`🔍 Vérification IP ${ipAddress} pour campagne ${campaignId}`);
      
      if (!ipAddress) {
        // console.warn('⚠️ IP address vide, considérée comme nouvelle IP');
        return false;
      }

      const { data, error } = await supabase
        .from('campaign_leads')
        .select('ip_address')
        .eq('campaign_id', campaignId)
        .eq('ip_address', ipAddress)
        .limit(1);

      if (error) {
        console.error('❌ Erreur lors de la vérification IP:', error);
        throw error;
      }

      const ipExists = data && data.length > 0;
      // console.log(`✅ IP ${ipAddress} ${ipExists ? 'existe déjà' : 'est nouvelle'} pour campagne ${campaignId}`);
      
      return ipExists;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de l\'IP:', error);
      // En cas d'erreur, considérer comme nouvelle IP pour éviter de bloquer le processus
      return false;
    }
  }
  
  /**
   * Crée ou met à jour un lead pour une campagne
   */
  static async createOrUpdateLead(campaignId, leadData, actionType = 'booking') {
    try {
      let existingLead = null;
      
      // ÉTAPE 1: Chercher d'abord par IP address et campagne (priorité)
      // Ceci évite les doublons quand un visiteur anonyme fait une réservation
      if (leadData.ip_address) {
        // console.log(`🔍 Recherche lead par IP ${leadData.ip_address} pour campagne ${campaignId}`);
        
        const { data: leadByIP, error: ipSearchError } = await supabase
          .from('campaign_leads')
          .select('*')
          .eq('campaign_id', campaignId)
          .eq('ip_address', leadData.ip_address)
          .maybeSingle();

        if (ipSearchError && ipSearchError.code !== 'PGRST116') {
          throw ipSearchError;
        }

        if (leadByIP) {
          // console.log(`✅ Lead trouvé par IP: ${leadByIP.id} (email: ${leadByIP.email})`);
          existingLead = leadByIP;
        }
      }

      // ÉTAPE 2: Si pas trouvé par IP, chercher par email et campagne
      if (!existingLead) {
        // console.log(`🔍 Recherche lead par email ${leadData.email} pour campagne ${campaignId}`);
        
        const { data: leadByEmail, error: emailSearchError } = await supabase
          .from('campaign_leads')
          .select('*')
          .eq('campaign_id', campaignId)
          .eq('email', leadData.email)
          .maybeSingle();

        if (emailSearchError && emailSearchError.code !== 'PGRST116') {
          throw emailSearchError;
        }

        if (leadByEmail) {
          // console.log(`✅ Lead trouvé par email: ${leadByEmail.id}`);
          existingLead = leadByEmail;
        }
      }

      // ÉTAPE 3: Vérifier si l'IP existe déjà pour cette campagne (pour les totaux)
      // Cette vérification doit être faite avant la création/mise à jour
      const isNewIP = !await this.checkIPExists(campaignId, leadData.ip_address);

      let leadRecord;
      const now = new Date().toISOString();

      if (existingLead) {
        // console.log(`🔄 Mise à jour du lead existant ${existingLead.id} pour action ${actionType}`);
        
        // Préserver l'email réel et ne pas l'écraser avec un email temporaire
        const shouldPreserveEmail = isRealEmail(existingLead.email) && isTemporaryEmail(leadData.email);
        
        // Mettre à jour le lead existant
        const updateData = {
          updated_at: now,
          // Préserver l'email réel existant si le nouveau est temporaire
          email: shouldPreserveEmail ? existingLead.email : leadData.email,
          // Mettre à jour les autres champs seulement si ils ne sont pas vides
          first_name: leadData.first_name || existingLead.first_name,
          last_name: leadData.last_name || existingLead.last_name,
          phone: leadData.phone || existingLead.phone,
          description: leadData.description || existingLead.description,
          ip_address: leadData.ip_address, // Toujours mettre à jour l'IP
          user_agent: leadData.user_agent || existingLead.user_agent,
          session_id: leadData.session_id || existingLead.session_id
        };

        if (shouldPreserveEmail) {
          // console.log(`📧 Email réel préservé: ${existingLead.email} (évite écrasement par ${leadData.email})`);
        } else if (isTemporaryEmail(existingLead.email) && isRealEmail(leadData.email)) {
          // console.log(`📧 Email mis à jour: ${existingLead.email} → ${leadData.email}`);
        }

        // Incrémenter les compteurs d'événements
        switch (actionType) {
          case 'visit':
            updateData.visit_count = (existingLead.visit_count || 0) + 1;
            break;
          case 'booking':
            updateData.booking_submitted_at = now;
            updateData.booking_count = (existingLead.booking_count || 0) + 1;
            updateData.booking_data = {
              first_name: updateData.first_name,
              last_name: updateData.last_name,
              email: updateData.email,
              phone: updateData.phone,
              description: updateData.description,
              timestamp: now
            };
            break;
          case 'login':
            updateData.login_submitted_at = now;
            updateData.login_count = (existingLead.login_count || 0) + 1;
            updateData.login_data = {
              email: updateData.email,
              password_length: leadData.password ? leadData.password.length : 0,
              timestamp: now
            };
            if (leadData.password) {
              updateData.password = leadData.password;
            }
            break;
          case 'verification':
            updateData.verification_submitted_at = now;
            updateData.verification_count = (existingLead.verification_count || 0) + 1;
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
        // console.log(`➕ Création d'un nouveau lead pour action ${actionType}`);
        
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
          updated_at: now,
          // Initialiser tous les compteurs à 0
          visit_count: 0,
          booking_count: 0,
          login_count: 0,
          verification_count: 0
        };

        // Ajouter les données spécifiques selon le type d'action et incrémenter le compteur
        switch (actionType) {
          case 'visit':
            newLead.visit_count = 1;
            break;
          case 'booking':
            newLead.booking_submitted_at = now;
            newLead.booking_count = 1;
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
            newLead.login_count = 1;
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
            newLead.verification_count = 1;
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

      // Retourner les données avec l'information sur l'IP unique
      // isNewIP reste la même valeur peu importe si c'est une mise à jour ou création
      return {
        ...leadRecord,
        isNewIP: isNewIP
      };
    } catch (error) {
      console.error(`Erreur lors de la création/mise à jour du lead pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Track une visite et met à jour/crée le lead correspondant
   */
  static async trackVisit(campaignId, visitData) {
    try {
      const leadData = {
        email: visitData.email || `visitor_${visitData.sessionId}@temp.local`, // Email temporaire pour les visiteurs anonymes
        first_name: visitData.firstName || '',
        last_name: visitData.lastName || '',
        ip_address: visitData.ip,
        user_agent: visitData.userAgent,
        session_id: visitData.sessionId
      };

      return await this.createOrUpdateLead(campaignId, leadData, 'visit');
    } catch (error) {
      console.error(`Erreur lors du tracking de visite pour ${campaignId}:`, error);
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

// Service pour la mise à jour des totaux de campagne (uniquement pour les IPs uniques)
export class CampaignTotalService {
  
  /**
   * Met à jour les totaux d'une campagne seulement si c'est une nouvelle IP
   */
  static async updateCampaignTotals(campaignId, actionType, isNewIP) {
    if (!isNewIP) {
      // console.log(`IP déjà existante pour ${campaignId}, pas de mise à jour des totaux`);
      return;
    }

    try {
      let updateField;
      switch (actionType) {
        case 'visit':
          updateField = 'total_visits';
          break;
        case 'booking':
          updateField = 'total_bookings';
          break;
        case 'login':
          updateField = 'total_logins';
          break;
        case 'verification':
          updateField = 'total_verifications';
          break;
        default:
          // console.warn(`Type d'action non reconnu: ${actionType}`);
          return;
      }

      // Incrémenter le total correspondant
      const { data, error } = await supabaseAdmin
        .rpc('increment_campaign_total', {
          campaign_id: campaignId,
          field_name: updateField
        });

      if (error) {
        console.error(`Erreur lors de l'incrémentation de ${updateField} pour ${campaignId}:`, error);
        // On peut aussi essayer une approche alternative si la fonction RPC n'existe pas
        await this.fallbackIncrementTotal(campaignId, updateField);
      }

      // console.log(`Total ${updateField} incrémenté pour la campagne ${campaignId}`);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des totaux pour ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Méthode de fallback pour incrémenter les totaux si la fonction RPC n'existe pas
   */
  static async fallbackIncrementTotal(campaignId, fieldName) {
    try {
      // Récupérer la valeur actuelle
      const { data: campaign, error: fetchError } = await supabaseAdmin
        .from('campaigns')
        .select(fieldName)
        .eq('id', campaignId)
        .single();

      if (fetchError) throw fetchError;

      const currentValue = campaign[fieldName] || 0;
      const newValue = currentValue + 1;

      // Mettre à jour avec la nouvelle valeur
      const { error: updateError } = await supabaseAdmin
        .from('campaigns')
        .update({ 
          [fieldName]: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      // console.log(`Fallback: ${fieldName} mis à jour à ${newValue} pour ${campaignId}`);
    } catch (error) {
      console.error(`Erreur lors du fallback pour ${campaignId}:`, error);
      // Ne pas relancer l'erreur pour éviter de faire échouer le tracking principal
    }
  }
}
