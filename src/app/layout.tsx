import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { TrackingProvider } from "@/contexts/TrackingContext";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASMR Audio Bible | Immersive & Relaxing Scripture Experience",
  description: "Experience the Bible like never before with our soothing ASMR Audio Bible. Relax, meditate and connect with scripture through immersive audio journeys. Perfect for stress relief, sleep, and spiritual growth.",
  keywords: "ASMR Bible, Audio Bible, Relaxing Bible, Soothing Scripture, Christian Meditation, Bible Audio, ASMR Scripture, Calming Bible, Bible Study, Spiritual Growth, Meditation, Sleep, Stress Relief, Christian Audio, Scripture Reading, Bible Listening, ASMR Christian, Relaxing Scripture, Bible Meditation, Christian ASMR, Bible Sleep, Bible Stress Relief",
  authors: [{ name: "ASMR Audio Bible Team" }],
  creator: "ASMR Audio Bible",
  publisher: "ASMR Audio Bible",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://asmraudiobible.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ASMR Audio Bible | Immersive & Relaxing Scripture Experience",
    description: "Experience the Bible like never before with our soothing ASMR Audio Bible. Relax, meditate and connect with scripture through immersive audio journeys.",
    url: 'https://asmraudiobible.com',
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
  return (
    <html lang="en">
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
