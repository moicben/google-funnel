import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Meta tags généraux */}
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#4285f4" />
        <meta name="author" content="Google Calendar" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Google Calendar" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
