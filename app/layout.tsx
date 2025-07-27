import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LiveChat } from "@/components/live-chat"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHAREINFO - Smart NFC Business Cards",
  description: "Professional NFC business cards for modern networking",
  keywords: "NFC, business cards, digital cards, networking, Bangladesh",
  authors: [{ name: "SHAREINFO" }],
  creator: "SHAREINFO",
  publisher: "SHAREINFO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://shareinfo.bd"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SHAREINFO - Smart NFC Business Cards",
    description: "Professional NFC business cards for modern networking",
    url: "https://shareinfo.bd",
    siteName: "SHAREINFO",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SHAREINFO NFC Cards",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHAREINFO - Smart NFC Business Cards",
    description: "Professional NFC business cards for modern networking",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" dir="ltr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SHAREINFO" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <PerformanceOptimizer />
        {children}
        <LiveChat />
      </body>
    </html>
  )
}
