import React from 'react';
import headerStyles from '../../styles/components/Header.module.css';

const FooterTrust = () => {
  return (
    <div className={headerStyles.trustIndicators}>
      <p className={headerStyles.securityNote}>
        Conformité Google • Utilisation mensuelle flexible • Annulation à tout moment
      </p>
      <p className={headerStyles.legalNote}>
        En continuant, vous acceptez les Conditions d'utilisation de Google Workspace et reconnaissez 
        avoir pris connaissance des Règles de confidentialité de Google. Tous les paiements sont traités 
        de manière sécurisée. L'utilisation est soumise aux politiques d'utilisation équitable de Google. 
        Les tarifs sont susceptibles de modification avec un préavis de 30 jours. Service client disponible 24/7.
      </p>
    </div>
  );
};

export default FooterTrust;
