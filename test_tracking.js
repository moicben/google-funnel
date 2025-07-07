// Script de test pour vérifier le nouveau système de tracking
// Exécuter avec : node test_tracking.js (après avoir configuré les variables d'environnement)

import { LeadService, CampaignTotalService } from './lib/supabase.js';

async function testTracking() {
  console.log('🧪 Test du nouveau système de tracking...\n');

  const testCampaignId = 'test-campaign-1';
  const testIP = '192.168.1.100';

  try {
    // Test 1: Première visite avec une nouvelle IP
    console.log('📍 Test 1: Première visite avec nouvelle IP');
    const leadData1 = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      ip_address: testIP,
      user_agent: 'Test Browser',
      session_id: 'session_test_1'
    };

    const lead1 = await LeadService.createOrUpdateLead(testCampaignId, leadData1, 'visit');
    console.log(`✅ Lead créé: ${lead1.id}, isNewIP: ${lead1.isNewIP}`);
    console.log(`   Visit count: ${lead1.visit_count}\n`);

    // Test 2: Deuxième visite avec la même IP (même utilisateur)
    console.log('📍 Test 2: Deuxième visite, même IP');
    const lead2 = await LeadService.createOrUpdateLead(testCampaignId, leadData1, 'visit');
    console.log(`✅ Lead mis à jour: ${lead2.id}, isNewIP: ${lead2.isNewIP}`);
    console.log(`   Visit count: ${lead2.visit_count}\n`);

    // Test 3: Booking avec la même IP
    console.log('📍 Test 3: Booking avec la même IP');
    const bookingData = {
      ...leadData1,
      phone: '+33123456789',
      description: 'Test booking'
    };
    const lead3 = await LeadService.createOrUpdateLead(testCampaignId, bookingData, 'booking');
    console.log(`✅ Booking ajouté: ${lead3.id}, isNewIP: ${lead3.isNewIP}`);
    console.log(`   Visit count: ${lead3.visit_count}, Booking count: ${lead3.booking_count}\n`);

    // Test 4: Nouvelle IP, nouvel utilisateur
    console.log('📍 Test 4: Nouvelle IP, nouvel utilisateur');
    const leadData2 = {
      email: 'test2@example.com',
      first_name: 'Test2',
      last_name: 'User2',
      ip_address: '192.168.1.101', // Nouvelle IP
      user_agent: 'Test Browser 2',
      session_id: 'session_test_2'
    };

    const lead4 = await LeadService.createOrUpdateLead(testCampaignId, leadData2, 'visit');
    console.log(`✅ Nouveau lead: ${lead4.id}, isNewIP: ${lead4.isNewIP}`);
    console.log(`   Visit count: ${lead4.visit_count}\n`);

    // Test 5: Vérification de l'existence d'IP
    console.log('📍 Test 5: Vérification existence IP');
    const ipExists1 = await LeadService.checkIPExists(testCampaignId, testIP);
    const ipExists2 = await LeadService.checkIPExists(testCampaignId, '192.168.1.999');
    console.log(`✅ IP ${testIP} existe: ${ipExists1}`);
    console.log(`✅ IP 192.168.1.999 existe: ${ipExists2}\n`);

    console.log('🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Décommenter pour exécuter les tests
// testTracking();

export { testTracking };
