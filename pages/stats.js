import React from 'react';
import { useRouter } from 'next/router';
import { useCampaignStats } from '../hooks/useCampaignStats';
import { useCampaign } from '../hooks/useCampaigns';
import styles from '../styles/Stats.module.css';

const StatsPage = () => {
  const router = useRouter();
  const { campaign: campaignId } = router.query;
  
  const { campaign: campaignData, loading: campaignLoading } = useCampaign(campaignId);
  const { stats, loading: statsLoading, error, refreshStats } = useCampaignStats(campaignId);

  if (campaignLoading || statsLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={refreshStats} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Campagne non trouvée</h2>
          <p>La campagne demandée n'existe pas ou n'est plus active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Statistiques de campagne</h1>
        <h2>{campaignData.firstName} {campaignData.lastName}</h2>
        <button onClick={refreshStats} className={styles.refreshButton}>
          Actualiser
        </button>
      </div>

      {stats && (
        <div className={styles.statsGrid}>
          {/* Statistiques principales */}
          <div className={styles.statsCard}>
            <h3>Vue d'ensemble</h3>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total des visites :</span>
                <span className={styles.statValue}>{stats.totalVisits}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Visiteurs uniques :</span>
                <span className={styles.statValue}>{stats.uniqueVisitors}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Visites récentes (7j) :</span>
                <span className={styles.statValue}>{stats.recentVisits}</span>
              </div>
            </div>
          </div>

          {/* Statistiques par appareil */}
          <div className={styles.statsCard}>
            <h3>Types d'appareils</h3>
            <div className={styles.statsList}>
              {Object.entries(stats.deviceStats || {}).map(([device, count]) => (
                <div key={device} className={styles.statItem}>
                  <span className={styles.statLabel}>{device} :</span>
                  <span className={styles.statValue}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques par navigateur */}
          <div className={styles.statsCard}>
            <h3>Navigateurs</h3>
            <div className={styles.statsList}>
              {Object.entries(stats.browserStats || {}).map(([browser, count]) => (
                <div key={browser} className={styles.statItem}>
                  <span className={styles.statLabel}>{browser} :</span>
                  <span className={styles.statValue}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources de trafic */}
          <div className={styles.statsCard}>
            <h3>Sources de trafic</h3>
            <div className={styles.statsList}>
              {Object.entries(stats.referrerStats || {}).map(([referrer, count]) => (
                <div key={referrer} className={styles.statItem}>
                  <span className={styles.statLabel}>{referrer} :</span>
                  <span className={styles.statValue}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visites par jour */}
          <div className={styles.statsCard}>
            <h3>Visites par jour (7 derniers jours)</h3>
            <div className={styles.statsList}>
              {Object.entries(stats.visitsByDay || {}).map(([day, count]) => (
                <div key={day} className={styles.statItem}>
                  <span className={styles.statLabel}>{day} :</span>
                  <span className={styles.statValue}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informations temporelles */}
          <div className={styles.statsCard}>
            <h3>Informations temporelles</h3>
            <div className={styles.statsList}>
              {stats.firstVisit && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Première visite :</span>
                  <span className={styles.statValue}>
                    {new Date(stats.firstVisit).toLocaleString('fr-FR')}
                  </span>
                </div>
              )}
              {stats.lastVisit && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Dernière visite :</span>
                  <span className={styles.statValue}>
                    {new Date(stats.lastVisit).toLocaleString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
