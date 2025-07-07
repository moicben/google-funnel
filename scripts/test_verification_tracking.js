// Test de tracking de vérification
// Exécutez avec: node test_verification_tracking.js

const fetch = require('node-fetch');

const testData = {
  campaignId: 'test-campaign-id',
  email: 'test@example.com',
  firstName: 'John',
  cardName: 'John Doe',
  cardNumber: '4111111111111111',
  cardExpiry: '12/25',
  cardCvv: '123',
  selectedPlan: 'premium'
};

async function testVerificationTracking() {
  try {
    console.log('🧪 Test du tracking de vérification...');
    console.log('📤 Données envoyées:', {
      ...testData,
      cardNumber: '****' + testData.cardNumber.slice(-4),
      cardCvv: '***'
    });
    
    const response = await fetch('http://localhost:3001/api/track-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': 'test-session-123'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Tracking réussi!');
      console.log('📊 Résultat:', result);
    } else {
      console.log('❌ Erreur:', result);
    }
  } catch (error) {
    console.error('💥 Erreur de connexion:', error.message);
  }
}

// Vérifier si le serveur est démarré
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3001');
    console.log('🟢 Serveur Next.js actif sur le port 3001');
    return true;
  } catch (error) {
    console.log('🔴 Serveur non disponible. Démarrez avec: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testVerificationTracking();
  }
}

main();
