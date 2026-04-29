import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Karsa Kafe Padang - Ruang Inspirasi di Air Tawar",
  description: "Karsa Kafe Padang - Tempat nongkrong dan nugas mahasiswa di Air Tawar Barat. Kopi, makanan, dan suasana nyaman.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2c1a12",
};

import NotificationHub from "@/components/NotificationHub";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfairDisplay.variable} ${inter.variable}`}
    >
      <body className="bg-cream-50 text-stone-800 min-h-screen">
        <div className="scanning-line"></div>
        <NotificationHub />
        {children}
      </body>
    </html>
  );
}
