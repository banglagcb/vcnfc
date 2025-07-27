import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LiveChat } from "@/components/live-chat"
import { ChatSystem } from "@/components/chat-system"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHAREINFO - NFC Smart Business Cards",
  description: "Your flexible friend NFC Cards. Digital business cards for modern professionals.",
  keywords: "NFC business cards, digital business cards, smart cards, networking, Bangladesh",
  authors: [{ name: "SHAREINFO" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#f97316",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <PerformanceOptimizer />
        {children}
        <LiveChat />
        <ChatSystem />
      </body>
    </html>
  )
}
