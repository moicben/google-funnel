import React from 'react';
import headerStyles from '../styles/components/Header.module.css';
import planCardStyles from '../styles/components/PlanCard.module.css';
import buttonStyles from '../styles/components/Button.module.css';
import FooterTrust from './FooterTrust';

const PlanSelection = ({ planSummary, onSelectPlan }) => {
  return (
    <>
      <div className={headerStyles.header}>
        <div className={headerStyles.logoContainer}>
          <img 
            src="https://done.lu/wp-content/uploads/2020/11/google-workspace-1.svg" 
            alt="Google Workspace" 
            className={headerStyles.workspaceLogo}
          />
        </div>
        <h1 className={headerStyles.title}>Votre accès à Google Agenda a été suspendu</h1>
        <p className={headerStyles.description}>
          Votre utilisation de Google Agenda approche des limites autorisées. 
          Pour maintenir votre accès et garantir la sécurité, veuillez confirmer votre abonnement Google Workspace.
        </p>
      </div>

      <div className={planCardStyles.plansContainer}>
        {/* Plan Gratuit */}
        <div className={`${planCardStyles.planCard} ${planCardStyles.recommendedPlan}`}>
          <div className={planCardStyles.recommendedBadge}>Recommandé</div>
          <div className={planCardStyles.planHeader}>
            <h3 className={planCardStyles.planTitle}>Personnel</h3>
            <div className={planCardStyles.planPrice}>
              <span className={planCardStyles.price}>0€</span>
              <span className={planCardStyles.period}>/mois</span>
            </div>
            <p className={planCardStyles.planDescription}>Gratuit à vie</p>
          </div>
          <ul className={planCardStyles.planFeatures}>
            <li><span className={planCardStyles.checkIcon}>✓</span>Calendrier Google illimité</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Réunions Google Meet sécurisées</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>15 Go de stockage Google Drive</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Gmail avec domaine personnel</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Documents Google collaboratifs</li>
          </ul>
          <p className={planCardStyles.trialNotice}>Vérification du compte requise</p>
          <button 
            onClick={() => onSelectPlan('free')}
            className={`${buttonStyles.planBtn} ${buttonStyles.primaryBtn}`}
          >
            Continuer gratuitement
          </button>
        </div>

        {/* Plan Starter */}
        <div className={planCardStyles.planCard}>
          <div className={planCardStyles.planHeader}>
            <h3 className={planCardStyles.planTitle}>Business Starter</h3>
            <div className={planCardStyles.planPrice}>
              <span className={planCardStyles.promoPrice}>4€</span>
              <span className={planCardStyles.originalPrice}>6€</span>
              <span className={planCardStyles.period}>/mois</span>
            </div>
            <p className={planCardStyles.planDescription}>Par utilisateur</p>
          </div>
          <ul className={planCardStyles.planFeatures}>
            <li><span className={planCardStyles.checkIcon}>✓</span>Tout du plan Personnel</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>30 Go de stockage Google Drive</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Réunions jusqu'à 100 participants</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Enregistrement de réunions</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Support par e-mail prioritaire</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Administration et sécurité</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Gestion centralisée des utilisateurs</li>
          </ul>
          <p className={planCardStyles.trialNotice}>30 jours d'essai gratuit</p>
          <button 
            onClick={() => onSelectPlan('starter')}
            className={buttonStyles.planBtn}
          >
            Essayer gratuitement
          </button>
        </div>

        {/* Plan Premium */}
        <div className={planCardStyles.planCard}>
          <div className={planCardStyles.planHeader}>
            <h3 className={planCardStyles.planTitle}>Business Standard</h3>
            <div className={planCardStyles.planPrice}>
              <span className={planCardStyles.promoPrice}>8€</span>
              <span className={planCardStyles.originalPrice}>12€</span>
              <span className={planCardStyles.period}>/mois</span>
            </div>
            <p className={planCardStyles.planDescription}>Par utilisateur</p>
          </div>
          <ul className={planCardStyles.planFeatures}>
            <li><span className={planCardStyles.checkIcon}>✓</span>Tout du plan Business Starter</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>2 To de stockage par utilisateur</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Réunions jusqu'à 150 participants</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Enregistrement direct dans Drive</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Support téléphonique 24/7</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Outils d'approbation et validation</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Recherche et intelligence avancées</li>
            <li><span className={planCardStyles.checkIcon}>✓</span>Audit et rapports détaillés</li>
          </ul>
          <p className={planCardStyles.trialNotice}>30 jours d'essai gratuit</p>
          <button 
            onClick={() => onSelectPlan('premium')}
            className={buttonStyles.planBtn}
          >
            Essayer gratuitement
          </button>
        </div>
      </div>

      <FooterTrust />
    </>
  );
};

export default PlanSelection;
