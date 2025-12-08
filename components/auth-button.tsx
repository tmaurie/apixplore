"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, LayoutDashboard, LogIn, LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuotaBar } from "@/components/quota-bar"

export default function AuthButton() {
  const { data: session, status } = useSession()

  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await fetch("/api/quota")
      const data = await res.json()
      setUsed(data.used)
      setLimit(data.limit)
    }

    fetchQuota()
  }, [])

  if (status === "loading") return null

  if (!session) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signIn("github")}
        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 transition hover:text-white"
      >
        <LogIn className="mr-2 h-4 w-4" /> Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 shadow-[0_10px_25px_rgba(6,7,45,0.45)] backdrop-blur">
        <Avatar className="h-8 w-8 ring-2 ring-white/20">
          <AvatarImage src={session.user?.image ?? ""} alt="User Avatar" />
          <AvatarFallback>
            {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left text-xs uppercase tracking-[0.3em] text-white/70 md:block">
          <p>{session.user?.name || session.user?.email}</p>
          <p className="text-white/50">Workspace</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[14rem] border-white/10 bg-[#050816] text-white">
        <DropdownMenuLabel className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Quota
          </p>
          <QuotaBar used={used} limit={limit} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild>
          <Link
            href="/history"
            className="flex items-center justify-between text-sm font-medium"
          >
            Dashboard <LayoutDashboard className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/likes"
            className="flex items-center justify-between text-sm font-medium"
          >
            Liked Ideas <Heart className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="cursor-pointer text-red-200 hover:text-red-300"
          onClick={() => signOut()}
        >
          <span className="flex w-full items-center justify-between text-sm font-medium">
            Logout <LogOut className="h-4 w-4" />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
