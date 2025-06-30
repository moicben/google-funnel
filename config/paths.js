// Configuration partagée des chemins d'URL
export const BASE_PATH = '/calendar/u/0/appointments/schedules';

// Fonction utilitaire pour construire des URLs complètes
export const buildUrl = (baseUrl, page = 'booking', campaign = null) => {
  let url = `${baseUrl}${BASE_PATH}/${page}`;
  if (campaign) {
    url += `/${campaign}`;
  }
  return url;
};
