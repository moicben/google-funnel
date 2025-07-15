import { useState, useEffect } from 'react';
import Head from 'next/head';
import CampaignSelector from '../src/components/dashboard/CampaignSelector';
import MetricsGrid from '../src/components/dashboard/MetricsGrid';
import SimpleFunnelChart from '../src/components/dashboard/SimpleFunnelChart';
import ConversionChart from '../src/components/dashboard/ConversionChart';
import { BarChart3, TrendingUp, RefreshCw, Link, Copy, Check } from 'lucide-react';
import styles from '../src/styles/modules/Dashboard.module.css';
import { buildUrl, buildUrlByType, getAvailableLandingTypes } from '../config/paths';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  const fetchStats = async (campaignId = 'all') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/campaign-dashboard-stats?campaignId=${campaignId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du chargement des données');
      }
      
      if (data.type === 'all') {
        setCampaigns(data.campaigns);
      }
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats(selectedCampaign);
  }, [selectedCampaign]);
  
  const handleCampaignChange = (campaignId) => {
    setSelectedCampaign(campaignId);
  };
  
  const handleRefresh = () => {
    fetchStats(selectedCampaign);
  };

  const generateLink = (campaignId, landingType = 'calendar') => {
    if (!campaignId || campaignId === 'all') {
      return '';
    }
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return buildUrlByType(baseUrl, landingType, campaignId);
  };

  const handleLinkGeneration = () => {
    if (selectedCampaign === 'all') {
      alert('Veuillez sélectionner une campagne spécifique pour générer un lien');
      return;
    }
    
    // Récupérer les données de la campagne sélectionnée
    const campaign = campaigns.find(c => c.id === selectedCampaign);
    const landingType = campaign?.landing_type || 'calendar';
    
    const link = generateLink(selectedCampaign, landingType);
    setGeneratedLink(link);
    setShowLinkGenerator(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      alert('Erreur lors de la copie du lien');
    }
  };

  const handlePreview = (landingType) => {
    if (selectedCampaign === 'all') {
      alert('Veuillez sélectionner une campagne spécifique pour prévisualiser');
      return;
    }
    
    const previewUrl = generateLink(selectedCampaign, landingType);
    window.open(previewUrl, '_blank');
  };
  
  const getCurrentCampaignInfo = () => {
    if (selectedCampaign === 'all') {
      return {
        title: 'Dashboard - Toutes les campagnes',
        subtitle: `Vue d'ensemble de ${campaigns.length} campagne${campaigns.length > 1 ? 's' : ''}`
      };
    }
    
    const campaign = campaigns.find(c => c.id === selectedCampaign);
    if (campaign) {
      return {
        title: `Dashboard - ${campaign.first_name} ${campaign.last_name}`,
        subtitle: campaign.title || 'Campagne individuelle'
      };
    }
    
    return {
      title: 'Dashboard',
      subtitle: 'Sélectionnez une campagne'
    };
  };
  
  const currentInfo = getCurrentCampaignInfo();
  
  if (error) {
    return (
      <div className={styles['dashboard-container']} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#ef4444', fontSize: '3rem', marginBottom: '1rem'}}>⚠️</div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>Erreur</h1>
          <p style={{color: '#6b7280', marginBottom: '1rem'}}>{error}</p>
          <button
            onClick={handleRefresh}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Dashboard Campagnes - Statistiques</title>
        <meta name="description" content="Dashboard des statistiques de campagnes" />
      </Head>
      
      <div className={styles['dashboard-container']}>
        {/* Header */}
        <div className={styles['header']}>
          <div className={styles['header-content']}>
            <div className={styles['header-flex']}>
              <div className={styles['header-left']}>
                <div className={styles['campaign-selector-header']}>
                  <CampaignSelector
                    campaigns={campaigns}
                    selectedCampaign={selectedCampaign}
                    onCampaignChange={handleCampaignChange}
                  />
                </div>
                <div className={styles['header-icon']}>
                  <BarChart3 />
                </div>
                <div className={styles['header-text']}>
                  <h1>{currentInfo.title}</h1>
                  <p>{currentInfo.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={styles['refresh-button']}
              >
                <RefreshCw className={loading ? styles.spin : ''} />
                <span>Actualiser</span>
              </button>
              
              {selectedCampaign !== 'all' && (
                <>
                  <button
                    onClick={handleLinkGeneration}
                    className={styles['link-button']}
                    title="Générer un lien pour cette campagne"
                  >
                    <Link />
                    <span>Lien</span>
                  </button>
                  
                  {/* Boutons de prévisualisation par type */}
                  {getAvailableLandingTypes().map(landingType => (
                    <button
                      key={landingType}
                      onClick={() => handlePreview(landingType)}
                      className={styles['preview-button']}
                      title={`Prévisualiser ${landingType}`}
                    >
                      <span>{landingType === 'calendar' ? '📅' : landingType === 'drive' ? '💾' : '📄'}</span>
                      <span>{landingType.charAt(0).toUpperCase() + landingType.slice(1)}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Popup de génération de lien */}
        {showLinkGenerator && (
          <div className={styles['link-popup-overlay']} onClick={() => setShowLinkGenerator(false)}>
            <div className={styles['link-popup']} onClick={(e) => e.stopPropagation()}>
              <div className={styles['link-popup-header']}>
                <h3>Lien de campagne généré</h3>
                <button 
                  onClick={() => setShowLinkGenerator(false)}
                  className={styles['link-popup-close']}
                >
                  ×
                </button>
              </div>
              <div className={styles['link-popup-content']}>
                <div className={styles['link-container']}>
                  <input 
                    type="text" 
                    value={generatedLink} 
                    readOnly 
                    className={styles['link-input']}
                  />
                  <button 
                    onClick={copyToClipboard} 
                    className={styles['copy-button']}
                    title={linkCopied ? 'Copié !' : 'Copier le lien'}
                  >
                    {linkCopied ? <Check /> : <Copy />}
                  </button>
                </div>
                <p className={styles['link-info']}>
                  Ce lien redirigera vers votre funnel pour la campagne sélectionnée
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className={styles['main-content']}>
          <div className={styles['content-single']}>
            {loading ? (
              <div className={styles['loading-container']}>
                <div className={styles['loading-spinner']}></div>
                <span className={styles['loading-text']}>Chargement des données...</span>
              </div>
            ) : stats ? (
              <>
                {/* Métriques principales */}
                <div>
                  <h2 className={styles['section-title']}>Métriques principales</h2>
                  <MetricsGrid stats={stats} />
                </div>
                
                {/* Entonnoir de conversion */}
                <SimpleFunnelChart 
                  data={stats.funnelData} 
                  title="Entonnoir de conversion"
                />
                
                {/* Graphiques de conversion */}
                <div>
                  <h2 className={styles['section-title']}>Analyse des conversions</h2>
                  <ConversionChart stats={stats} />
                </div>
              </>
            ) : (
              <div className={styles['empty-state']}>
                <TrendingUp />
                <h3>Aucune donnée disponible</h3>
                <p>Sélectionnez une campagne pour voir les statistiques.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
