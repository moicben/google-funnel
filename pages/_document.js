import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Favicon et icônes */}
        <link rel="icon" href="/calendar-favicon.ico" />
        <link rel="shortcut icon" href="/calendar-favicon.ico" />
        <link rel="apple-touch-icon" href="/calendar-favicon.ico" />
        
        {/* Meta tags généraux */}
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#4285f4" />
        <meta name="author" content="Agenda Funnel" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Agenda Funnel" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Préchargement du favicon */}
        <link rel="preload" href="/calendar-favicon.ico" as="image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
