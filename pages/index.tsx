import Head from "next/head";
import localFont from "next/font/local";
import SiseContainer from "@/components/SiseContainer";
import { Footer } from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Tableau de bord Sise</title>
        <meta name="description" content="Tableau de bord effectifs sise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <SiseContainer />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
