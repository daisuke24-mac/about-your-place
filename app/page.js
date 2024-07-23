"use client"
import { useEffect } from 'react';
import Head from 'next/head';

export default function TopPage() {
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        await import('@vis.gl/react-google-maps/examples.css');
        const { renderToDom } = await import('./components/mapComponent');
        renderToDom(document.querySelector('#homepage'));
      } catch (error) {
        console.error('Failed to load dependencies:', error);
      }
    };

    loadDependencies();
  }, []);

  return (
    <>
      <Head>
        <title>About Your Place</title>
      </Head>
      <div id="homepage"></div>
    </>
  );
}