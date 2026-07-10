"use client"

import React, { useState } from "react"
import { QueryClient } from "@tanstack/query-core"
import { QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" forcedTheme="light">
          <div className="min-h-screen bg-paper text-ink">
            <div className="flex min-h-screen flex-col">
              <Toaster richColors />
              <SiteHeader />
              <main className="flex-1 pb-24 pt-10 md:pb-0">
                <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8">
                  {children}
                </div>
              </main>
              <footer className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-10 sm:px-8">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded border-2 border-ink font-mono text-[11px] font-bold">
                    {"{ }"}
                  </span>
                  <span className="font-mono text-xs tracking-[0.1em] text-ink-soft">
                    {siteConfig.name.toUpperCase()} — FIELD GUIDE
                  </span>
                </div>
                <p className="font-mono text-xs text-ink-soft">
                  Built by{" "}
                  <a
                    href="https://github.com/tmaurie"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-ink hover:text-amber"
                  >
                    @tmaurie
                  </a>{" "}
                  · Open source ·{" "}
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-ink hover:text-amber"
                  >
                    GitHub
                  </a>
                </p>
              </footer>
              <MobileNav />
            </div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
