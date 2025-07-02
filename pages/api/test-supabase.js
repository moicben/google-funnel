// Test API pour vérifier la connectivité Supabase
export default async function handler(req, res) {
  try {
    console.log('Test de connectivité Supabase...');
    
    // Importer le client Supabase
    const { supabase } = await import('../../lib/supabase');
    
    // Test simple - lister les tables
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, first_name, last_name')
      .limit(1);
    
    if (campaignsError) {
      console.error('Erreur table campaigns:', campaignsError);
      return res.status(500).json({ 
        error: 'Erreur table campaigns',
        details: campaignsError 
      });
    }
    
    // Test table campaign_leads
    const { data: leads, error: leadsError } = await supabase
      .from('campaign_leads')
      .select('id, email')
      .limit(1);
    
    if (leadsError) {
      console.error('Erreur table campaign_leads:', leadsError);
      return res.status(500).json({ 
        error: 'Table campaign_leads non trouvée. Avez-vous exécuté les migrations ?',
        details: leadsError 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Connectivité Supabase OK',
      tables: {
        campaigns: campaigns?.length || 0,
        campaign_leads: leads?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Erreur test Supabase:', error);
    res.status(500).json({ 
      error: 'Erreur test Supabase',
      details: error.message 
    });
  }
}
