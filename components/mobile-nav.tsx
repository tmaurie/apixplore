"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FolderOpen, Grid3x3, Home, LogIn } from "lucide-react"
import { signIn, useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const navItems = [
    { href: "/", icon: <Home size={20} />, label: "Home" },
    { href: "/categories", icon: <Grid3x3 size={20} />, label: "Categories" },
    { href: "/resources", icon: <FolderOpen size={20} />, label: "Resources" },
    isLoggedIn
      ? {
          href: "/history",
          icon: (
            <Avatar className="h-7 w-7">
              <AvatarImage src={session.user?.image} alt="User Avatar" />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
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
