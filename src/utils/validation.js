/**
 * Utilitaires de validation
 */

/**
 * Valide qu'une adresse email est une adresse Gmail valide
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} - true si l'email est une adresse Gmail valide
 */
export const validateGmailAddress = (email) => {
  const emailRegex = /^[^\s@]+@gmail\.com$/i;
  return emailRegex.test(email);
}; 