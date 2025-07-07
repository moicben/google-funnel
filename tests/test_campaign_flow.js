// Script pour tester le flow complet d'un utilisateur
// Exécuter avec : node test_campaign_flow.js

const { CampaignService } = require('./src/lib/db/supabase.js');

async function createTestCampaign() {
  console.log('🚀 Création d\'une campagne de test...\n');

  try {
    // Créer une campagne de test
    const testCampaign = {
      id: 'test-campaign-123',
      iframe_url: 'https://calendar.google.com/calendar/embed?src=test%40gmail.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      email: 'jean.dupont@gmail.com',
      profile_image: null,
      title: 'Consultation Marketing',
      description: 'Réservez un créneau pour discuter de votre stratégie marketing',
      is_active: true
    };

    const campaign = await CampaignService.createCampaign(testCampaign);
    console.log('✅ Campagne de test créée:', campaign);

    // Afficher les URLs pour tester
    console.log('\n🔗 URLs pour tester le flow:');
    console.log('1. Page d\'accueil avec campagne:', `http://localhost:3000/?campaign=${campaign.id}`);
    console.log('2. Via rewrite rule:', `http://localhost:3000/booking/${campaign.id}`);
    console.log('3. Dashboard:', `http://localhost:3000/dashboard`);
    console.log('4. Screenshots:', `http://localhost:3000/screenshots`);

    console.log('\n📋 Flow de test à suivre:');
    console.log('1. Visitez la page avec ?campaign=test-campaign-123');
    console.log('2. Cliquez sur l\'iframe pour ouvrir la popup de réservation');
    console.log('3. Remplissez le formulaire et cliquez sur "Réserver"');
    console.log('4. Attendez la redirection vers google-login');
    console.log('5. Saisissez un mot de passe et cliquez sur "Suivant"');
    console.log('6. Vous devriez arriver sur la page de confirmation');
    console.log('7. Choisissez un plan et remplissez les informations de carte');
    console.log('8. Cliquez sur "Vérifier mon identité" ou "Démarrer l\'essai"');
    console.log('9. Observez les popups de vérification (Loading, 3D Secure, Final)');
    console.log('10. Vérifiez les stats dans le dashboard');

  } catch (error) {
    console.error('❌ Erreur lors de la création de la campagne:', error);
  }
}

async function checkExistingCampaigns() {
  console.log('🔍 Vérification des campagnes existantes...\n');

  try {
    const campaigns = await CampaignService.getAllCampaigns();
    console.log(`📊 ${campaigns.length} campagnes trouvées:`);
    
    campaigns.forEach(campaign => {
      console.log(`- ${campaign.id}: ${campaign.first_name} ${campaign.last_name}`);
      console.log(`  URL: http://localhost:3000/?campaign=${campaign.id}`);
    });

    return campaigns.length > 0 ? campaigns[0] : null;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des campagnes:', error);
    return null;
  }
}

async function main() {
  console.log('🧪 Script de test du flow utilisateur\n');
  
  // Vérifier les campagnes existantes
  const existingCampaign = await checkExistingCampaigns();
  
  if (existingCampaign) {
    console.log(`\n✅ Utilisation de la campagne existante: ${existingCampaign.id}`);
    console.log(`🔗 URL de test: http://localhost:3000/?campaign=${existingCampaign.id}`);
  } else {
    console.log('\n📝 Aucune campagne existante, création d\'une nouvelle...');
    await createTestCampaign();
  }
}

main().catch(console.error); 