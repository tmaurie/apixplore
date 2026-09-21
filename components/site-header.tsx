"use client"

import { siteConfig } from "@/config/site"
import AuthButton from "@/components/auth-button"
import { MainNav } from "@/components/main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4 sm:px-8">
        <MainNav items={siteConfig.mainNav} />
        <div className="ml-auto hidden shrink-0 md:block">
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
