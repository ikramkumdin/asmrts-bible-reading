import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TrackingProvider } from "@/contexts/TrackingContext";
import { ToastProvider } from "@/components/ToastProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASMR Audio Bible | Immersive & Relaxing Scripture Experience",
  description: "Experience the Bible like never before with our soothing ASMR Audio Bible. Relax, meditate and connect with scripture through immersive audio journeys. Perfect for stress relief, sleep, and spiritual growth.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WhisperWord',
  },
  manifest: '/manifest.json',
  keywords: "ASMR Bible, Audio Bible, Relaxing Bible, Soothing Scripture, Christian Meditation, Bible Audio, ASMR Scripture, Calming Bible, Bible Study, Spiritual Growth, Meditation, Sleep, Stress Relief, Christian Audio, Scripture Reading, Bible Listening, ASMR Christian, Relaxing Scripture, Bible Meditation, Christian ASMR, Bible Sleep, Bible Stress Relief",
  authors: [{ name: "ASMR Audio Bible Team" }],
  creator: "ASMR Audio Bible",
  publisher: "ASMR Audio Bible",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.asmrbible.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ASMR Audio Bible | Immersive & Relaxing Scripture Experience",
    description: "Experience the Bible like never before with our soothing ASMR Audio Bible. Relax, meditate and connect with scripture through immersive audio journeys.",
    url: 'https://www.asmrbible.app',
    siteName: 'ASMR Audio Bible',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ASMR Audio Bible - Relaxing Scripture Experience',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ASMR Audio Bible | Immersive & Relaxing Scripture Experience",
    description: "Experience the Bible like never before with our soothing ASMR Audio Bible. Relax, meditate and connect with scripture through immersive audio journeys.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get Firebase Measurement ID (which is also Google Analytics 4 ID)
  const gaMeasurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID || gaMeasurementId;

  return (
    <html lang="en">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9cb4a9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WhisperWord" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Google Analytics 4 (via Firebase Analytics) */}
        {gaMeasurementId && gaMeasurementId.startsWith('G-') && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        
        {/* Additional Google Analytics if separate tracking ID is provided */}
        {gaTrackingId && gaTrackingId !== gaMeasurementId && gaTrackingId.startsWith('G-') && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-secondary" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`} suppressHydrationWarning={true}>
        <AuthProvider>
          <TrackingProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TrackingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
