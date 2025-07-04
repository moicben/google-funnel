import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Screenshots() {
  const router = useRouter();
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des screenshots depuis les logs ou depuis une API
    fetchScreenshots();
  }, []);

  const fetchScreenshots = async () => {
    try {
      const response = await fetch('/api/list-screenshots');
      if (response.ok) {
        const data = await response.json();
        // Transformer les données de l'API pour le format attendu par la page
        const transformedScreenshots = data.screenshots.map((file, index) => ({
          step: `Étape ${index + 1}`,
          timestamp: new Date(file.created).toLocaleString('fr-FR'),
          url: file.url,
          name: file.name,
          size: file.size
        }));
        setScreenshots(transformedScreenshots);
      } else {
        console.error('Erreur API:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>📸 Chargement des Screenshots...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
      </div>

      <h1>📸 Screenshots de l'Automation Browserless</h1>
      
      {screenshots.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Aucun screenshot trouvé</h2>
          <p>Lancez une automation pour voir les screenshots ici.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {screenshots.map((screenshot, index) => (
            <div 
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {screenshot.step} - {screenshot.timestamp}
              </h3>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                📁 {screenshot.name} ({Math.round(screenshot.size / 1024)} KB)
              </div>
              <img 
                src={screenshot.url}
                alt={`Screenshot ${screenshot.step}`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', color: 'red', marginTop: '10px' }}>
                ❌ Impossible de charger l'image
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <a href={screenshot.url} target="_blank" rel="noopener noreferrer">
                  🔗 Ouvrir dans un nouvel onglet
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
        <h3>💡 Comment ça marche ?</h3>
        <ul>
          <li>Les screenshots sont automatiquement capturés lors de l'automation</li>
          <li>Ils sont sauvegardés dans <code>/public/screenshots/</code></li>
          <li>Chaque étape importante est photographiée</li>
          <li>Utile pour débugger et voir la progression</li>
        </ul>
      </div>
    </div>
  );
}
