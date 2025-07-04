import { useEffect } from 'react';
import Head from 'next/head';

/**
 * Hook personnalisé pour gérer les titres de page et meta descriptions
 * @param {string} title - Le titre de la page
 * @param {string} description - La description meta de la page
 * @param {Object} options - Options supplémentaires (keywords, ogImage, favicon, etc.)
 */
export const usePageMeta = (title, description, options = {}) => {
  const {
    keywords = '',
    ogImage = '',
    ogUrl = '',
    noIndex = false,
    favicon = '/calendar-favicon.ico'
  } = options;

  const fullTitle = title ? title : 'Google Workspace';

  return {
    title: fullTitle,
    description,
    keywords,
    ogImage,
    ogUrl,
    noIndex,
    favicon
  };
};

/**
 * Composant PageHead pour injecter facilement les meta données
 */
export const PageHead = ({ title, description, options = {} }) => {
  const meta = usePageMeta(title, description, options);
  
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      
      {/* Favicon personnalisé pour cette page */}
      <link rel="icon" href={meta.favicon} />
      <link rel="shortcut icon" href={meta.favicon} />
      <link rel="apple-touch-icon" href={meta.favicon} />
      
      {meta.keywords && (
        <meta name="keywords" content={meta.keywords} />
      )}
      
      {meta.noIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
      {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.ogImage && <meta name="twitter:image" content={meta.ogImage} />}
    </Head>
  );
};

export default usePageMeta;
