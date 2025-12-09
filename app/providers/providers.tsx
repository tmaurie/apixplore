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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.2),_transparent_55%)]" />
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.2),_transparent_60%)] blur-[140px]" />
            </div>
            <div className="relative z-10 flex min-h-screen flex-col">
              <Toaster richColors />
              <SiteHeader />
              <main className="flex-1 px-4 pb-20 pt-20 sm:px-6 lg:px-10">
                <div className="mx-auto w-full max-w-6xl">{children}</div>
              </main>
              <footer className="px-4 pb-10 pt-6 text-sm text-slate-200 sm:px-6 lg:px-10">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_25px_60px_rgba(10,10,45,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between md:text-left">
                  <p>
                    Built with ❤️ by{" "}
                    <a
                      href="https://github.com/tmaurie"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white hover:text-sky-300"
                    >
                      @tmaurie
                    </a>
                    .
                  </p>
                  <p>
                    Explore the code on{" "}
                    <a
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white hover:text-sky-300"
                    >
                      GitHub
                    </a>
                    .
                  </p>
                </div>
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
