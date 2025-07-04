import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
    
    // Vérifier si le dossier screenshots existe
    if (!fs.existsSync(screenshotsDir)) {
      console.log('Dossier screenshots inexistant, création...');
      fs.mkdirSync(screenshotsDir, { recursive: true });
      return res.status(200).json({ screenshots: [] });
    }

    // Lire tous les fichiers du dossier screenshots
    const files = fs.readdirSync(screenshotsDir);
    
    // Filtrer seulement les fichiers image (PNG, JPG, JPEG)
    const screenshots = files
      .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
      .map(file => {
        const filePath = path.join(screenshotsDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          url: `/screenshots/${file}`,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString()
        };
      })
      // Trier par date de création (plus récent en premier)
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    console.log(`API list-screenshots: ${screenshots.length} screenshots trouvés`);
    
    res.status(200).json({ 
      screenshots,
      total: screenshots.length 
    });

  } catch (error) {
    console.error('Erreur lors de la lecture des screenshots:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des screenshots',
      details: error.message 
    });
  }
}
