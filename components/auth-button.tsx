"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogIn, LogOut, UserCircle } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="ghost"
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left shadow-[0_10px_25px_rgba(6,7,45,0.45)] backdrop-blur transition hover:border-white/40"
      >
        <Link href={`/user/${session.user?.id ?? ""}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-white/20">
              <AvatarImage src={session.user?.image ?? ""} alt="User Avatar" />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() ?? (
                  <UserCircle className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left text-xs uppercase tracking-[0.25em] text-white/70 sm:block">
              <p>{session.user?.name || session.user?.email}</p>
              <p className="text-white/50">@{session.user?.githubUsername}</p>
            </div>
          </div>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
        onClick={() => signOut()}
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
