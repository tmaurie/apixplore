"use client"

import { LogIn, LogOut } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (!session) {
    return (
      <Button variant="ghost" size="sm" onClick={() => signIn("github")}>
        <LogIn className="mr-2 h-4 w-4" /> Login with GitHub
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7">
        <AvatarImage src={session.user?.image} alt="User Avatar" />
        <AvatarFallback>
          {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">
        {session.user?.name || session.user?.email}
      </span>
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        <LogOut className="mr-1 h-4 w-4" /> Logout
      </Button>
    </div>
  )
}
