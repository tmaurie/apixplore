import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { DynamicIcon } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}

const baseLinkStyle =
  "relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all"

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,5,35,0.4)] backdrop-blur"
      >
        <DynamicIcon name="logo" className="size-5" />
        <span className="tracking-[0.25em]">{siteConfig.name}</span>
      </Link>
      <Link
        href="/"
        className={cn(
          baseLinkStyle,
          pathname === "/"
            ? "border border-white/25 bg-white/10 text-white"
            : "text-white/60 hover:text-white"
        )}
      >
        <Home className="size-4" />
        Home
      </Link>
      {items?.length ? (
        <nav className="hidden items-center gap-3 md:flex">
          {items.map((item) => {
            if (!item.href) return null
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  baseLinkStyle,
                  "border border-white/10 bg-white/[0.03]",
                  isActive
                    ? "text-white shadow-[0_8px_25px_rgba(8,7,45,0.4)]"
                    : "text-white/60 hover:text-white",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <span>{item.title}</span>
                {isActive && (
                  <span className="absolute inset-0 rounded-full border border-white/30" />
                )}
              </Link>
            )
          })}
        </nav>
      ) : null}
    </div>
  )
}
