import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ConfirmProvider } from "@/packages/confirm/core/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <title>Simpel Budget || Open source made with 🖤</title>
      </Head>
      <ConfirmProvider>
        <Component {...pageProps} />
      </ConfirmProvider>
    </div>
  );
}
