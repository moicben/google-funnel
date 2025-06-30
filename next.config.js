// Importer la configuration des chemins
const { BASE_PATH } = require('./config/paths');

module.exports = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      // Page d'accueil (home)
      {
        source: `${BASE_PATH}/agenda`,
        destination: '/',
      },
      // Page d'accueil avec paramètre de campagne
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