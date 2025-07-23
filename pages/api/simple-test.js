import { supabase } from '../../src/lib/db/supabase';

export default async function handler(req, res) {
  try {
    console.log('[Simple Test] Starting test');
    
    // Test simple de connexion à Supabase
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, first_name, last_name')
      .limit(1);
    
    if (error) {
      console.error('[Simple Test] Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        details: error 
      });
    }
    
    console.log('[Simple Test] Success, data:', data);
    
    res.status(200).json({
      success: true,
      message: 'Supabase connection OK',
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Simple Test] Catch error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    });
  }
} 