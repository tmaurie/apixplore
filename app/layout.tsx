import "@/styles/globals.css"
import React from "react"
import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="container flex-1 px-4 pb-12 pt-6 md:px-6">
              {children}
            </main>
            <footer className="border-t border-t-muted-foreground/10 py-6 text-center text-sm text-muted-foreground dark:text-muted-foreground/80">
              Built with ❤️ by{" "}
              <a href="https://github.com/tmaurie" className="ml-1 underline">
                @tmaurie
              </a>
              . Open source on{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                className="underline"
              >
                GitHub
              </a>
              .
            </footer>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
