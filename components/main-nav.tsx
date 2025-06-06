import * as React from "react"
import Link from "next/link"
import { Home } from "lucide-react"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { DynamicIcon } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <DynamicIcon name={"logo"} className="size-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <Link href="/" className="flex items-center space-x-2">
        <Home className="size-5 text-muted-foreground" />
      </Link>
      {items?.length ? (
        <nav className="hidden md:flex gap-6 items-center ">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-mono font-bold text-muted-foreground transition-colors hover:text-accent-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
