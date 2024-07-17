"use client"
import { useEffect } from 'react';
import Head from 'next/head';

export default function AutocompletePage() {
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        await import('@vis.gl/react-google-maps/examples.css');
        // await import('@vis.gl/react-google-maps/website/static/scripts/examples.js');
        const { renderToDom } = await import('./autoComplete/app');
        renderToDom(document.querySelector('#app'));
      } catch (error) {
        console.error('Failed to load dependencies:', error);
      }
    };

    loadDependencies();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <title>Autocomplete Examples</title>
        <meta name="description" content="Autocomplete Examples" />
      </Head>
      <div id="app"></div>
    </>
  );
}