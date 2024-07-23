import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Ubuntu:700&subset=latin,latin-ext"
          rel="stylesheet"
        />
      </Head> 
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}