// API pour récupérer l'historique des paiements
// Utilisée par PaymentService.verifyCard() pour vérifier les cartes déjà utilisées

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Pour l'instant, retourner un tableau vide car nous n'avons pas de base de données de paiements
    // En production, ceci devrait récupérer les données depuis Supabase ou une autre base de données
    
    // Simulation de données pour les tests
    const simulatedPayments = [
      {
        id: 1,
        card_details: {
          cardNumber: '4242424242424242'
        },
        status: 'success',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        card_details: JSON.stringify({
          cardNumber: '4000000000000002'
        }),
        status: 'rejected',
        created_at: new Date().toISOString()
      }
    ];

    res.status(200).json({ 
      success: true,
      payments: simulatedPayments 
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des paiements',
      payments: [] // Retourner un tableau vide en cas d'erreur
    });
  }
} 