import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import CanonicalUrl from './components/CanonicalUrl';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus AI Consulting - AI-Powered Business Solutions in 15 Minutes | Affordable Strategy Consulting",
  description: "Revolutionary AI-powered consulting platform delivering McKinsey-quality insights in just 15 minutes. Affordable, fast, and easy-to-use business strategy, digital transformation, and operational excellence solutions for modern enterprises.",
  keywords: "AI consulting, business strategy, digital transformation, operational excellence, McKinsey-quality insights, affordable consulting, business solutions, AI-powered consulting, strategy consulting, business intelligence",
  authors: [{ name: "Nexus AI Consulting Team" }],
  creator: "Nexus AI Consulting",
  publisher: "Nexus AI Consulting",
  openGraph: {
    title: "Nexus AI Consulting - AI-Powered Business Solutions",
    description: "Get McKinsey-quality insights in just 15 minutes with our AI-powered consulting platform.",
    url: "https://nexusaiconsulting.com",
    siteName: "Nexus AI Consulting",
    images: [
      {
        url: "https://nexusaiconsulting.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexus AI Consulting - AI-Powered Business Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus AI Consulting - AI-Powered Business Solutions",
    description: "Get McKinsey-quality insights in just 15 minutes with our AI-powered consulting platform.",
    images: ["https://nexusaiconsulting.com/twitter-image.jpg"],
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
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://nexusaiconsulting.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
          <link rel="alternate" type="application/rss+xml" title="Nexus AI Consulting RSS Feed" href="/api/rss" />
          <meta name="theme-color" content="#6D28D9" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <CanonicalUrl />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
