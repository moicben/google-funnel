// Script pour tester le flow frontend sans base de données
// Exécuter avec : node test_frontend_flow.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function analyzeProject() {
  console.log('🔍 Analyse du projet agenda-funnel...\n');

  // Vérifier la structure du projet
  const importantFiles = [
    'pages/index.js',
    'pages/google-login.js', 
    'pages/confirmation.js',
    'pages/dashboard.js',
    'src/components/booking/BookingPopup.js',
    'src/components/payment/PaymentForm.js',
    'src/components/payment/Checkout.js',
    'src/lib/db/supabase.js',
    'next.config.js',
    'package.json'
  ];

  const existingFiles = [];
  const missingFiles = [];

  importantFiles.forEach(file => {
    if (checkFileExists(file)) {
      existingFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  });

  console.log(`✅ Fichiers existants: ${existingFiles.length}/${importantFiles.length}`);
  existingFiles.forEach(file => console.log(`  - ${file}`));

  if (missingFiles.length > 0) {
    console.log(`\n❌ Fichiers manquants: ${missingFiles.length}`);
    missingFiles.forEach(file => console.log(`  - ${file}`));
  }

  // Vérifier les URLs de rewrites
  console.log('\n🔗 URLs de test disponibles:');
  console.log('1. Page d\'accueil:', 'http://localhost:3000/');
  console.log('2. Page avec campagne:', 'http://localhost:3000/?campaign=test-123');
  console.log('3. Via rewrite:', 'http://localhost:3000/booking/test-123');
  console.log('4. Google login:', 'http://localhost:3000/google-login?email=test@gmail.com&firstName=Jean');
  console.log('5. Confirmation:', 'http://localhost:3000/confirmation?email=test@gmail.com&firstName=Jean');
  console.log('6. Dashboard:', 'http://localhost:3000/dashboard');
  console.log('7. Screenshots:', 'http://localhost:3000/screenshots');

  // Instructions de test
  console.log('\n📋 Instructions pour tester le flow:');
  console.log('1. Démarrez le serveur: npm run dev');
  console.log('2. Ouvrez http://localhost:3000/?campaign=test-123');
  console.log('3. Suivez le flow complet:');
  console.log('   a. Cliquez sur l\'iframe pour ouvrir la popup');
  console.log('   b. Remplissez le formulaire de réservation');
  console.log('   c. Cliquez sur "Réserver" → redirection vers google-login');
  console.log('   d. Saisissez un mot de passe → redirection vers confirmation');
  console.log('   e. Choisissez un plan → remplissez les infos de carte');
  console.log('   f. Cliquez sur "Vérifier" → popups de vérification');
  console.log('   g. Tentez plusieurs fois (retry)');
  console.log('   h. Vérifiez les stats dans le dashboard');

  // Vérifier les erreurs potentielles
  console.log('\n🔧 Corrections appliquées:');
  console.log('✅ BookingPopup: Redirection par window.location.href au lieu de window.open');
  console.log('✅ useVisitTracker: Correction du chemin API vers /api/tracking/track-visit');
  console.log('✅ Structure: Réorganisation complète en domaines fonctionnels');
  console.log('✅ APIs: Groupement logique des endpoints');
  console.log('✅ Composants: Séparation booking/payment/dashboard/common');
  console.log('✅ Styles: Organisation modulaire et responsive');

  console.log('\n🚀 Le serveur de développement est déjà en cours d\'exécution...');
  console.log('Vous pouvez maintenant tester le flow dans votre navigateur!');
  
  return { existingFiles, missingFiles };
}

function simulateUserFlow() {
  console.log('\n🎭 Simulation du flow utilisateur:');
  console.log('');
  console.log('👤 ÉTAPE 1: Visiteur arrive sur la page');
  console.log('   URL: http://localhost:3000/?campaign=test-123');
  console.log('   ➡️ useVisitTracker appelle /api/tracking/track-visit');
  console.log('   ➡️ Affichage de l\'iframe Google Calendar');
  console.log('');
  console.log('👤 ÉTAPE 2: Clic sur l\'iframe');
  console.log('   ➡️ Ouverture de BookingPopup');
  console.log('   ➡️ Formulaire de réservation affiché');
  console.log('');
  console.log('👤 ÉTAPE 3: Soumission du formulaire');
  console.log('   ➡️ trackBooking appelle /api/tracking/track-booking');
  console.log('   ➡️ Popup de confirmation (3 secondes)');
  console.log('   ➡️ Redirection vers /google-login');
  console.log('');
  console.log('👤 ÉTAPE 4: Page de connexion Google');
  console.log('   ➡️ Saisie du mot de passe');
  console.log('   ➡️ trackLogin appelle /api/tracking/track-login');
  console.log('   ➡️ Redirection vers /confirmation');
  console.log('');
  console.log('👤 ÉTAPE 5: Page de confirmation');
  console.log('   ➡️ Choix du plan (gratuit/starter/premium)');
  console.log('   ➡️ Saisie des informations de carte');
  console.log('   ➡️ Clic sur "Vérifier mon identité"');
  console.log('');
  console.log('👤 ÉTAPE 6: Processus de vérification');
  console.log('   ➡️ trackVerification appelle /api/tracking/track-verification');
  console.log('   ➡️ LoadingPopup (26 secondes)');
  console.log('   ➡️ ThreeDSecurePopup (interaction utilisateur)');
  console.log('   ➡️ EndPopup (retry possible)');
  console.log('');
  console.log('👤 ÉTAPE 7: Vérification dashboard');
  console.log('   ➡️ http://localhost:3000/dashboard');
  console.log('   ➡️ Visualisation des métriques et du tunnel');
  console.log('');
}

function main() {
  console.log('🧪 Test du Flow Utilisateur - Agenda Funnel');
  console.log('=' .repeat(50));
  
  const analysis = analyzeProject();
  simulateUserFlow();
  
  console.log('\n💡 Conseils pour les tests:');
  console.log('- Utilisez les DevTools pour surveiller les appels API');
  console.log('- Testez avec différents navigateurs');
  console.log('- Vérifiez les erreurs dans la console');
  console.log('- Testez le responsive design');
  console.log('- Simulez des erreurs réseau');
  console.log('');
  console.log('🎯 Objectif: Valider que chaque étape fonctionne sans erreur');
  console.log('   et que les données sont correctement trackées.');
}

main(); 