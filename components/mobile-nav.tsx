"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, FolderOpen, Grid3x3, Heart, LayoutDashboard, LogIn, LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

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

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const [quota, setQuota] = useState<{ used: number; limit: number }>({
    used: 0,
    limit: 30,
  })

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await fetch("/api/quota")
      const data = await res.json()
      setQuota(data)
    }
    if (session) fetchQuota()
  }, [session])

  const navItems = [
    { href: "/public", icon: <Compass size={20} />, label: "Explore" },
    { href: "/categories", icon: <Grid3x3 size={20} />, label: "Categories" },
    { href: "/resources", icon: <FolderOpen size={20} />, label: "Resources" },
    isLoggedIn
      ? {
          href: "#",
          icon: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={session.user?.image} alt="User Avatar" />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">
                  {session.user?.name ?? "User"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer w-full flex items-center justify-between text-sm font-medium">
                  <Link href="/history">Dashboard <LayoutDashboard className="ml-2 h-4 w-4" /></Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  Remaining: {quota.limit - quota.used}/{quota.limit}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/likes" className="w-full flex items-center justify-between text-sm font-medium">
                    Liked Ideas <Heart className="ml-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <span className="w-full flex items-center justify-between text-sm font-medium">
                    Logout <LogOut className="ml-2 h-4 w-4" />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          label: "Profile",
        }
      : {
          href: "#",
          icon: <LogIn size={20} />,
          label: "Login",
          onClick: () => signIn("github"),
        },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-md md:hidden">
      <ul className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.label}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition"
                >
                  {item.icon}
                  <span className="text-[11px] mt-1">{item.label}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center text-xs text-muted-foreground hover:text-foreground transition",
                    isActive &&
                      "text-primary font-semibold relative after:absolute after:-bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-primary after:content-['']"
                  )}
                >
                  {item.icon}
                  <span className="text-[11px] mt-1">{item.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
