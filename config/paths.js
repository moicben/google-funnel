// Configuration partagée des chemins d'URL
export const BASE_PATH = '/calendar/u/0/appointments/schedules';

// Configuration des types de landing pages et leurs chemins
export const LANDING_TYPES = {
  calendar: {
    basePath: '/calendar/u/0/appointments/schedules',
    name: 'Google Calendar',
    favicon: '/calendar-favicon.ico'
  },
  drive: {
    basePath: '/drive/u/0/folders',
    name: 'Google Drive', 
    favicon: '/drive-favicon.ico'
  },
  post: {
    basePath: '/post/ma-reco-2025',
    name: 'Post Landing',
    favicon: '/favicon.ico'
  },
  custom: {
    basePath: '/custom',
    name: 'Custom Landing',
    favicon: '/favicon.ico'
  }
};

// Fonction utilitaire pour construire des URLs complètes (legacy)
export const buildUrl = (baseUrl, page = 'booking', campaign = null) => {
  let url = `${baseUrl}${BASE_PATH}/${page}`;
  if (campaign) {
    url += `/${campaign}`;
  }
  return url;
};

// Nouvelle fonction pour construire des URLs par type de landing
export const buildUrlByType = (baseUrl, landingType = 'calendar', campaign = null) => {
  const landingConfig = LANDING_TYPES[landingType];
  if (!landingConfig) {
    console.warn(`Type de landing inconnu: ${landingType}, utilisation de 'calendar' par défaut`);
    return buildUrlByType(baseUrl, 'calendar', campaign);
  }

  let url = `${baseUrl}${landingConfig.basePath}/booking`;
  if (campaign) {
    url += `/${campaign}`;
  }
  return url;
};

// Fonction utilitaire pour obtenir la config d'un type de landing
export const getLandingConfig = (landingType) => {
  return LANDING_TYPES[landingType] || LANDING_TYPES.calendar;
};

// Fonction pour obtenir tous les types de landing disponibles
export const getAvailableLandingTypes = () => {
  return Object.keys(LANDING_TYPES);
};
