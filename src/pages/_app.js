"use client";
import '@/styles/globals.css'
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <div suppressHydrationWarning={true}>
      {typeof window !== undefined && (
        <>
          {" "}
          <Script
            src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"
            type="text/javascript"
          ></Script>
          <Component {...pageProps} />
        </>
      )}
    </div>
  );
}
