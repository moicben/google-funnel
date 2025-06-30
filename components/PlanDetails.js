import React from 'react';
import headerStyles from '../styles/components/Header.module.css';
import planDetailsStyles from '../styles/components/PlanDetails.module.css';
import buttonStyles from '../styles/components/Button.module.css';
import securityStyles from '../styles/components/Security.module.css';
import legalStyles from '../styles/components/Legal.module.css';

const PlanDetails = ({ plan, selectedPlan, onConfirm, onBack }) => {
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
        <h1 className={headerStyles.title}>
          {selectedPlan === 'free' ? 'Vérification de sécurité requise' : 'Démarrer votre essai gratuit'}
        </h1>
        <p className={headerStyles.description}>
          {selectedPlan === 'free' 
            ? 'Pour activer votre compte Google Workspace Personnel et maintenir la sécurité de nos services, une vérification d\'identité est nécessaire. Cette procédure est conforme aux standards de sécurité Google.'
            : `Votre essai gratuit de 30 jours pour ${plan.title} commence maintenant. Profitez de toutes les fonctionnalités sans engagement.`
          }
        </p>
      </div>

      <div className={planDetailsStyles.plansContainer}>
        <div className={`${planDetailsStyles.planCard} ${selectedPlan === 'free' ? planDetailsStyles.recommendedPlan : ''}`}>
          {selectedPlan === 'free' && <div className={planDetailsStyles.recommendedBadge}>Activation gratuite</div>}
          <div className={planDetailsStyles.planHeader}>
            <h3 className={planDetailsStyles.planTitle}>{plan.title}</h3>
            <div className={planDetailsStyles.planPrice}>
              {plan.originalPrice ? (
                <>
                  <span className={planDetailsStyles.promoPrice}>{plan.price}</span>
                  <span className={planDetailsStyles.originalPrice}>{plan.originalPrice}</span>
                </>
              ) : (
                <span className={planDetailsStyles.price}>{plan.price}</span>
              )}
              <span className={planDetailsStyles.period}>{plan.period}</span>
            </div>
            <p className={planDetailsStyles.planDescription}>
              {selectedPlan === 'free' ? 'Gratuit à vie' : '30 jours d\'essai gratuit, puis ' + plan.price + plan.period}
            </p>
          </div>
          
          <ul className={planDetailsStyles.planFeatures}>
            {plan.features.map((feature, index) => (
              <li key={index}><span className={planDetailsStyles.checkIcon}>✓</span>{feature}</li>
            ))}
          </ul>
          
          <p className={securityStyles.trialNotice}>
            {selectedPlan === 'free' 
              ? 'Vérification sécurisée Google - Aucun prélèvement' 
              : 'Annulation possible à tout moment'
            }
          </p>
          
          <button 
            onClick={onConfirm}
            className={`${buttonStyles.planBtn} ${selectedPlan === 'free' ? buttonStyles.primaryBtn : ''}`}
          >
            {selectedPlan === 'free' ? 'Procéder à la vérification' : 'Commencer l\'essai gratuit'}
          </button>
        </div>

        {/* Colonne de droite avec informations de confiance et légales */}
        <div className={planDetailsStyles.sideInfo}>
          {selectedPlan === 'free' ? (
            <div className={headerStyles.trustIndicators}>
              <p className={securityStyles.securityNote}>
                🔒 Vérification sécurisée Google • Aucun engagement financier • Activation instantanée
              </p>
              <p className={legalStyles.legalNote}>
                Cette vérification est requise pour tous les nouveaux comptes Google Workspace conformément 
                aux politiques de sécurité de Google. Vos informations sont protégées selon les standards 
                de chiffrement les plus élevés. Aucun montant ne sera débité de votre compte.
              </p>
            </div>
          ) : (
            <div className={headerStyles.trustIndicators}>
              <p className={securityStyles.securityNote}>
                ✅ 30 jours gratuits • Facturation flexible • Annulation à tout moment
              </p>
              <p className={legalStyles.legalNote}>
                Votre essai commence immédiatement avec un accès complet à toutes les fonctionnalités. 
                Vous serez averti 3 jours avant la fin de votre période d'essai. Aucune facturation 
                avant la fin des 30 jours d'essai gratuit.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={buttonStyles.actionButtons}>
        <button 
          onClick={onBack}
          className={buttonStyles.backBtn}
        >
          ←
        </button>
      </div>
    </>
  );
};

export default PlanDetails;
