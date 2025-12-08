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
} from "lucide-react"
import { useSession } from "next-auth/react"

import { Resource } from "@/types/resource"
import { cn } from "@/lib/utils"
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
      <Card className="w-full rounded-3xl border border-white/10 bg-white/5 text-white shadow-[0_20px_60px_rgba(9,10,44,0.35)] transition hover:border-white/40">
        <CardHeader className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              {resource.API}
            </CardTitle>
            {showCategory && (
              <Badge
                variant="outline"
                className="font-mono border-white/30 text-white/80"
              >
                {resource.Category}
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm text-white/70">
            {resource.Description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <Badge
              variant={resource.Auth ? "default" : "outline"}
              className={cn(
                resource.Auth ? "bg-white/20 text-white" : "border-white/40 text-white/80"
              )}
            >
              <KeyRound className="mr-1 size-4" />
              {resource.Auth || "No Auth"}
            </Badge>
            <Badge
              variant={resource.HTTPS ? "default" : "outline"}
              className={cn(
                resource.HTTPS ? "bg-white/20 text-white" : "border-white/40 text-white/80"
              )}
            >
              {resource.HTTPS ? (
                <Lock className="mr-1 size-4" />
              ) : (
                <LockOpen className="mr-1 size-4" />
              )}
              {resource.HTTPS ? "HTTPS" : "No HTTPS"}
            </Badge>
            <Badge
              variant={resource.Cors === "yes" ? "default" : "outline"}
              className={cn(
                resource.Cors === "yes"
                  ? "bg-white/20 text-white"
                  : "border-white/40 text-white/80"
              )}
            >
              {resource.Cors === "yes" ? (
                <Check className="mr-1 size-4" />
              ) : (
                <CircleOff className="mr-1 size-4" />
              )}
              {resource.Cors === "yes" ? "CORS" : "No CORS"}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/80 hover:text-white"
          >
            <Link href={resource.Link} target="_blank">
              View API <ExternalLink className="ml-1 size-4" />
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
