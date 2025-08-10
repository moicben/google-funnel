/**
 * Utilitaires de redirection
 */

/**
 * Redirige vers la page de login Google avec les paramètres fournis
 * @param {Object} params - Les paramètres à passer dans l'URL
 * @param {string} params.email - L'email de l'utilisateur
 * @param {string} [params.firstName] - Le prénom de l'utilisateur
 * @param {string} [params.lastName] - Le nom de l'utilisateur
 * @param {string} [params.campaign] - L'ID de la campagne
 */
export const redirectToGoogleLogin = (params) => {
  const url = new URLSearchParams();
  
  // Ajouter seulement les paramètres définis
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.append(key, value);
    }
  });

  // délais 7 secondes
  setTimeout(() => {
    window.location.href = `/google-login?${url.toString()}`;
  }, 7000);
}; 