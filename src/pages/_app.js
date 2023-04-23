'use client';
// import '@/styles/globals.css'


export default function App({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning={true}>
      {typeof window !== undefined && <Component {...pageProps} />}
    </div>
  );
}
