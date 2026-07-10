"use client"

import { siteConfig } from "@/config/site"
import AuthButton from "@/components/auth-button"
import { MainNav } from "@/components/main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-end gap-3 px-6 sm:px-8">
        <MainNav items={siteConfig.mainNav} />
        <div className="ml-auto hidden shrink-0 pb-2.5 md:block">
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
