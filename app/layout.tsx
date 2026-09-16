import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lokly",
  description: "Discover events across the Algarve",

  icons: {
    icon: "/icons/lokly-512.png",
    apple: "/icons/apple-touch-icon.png",
  },

  openGraph: {
    title: "Lokly",
    description: "Discover events across the Algarve",
    url: "https://www.lokly.live",
    siteName: "Lokly",
    images: [
      {
        url: "https://www.lokly.live/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Lokly - Discover events across the Algarve",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lokly",
    description: "Discover events across the Algarve",
    images: ["https://www.lokly.live/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.png"
        />
      </head>

      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}