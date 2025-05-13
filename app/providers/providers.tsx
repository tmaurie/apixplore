"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="relative flex min-h-screen flex-col">
          <Toaster richColors />
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
          <MobileNav />
        </div>
        <TailwindIndicator />
      </ThemeProvider>
    </SessionProvider>
  )
}
