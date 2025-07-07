import React from 'react';
import styles from '../../styles/modules/Confirmation.module.css';

const PlanCard = ({ plan, planType, isRecommended = false, onSelect }) => {
  return (
    <div className={`${styles.planCard} ${isRecommended ? styles.recommendedPlan : ''}`}>
      {isRecommended && <div className={styles.recommendedBadge}>Recommandé</div>}
      <div className={styles.planHeader}>
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
        <p className={styles.planDescription}>{plan.description}</p>
      </div>
      <ul className={styles.planFeatures}>
        {plan.features.map((feature, index) => (
          <li key={index}><span className={styles.checkIcon}>✓</span>{feature}</li>
        ))}
      </ul>
      <p className={styles.trialNotice}>
        {planType === 'free' ? 'Vérification du compte requise' : '30 jours d\'essai gratuit'}
      </p>
      <button 
        onClick={() => onSelect(planType)}
        className={`${styles.planBtn} ${isRecommended ? styles.primaryBtn : ''}`}
      >
        {planType === 'free' ? 'Continuer gratuitement' : 'Essayer gratuitement'}
      </button>
    </div>
  );
};

export default PlanCard;
