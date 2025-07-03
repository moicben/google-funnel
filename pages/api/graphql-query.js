import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'rentoflow.graphql');
    const query = fs.readFileSync(filePath, 'utf8');
    
    res.status(200).json({ query });
  } catch (error) {
    console.error('Error reading GraphQL file:', error);
    res.status(500).json({ message: 'Error reading GraphQL file' });
  }
}
