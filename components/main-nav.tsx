"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <>
      <Link
        href="/"
        className="mr-8 flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-amber font-mono text-[12px] font-bold text-paper">
          {"{ }"}
        </span>
        <span className="whitespace-nowrap font-mono text-[15px] font-bold tracking-[0.15em]">
          {siteConfig.name.toUpperCase()}
        </span>
      </Link>

      {/* Desktop only. Below md the fixed bottom bar in mobile-nav.tsx takes
          over, so this strip can no longer clip mid-label on a phone. */}
      {items?.length ? (
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            if (!item.href) return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-paper-dim hover:text-ink",
                  item.disabled && "pointer-events-none opacity-50"
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>
      ) : null}
    </>
  )
}
