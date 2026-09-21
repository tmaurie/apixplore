import "@/app/globals.css"
import React from "react"
import { Metadata } from "next"
import NextTopLoader from "nextjs-toploader"

import { siteConfig } from "@/config/site"
import { fontMono, fontSans } from "@/lib/fonts"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Providers } from "@/app/providers/providers"

export const metadata: Metadata = {
  // Required so the /idea/[id] OpenGraph image resolves to an absolute URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <NextTopLoader
          color="oklch(0.64 0.19 41)"
          height={2}
          showSpinner={false}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
