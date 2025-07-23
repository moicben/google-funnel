import React from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/components/CommonPopup.module.css';

/**
 * Composant de base pour toutes les popups
 * Fournit la structure commune avec wrapper, close button et createPortal
 * @param {Object} props
 * @param {boolean} props.isVisible - Si la popup est visible
 * @param {Function} props.onClose - Callback de fermeture
 * @param {React.ReactNode} props.children - Contenu de la popup
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const BasePopup = ({ isVisible, onClose, children, className = '' }) => {
  if (!isVisible) return null;

  const handleWrapperClick = (e) => {
    // Fermer si on clique sur le fond mais pas sur la popup elle-même
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePopupClick = (e) => {
    // Empêcher la fermeture si on clique à l'intérieur de la popup
    e.stopPropagation();
  };

  const popupContent = (
    <div className={styles.popupWrapper} onClick={handleWrapperClick}>
      <div 
        className={`${styles.popup} ${className}`} 
        onClick={handlePopupClick} 
        data-popup="true"
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre la popup au niveau du body
  return typeof window !== 'undefined' 
    ? createPortal(popupContent, document.body)
    : null;
};

export default BasePopup; 