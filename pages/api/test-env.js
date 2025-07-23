export default function handler(req, res) {
  // Test des variables d'environnement
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? 'Définie' : 'Non définie',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'Définie' : 'Non définie',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Définie' : 'Non définie',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Définie' : 'Non définie',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Définie' : 'Non définie',
    NODE_ENV: process.env.NODE_ENV
  };

  res.status(200).json({
    message: 'Test des variables d\'environnement',
    variables: envVars,
    timestamp: new Date().toISOString()
  });
} 