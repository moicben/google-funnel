import React from 'react';
import styles from '../styles/components/PlanSummary.module.css';

const PlanSummary = ({ plan, selectedPlan }) => {
  return (
    <div className={styles.leftColumn}>
      <div className={styles.planSummary}>
        <h3 className={styles.planTitle}>{plan.title}</h3>
        <div className={styles.planPrice}>
          {plan.originalPrice ? (
            <>
              <span className={styles.promoPrice}>{plan.price}</span>
              <span className={styles.originalPrice}>{plan.originalPrice}</span>
            </>
          ) : (
            <span className={styles.price}>{plan.price}</span>
          )}
          <span className={styles.period}>{plan.period}</span>
        </div>
        <p className={styles.planDescription}>
          {selectedPlan === 'free' ? 'Gratuit à vie' : '30 jours d\'essai gratuit'}
        </p>
      </div>

      <div className={styles.legalSection}>
        {selectedPlan === 'free' ? (
          <div className={styles.infoBox}>
            <h4 className={styles.sectionTitle}>🔒 Vérification du compte</h4>
            <ul className={styles.infoList}>
              <li>Aucun prélèvement financier</li>
              <li>Vérification conforme Google</li>
              <li>Chiffrement niveau bancaire</li>
              <li>Données 100% anonymes</li>
              <li>Activation instantanée</li>
            </ul>
          </div>
        ) : (
          <>
            <div className={styles.infoBox}>
              <h4 className={styles.sectionTitle}>🎯 Essai gratuit 30 jours</h4>
              <ul className={styles.infoList}>
                <li>30 jours entièrement gratuits</li>
                <li>Toutes les fonctionnalités</li>
                <li>Notification avant facturation</li>
                <li>Annulation en un clic</li>
                <li>Aucune pénalité</li>
              </ul>
            </div>
            
            {/* <div className={styles.infoBox}>
              <h4 className={styles.sectionTitle}>🔐 Paiement sécurisé</h4>
              <ul className={styles.infoList}>
                <li>SSL 256-bit</li>
                <li>Conformité PCI DSS</li>
                <li>Protection anti-fraude</li>
                <li>Remboursement intégral</li>
              </ul>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default PlanSummary;
