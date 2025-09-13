import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../styles/globals.css";
import Providers from "./components/Providers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { config } from "@/lib/config";
import Script from "next/script";
import { AnalyticsTracker } from "@/lib/analyticsTracker";
import { Suspense } from "react";
import { DisableDevTools } from "@/lib/disableDevTools";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title:
    "Download, Nonton, dan Streaming Drama Korea, China Gratis - " +
    config.PROJECT_NAME,
  description:
    "Download, nonton, dan streaming drama Korea, China, Jepang, dan Asia lainnya secara gratis di " +
    config.PROJECT_NAME +
    ".",
  keywords: [
    "drama",
    "drama korea",
    "drama china",
    "drama jepang",
    "nonton drama",
    "nonton drama gratis",
    "nonton drama sub indo",
    "download drama",
    "download drama gratis",
    "download drama sub indo",
    "streaming drama",
    "streaming drama gratis",
    "streaming drama sub indo",
    "dramabox",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-night-900 text-white antialiased selection:bg-primary-600/30 font-body">
        <Providers>
          <Suspense fallback={null}>
            <AnalyticsTracker />
            <DisableDevTools />
          </Suspense>
          <Header />
          {children}
        </Providers>
        <Footer />
        <Script id="ga-setup" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
