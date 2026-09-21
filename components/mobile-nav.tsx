"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Compass,
  FolderOpen,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Icons keyed by route, so the labels themselves always come from siteConfig.
 * The bottom bar and the desktop nav can no longer drift apart.
 */
const iconByHref: Record<string, LucideIcon> = {
  "/": Home,
  "/resources": FolderOpen,
  "/public": Compass,
  "/history": LayoutDashboard,
}

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const [quota, setQuota] = useState<{ used: number; limit: number }>({
    used: 0,
    limit: 30,
  })

  useEffect(() => {
    if (!session) return
    let cancelled = false
    const fetchQuota = async () => {
      try {
        const res = await fetch("/api/quota")
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setQuota(data)
      } catch {
        // Quota is a nicety here; a failure should not break navigation.
      }
    }
    fetchQuota()
    return () => {
      cancelled = true
    }
  }, [session])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/10 bg-paper/95 backdrop-blur-sm md:hidden">
      <ul className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {siteConfig.mainNav.map((item) => {
          const Icon = iconByHref[item.href] ?? Compass
          const isActive = pathname === item.href
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-1 py-2 transition-colors duration-150",
                  isActive ? "text-ink" : "text-ink-soft"
                )}
              >
                <Icon size={19} strokeWidth={isActive ? 2.25 : 1.75} />
                <span
                  className={cn(
                    "text-[11px] leading-none",
                    isActive && "font-semibold"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          )
        })}

        <li className="flex-1">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full flex-col items-center gap-1 rounded-md px-1 py-2 text-ink-soft">
                <Avatar className="h-[19px] w-[19px]">
                  <AvatarImage src={session.user?.image ?? ""} alt="" />
                  <AvatarFallback className="text-[9px]">
                    {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] leading-none">Account</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-2 w-48">
                <DropdownMenuLabel className="text-xs">
                  {session.user?.name ?? "Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="font-mono text-xs">
                  {quota.limit - quota.used}/{quota.limit} ideas left today
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/likes" className="flex w-full justify-between">
                    Liked ideas <Heart className="ml-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <span className="flex w-full justify-between">
                    Sign out <LogOut className="ml-2 h-4 w-4" />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="flex w-full flex-col items-center gap-1 rounded-md px-1 py-2 text-ink-soft transition-colors duration-150 hover:text-ink"
            >
              <LogIn size={19} strokeWidth={1.75} />
              <span className="text-[11px] leading-none">Sign in</span>
            </button>
          )}
        </li>
      </ul>
    </nav>
  )
}
