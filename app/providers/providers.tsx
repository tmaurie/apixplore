"use client"

import React, { useState } from "react"
import Link from "next/link"
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
          <div className="flex min-h-screen flex-col bg-paper text-ink">
            <Toaster richColors />
            <SiteHeader />

            <main className="flex-1 pt-6 md:pt-8">
              <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8">
                {children}
              </div>
            </main>

            <footer className="mt-20 border-t border-ink/10">
              <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-5 px-4 py-10 pb-28 sm:px-8 md:pb-10">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber font-mono text-[10px] font-bold text-paper">
                    {"{ }"}
                  </span>
                  <span className="font-mono text-xs font-bold tracking-[0.15em] text-ink-soft">
                    {siteConfig.name.toUpperCase()}
                  </span>
                </Link>

                <p className="text-sm text-ink-soft">
                  Open source, built by{" "}
                  <a
                    href="https://github.com/tmaurie"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-ink underline-offset-4 hover:underline"
                  >
                    @tmaurie
                  </a>
                  .{" "}
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-ink underline-offset-4 hover:underline"
                  >
                    Source on GitHub
                  </a>
                </p>
              </div>
            </footer>

            <MobileNav />
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}
