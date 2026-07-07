"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogIn, LogOut, UserCircle } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (!session) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signIn("github")}
        className="rounded-md border border-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink hover:bg-ink hover:text-paper"
      >
        Sign in <LogIn className="ml-2 h-3.5 w-3.5" />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="ghost"
        className="flex items-center gap-3 rounded-md border border-ink/20 px-3 py-2 text-left hover:border-ink"
      >
        <Link href={`/user/${session.user?.id ?? ""}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-amber/30">
              <AvatarImage src={session.user?.image ?? ""} alt="User Avatar" />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() ?? (
                  <UserCircle className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left font-mono text-xs uppercase tracking-[0.2em] text-ink-soft sm:block">
              <p className="text-ink">
                {session.user?.name || session.user?.email}
              </p>
              <p>@{session.user?.githubUsername}</p>
            </div>
          </div>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-md border border-ink/20 text-ink hover:border-ink hover:bg-transparent"
        onClick={() => signOut()}
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
