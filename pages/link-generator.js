import { useState, useEffect } from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import styles from '../styles/LinkGenerator.module.css';
import { buildUrl } from '../config/paths';

export default function LinkGenerator() {
  const { campaigns, loading, error } = useCampaigns();
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Définir l'URL de base automatiquement
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const generateLink = () => {
    if (!selectedCampaign) {
      alert('Veuillez sélectionner une campagne');
      return;
    }

    // Utilise la configuration BASE_PATH partagée avec next.config.js
    const link = buildUrl(baseUrl, 'booking', selectedCampaign);
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Lien copié dans le presse-papiers !');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Générateur de Liens WhatsApp</h1>
          <p>Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Générateur de Liens WhatsApp</h1>
          <p>Erreur lors du chargement des campagnes: {error}</p>
        </div>
      </div>
    );
  }

  const campaignKeys = Object.keys(campaigns);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Générateur de Liens WhatsApp</h1>
        <p>Créez des liens personnalisés pour vos campagnes WhatsApp</p>
      </div>

      <div className={styles.generator}>
        <div className={styles.section}>
          <label htmlFor="campaign-select">Sélectionner une campagne :</label>
          <select 
            id="campaign-select"
            value={selectedCampaign} 
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Choisir une campagne --</option>
            {campaignKeys.map(key => (
              <option key={key} value={key}>
                {campaigns[key].firstName} {campaigns[key].lastName} - {campaigns[key].title || key}
              </option>
            ))}
          </select>
        </div>

        {selectedCampaign && (
          <div className={styles.preview}>
            <h3>Aperçu de la campagne :</h3>
            <div className={styles.campaignInfo}>
              <p><strong>ID :</strong> {selectedCampaign}</p>
              <p><strong>Responsable :</strong> {campaigns[selectedCampaign].firstName} {campaigns[selectedCampaign].lastName}</p>
              <p><strong>Email :</strong> {campaigns[selectedCampaign].email}</p>
              <p><strong>Titre :</strong> {campaigns[selectedCampaign].title}</p>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <button onClick={generateLink} className={styles.generateBtn}>
            Générer le lien
          </button>
        </div>

        {generatedLink && (
          <div className={styles.result}>
            <h3>Lien généré :</h3>
            <div className={styles.linkContainer}>
              <input 
                type="text" 
                value={generatedLink} 
                readOnly 
                className={styles.linkInput}
              />
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                Copier
              </button>
            </div>
            <p className={styles.linkInfo}>
              Ce lien redirigera vers votre funnel avec l'ID de campagne <strong>{selectedCampaign}</strong>
            </p>
          </div>
        )}
      </div>

      <div className={styles.instructions}>
        <h3>Comment utiliser :</h3>
        <ol>
          <li>Sélectionnez une campagne dans la liste</li>
          <li>Cliquez sur "Générer le lien"</li>
          <li>Copiez le lien généré</li>
          <li>Utilisez ce lien dans vos campagnes WhatsApp</li>
        </ol>
      </div>
    </div>
  );
}
