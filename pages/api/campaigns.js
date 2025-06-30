import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Chemin vers le fichier campaigns.json
      const jsonDirectory = path.join(process.cwd(), 'data');
      const fileContents = await fs.readFile(jsonDirectory + '/campaigns.json', 'utf8');
      const data = JSON.parse(fileContents);
      
      res.status(200).json(data);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier campaigns.json:', error);
      res.status(500).json({ error: 'Erreur lors du chargement des campagnes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
