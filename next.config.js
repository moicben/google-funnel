// Importer la configuration des chemins
const { BASE_PATH, LANDING_TYPES } = require('./config/paths');

module.exports = {
  reactStrictMode: true,
  
  async rewrites() {
    const rewrites = [];
    
    // Générer les règles pour chaque type de landing
    Object.keys(LANDING_TYPES).forEach(landingType => {
      const config = LANDING_TYPES[landingType];
      
      // Route pour landing page avec campagne
      rewrites.push({
        source: `${config.basePath}/booking/:campaign`,
        destination: `/landings/${landingType}?campaign=:campaign`,
      });
      
      // Route pour landing page sans campagne
      rewrites.push({
        source: `${config.basePath}/booking`,
        destination: `/landings/${landingType}`,
      });


    });
    
    return [
      // Routes spécifiques pour les landing pages
      ...rewrites,
      
      // Route spécifique pour post
      {
        source: '/post/ma-reco-2025',
        destination: '/landings/post',
      },
      
      // Routes legacy pour compatibilité
      // Page d'accueil (home)
      {
        source: `${BASE_PATH}/agenda`,
        destination: '/',
      },


      
      // Page d'accueil avec paramètre de campagne (legacy)
      {
        source: `${BASE_PATH}/booking/:campaign`,
        destination: '/?campaign=:campaign',
      },
      // Toutes les autres pages sans paramètres
      {
        source: `${BASE_PATH}/:page`,
        destination: '/:page',
      },
      // Toutes les autres pages avec paramètre de campagne
      {
        source: `${BASE_PATH}/:page/:campaign`,
        destination: '/:page?campaign=:campaign',
      },
    ];
  },
};