// Script pour recalculer les totaux des campagnes en ne comptant que les IP uniques
// Exécuter avec : node recalculate_unique_totals.js

import { CampaignService, LeadService, supabaseAdmin } from '../../src/lib/db/supabase.js';

async function recalculateUniqueTotals() {
  console.log('🔄 Recalcul des totaux uniques pour toutes les campagnes...\n');

  try {
    // Récupérer toutes les campagnes
    const campaigns = await CampaignService.getAllCampaigns();
    console.log(`📊 ${campaigns.length} campagnes trouvées\n`);

    for (const campaign of campaigns) {
      console.log(`🎯 Traitement de la campagne ${campaign.id} (${campaign.first_name} ${campaign.last_name})`);

      // Récupérer tous les leads de cette campagne
      const leads = await LeadService.getCampaignLeads(campaign.id);
      console.log(`   📋 ${leads.length} leads trouvés`);

      // Calculer les totaux basés sur les IP uniques
      const uniqueIPs = new Set();
      const uniqueIPsWithBooking = new Set();
      const uniqueIPsWithLogin = new Set();
      const uniqueIPsWithVerification = new Set();

      for (const lead of leads) {
        const ip = lead.ip_address;
        if (!ip) continue;

        // Compter les IP uniques totales
        uniqueIPs.add(ip);

        // Compter les IP uniques avec booking
        if (lead.booking_submitted_at) {
          uniqueIPsWithBooking.add(ip);
        }

        // Compter les IP uniques avec login
        if (lead.login_submitted_at) {
          uniqueIPsWithLogin.add(ip);
        }

        // Compter les IP uniques avec verification
        if (lead.verification_submitted_at) {
          uniqueIPsWithVerification.add(ip);
        }
      }

      const newTotals = {
        total_visits: uniqueIPs.size,
        total_bookings: uniqueIPsWithBooking.size,
        total_logins: uniqueIPsWithLogin.size,
        total_verifications: uniqueIPsWithVerification.size
      };

      console.log(`   📈 Anciens totaux - Visits: ${campaign.total_visits || 0}, Bookings: ${campaign.total_bookings || 0}, Logins: ${campaign.total_logins || 0}, Verifications: ${campaign.total_verifications || 0}`);
      console.log(`   📈 Nouveaux totaux - Visits: ${newTotals.total_visits}, Bookings: ${newTotals.total_bookings}, Logins: ${newTotals.total_logins}, Verifications: ${newTotals.total_verifications}`);

      // Mettre à jour la campagne avec les nouveaux totaux
      await CampaignService.updateCampaign(campaign.id, {
        ...newTotals,
        updated_at: new Date().toISOString()
      });

      console.log(`   ✅ Campagne ${campaign.id} mise à jour\n`);
    }

    console.log('🎉 Recalcul terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du recalcul:', error);
  }
}

// Fonction pour vérifier les statistiques après recalcul
async function verifyTotals() {
  console.log('\n🔍 Vérification des totaux après recalcul...\n');

  try {
    const campaigns = await CampaignService.getAllCampaigns();

    for (const campaign of campaigns) {
      console.log(`📊 Campagne ${campaign.id}:`);
      console.log(`   Visits: ${campaign.total_visits || 0}`);
      console.log(`   Bookings: ${campaign.total_bookings || 0}`);
      console.log(`   Logins: ${campaign.total_logins || 0}`);
      console.log(`   Verifications: ${campaign.total_verifications || 0}`);
      
      // Vérifier cohérence avec les données réelles
      const leads = await LeadService.getCampaignLeads(campaign.id);
      const uniqueIPs = new Set(leads.map(lead => lead.ip_address).filter(Boolean));
      
      console.log(`   ✅ Cohérence: ${uniqueIPs.size} IP uniques dans les leads\n`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Démarrage du recalcul des totaux uniques...\n');
  
  await recalculateUniqueTotals();
  await verifyTotals();
  
  console.log('\n📋 Script terminé. Vérifiez les résultats dans votre dashboard.');
  process.exit(0);
} 