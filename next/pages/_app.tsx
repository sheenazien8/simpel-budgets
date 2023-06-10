import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Simpel Budget || Open source made with 🖤</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
