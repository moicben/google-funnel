import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les états de chargement
 * Simplifie la gestion des loaders dans les composants
 */
const useLoader = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('Chargement...');
  const [error, setError] = useState(null);

  /**
   * Démarre le chargement avec un texte optionnel
   * @param {string} text - Texte de chargement
   */
  const startLoading = (text = 'Chargement...') => {
    setIsLoading(true);
    setLoadingText(text);
    setError(null);
  };

  /**
   * Arrête le chargement
   */
  const stopLoading = () => {
    setIsLoading(false);
  };

  /**
   * Arrête le chargement avec une erreur
   * @param {string|Error} errorMessage - Message d'erreur
   */
  const stopWithError = (errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
  };

  /**
   * Exécute une fonction asynchrone avec gestion du loader
   * @param {Function} asyncFn - Fonction asynchrone à exécuter
   * @param {string} loadingText - Texte pendant le chargement
   * @returns {Promise<any>} - Résultat de la fonction
   */
  const executeWithLoader = async (asyncFn, loadingText = 'Chargement...') => {
    try {
      startLoading(loadingText);
      const result = await asyncFn();
      stopLoading();
      return result;
    } catch (error) {
      stopWithError(error);
      throw error;
    }
  };

  /**
   * Remet à zéro l'état du loader
   */
  const resetLoader = () => {
    setIsLoading(false);
    setLoadingText('Chargement...');
    setError(null);
  };

  return {
    isLoading,
    loadingText,
    error,
    startLoading,
    stopLoading,
    stopWithError,
    executeWithLoader,
    resetLoader
  };
};

export default useLoader;