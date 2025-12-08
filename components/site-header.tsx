"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"
import AuthButton from "@/components/auth-button"
import { DynamicIcon } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#040615cc] backdrop-blur-3xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center gap-2">

          <div className="hidden md:block">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  )
}
