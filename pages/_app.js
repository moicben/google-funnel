import '../src/styles/globals/globals.css';
import '../src/styles/globals/components.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;