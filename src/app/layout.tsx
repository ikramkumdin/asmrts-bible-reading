import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASMR Bible Reading - Relaxing Bible Study",
  description: "Experience the Bible through relaxing ASMR narration. Choose your favorite reader and immerse yourself in God's Word with soothing audio.",
  keywords: "ASMR, Bible, Christian, relaxation, audio, meditation, scripture",
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
