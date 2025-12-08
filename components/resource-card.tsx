"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Check,
  CircleOff,
  ExternalLink,
  KeyRound,
  Lock,
  LockOpen,
  Sparkles,
} from "lucide-react"
import { useSession } from "next-auth/react"

import { Resource } from "@/types/resource"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import IdeaGenerator from "@/components/idea-generator"





export function ResourceCard({
  resource,
  index,
  showCategory,
}: {
  resource: Resource
  index: number
  showCategory?: boolean
}) {
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: index * 0.04,
      }}
    >
      <Card className="group relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-black/40 text-white shadow-[0_35px_80px_rgba(5,5,35,0.65)] backdrop-blur transition hover:-translate-y-1 hover:border-white/40">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-transparent to-purple-500/20" />
        </div>
        <CardHeader className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/50">
                <Sparkles className="h-3 w-3" />
                API
              </span>
              <CardTitle className="mt-3 text-xl font-semibold text-white">
                {resource.API}
              </CardTitle>
            </div>
            {showCategory && (
              <Badge
                variant="outline"
                className="font-mono border-white/30 bg-white/5 text-white/80"
              >
                {resource.Category}
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm text-white/70">
            {resource.Description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-[0.2em] text-white/60 sm:grid-cols-3">
            <div className="space-y-1">
              <p>Auth</p>
              <span className="text-sm font-semibold text-white">
                {resource.Auth || "None"}
              </span>
            </div>
            <div className="space-y-1">
              <p>HTTPS</p>
              <span className="text-sm font-semibold text-white">
                {resource.HTTPS ? "Supported" : "Not supported"}
              </span>
            </div>
            <div className="space-y-1">
              <p>CORS</p>
              <span className="text-sm font-semibold text-white">
                {resource.Cors}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            <Badge className="border-white/15 bg-white/10 text-white">
              <KeyRound className="mr-1 h-3 w-3" />
              {resource.Auth || "No Auth"}
            </Badge>
            <Badge className="border-white/15 bg-white/10 text-white">
              {resource.HTTPS ? (
                <Lock className="mr-1 h-3 w-3" />
              ) : (
                <LockOpen className="mr-1 h-3 w-3" />
              )}
              {resource.HTTPS ? "HTTPS" : "No HTTPS"}
            </Badge>
            <Badge className="border-white/15 bg-white/10 text-white">
              {resource.Cors === "yes" ? (
                <Check className="mr-1 h-3 w-3" />
              ) : (
                <CircleOff className="mr-1 h-3 w-3" />
              )}
              {resource.Cors === "yes" ? "CORS" : "No CORS"}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="relative flex items-center justify-between border-t border-white/10 pt-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/80 hover:text-white"
          >
            <Link href={resource.Link} target="_blank">
              View API <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          {isLoggedIn && (
            <IdeaGenerator
              api={resource.API}
              apiLink={resource.Link}
              description={resource.Description}
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
