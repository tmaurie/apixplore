"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LogIn, LogOut } from "lucide-react"
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
      <Button variant="ghost" size="sm" onClick={() => signIn("github")}>
        <LogIn className="mr-2 h-4 w-4" /> Login with GitHub
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4 md:px-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.user?.image} alt="User Avatar" />
            <AvatarFallback>
              {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline-flex">
            {session.user?.name || session.user?.email}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <QuotaBar used={used} limit={limit} />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/history" className="w-full">
              Dashboard
            </Link>
          </DropdownMenuItem>
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
    </div>
  )
}
