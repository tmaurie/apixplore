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
        className="mr-1 flex shrink-0 items-center gap-2.5 py-3"
      >
        <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded border-2 border-ink bg-amber font-mono text-[13px] font-bold text-paper">
          {"{ }"}
        </span>
        <span className="whitespace-nowrap font-mono text-[15px] font-bold tracking-[0.15em]">
          {siteConfig.name.toUpperCase()}
        </span>
      </Link>

      {items?.length ? (
        <nav className="flex min-w-0 flex-1 items-end gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => {
            if (!item.href) return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative top-px shrink-0 whitespace-nowrap rounded-t-md border border-b-0 border-transparent px-4.5 py-3 font-mono text-xs font-semibold tracking-[0.12em] uppercase transition-colors",
                  isActive
                    ? "border-ink/20 bg-paper text-ink"
                    : "text-ink-soft hover:text-ink",
                  item.disabled && "pointer-events-none opacity-50"
                )}
              >
                {String(index + 1).padStart(2, "0")} · {item.title}
              </Link>
            )
          })}
        </nav>
      ) : null}
    </>
  )
}
