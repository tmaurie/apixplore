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
      <Card className="w-full rounded-2xl border border-border transition-all hover:border-muted-foreground hover:shadow-xs">
        <CardHeader className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {resource.API}
            </CardTitle>
            {showCategory && (
              <Badge variant="outline" className="font-mono">
                {resource.Category}
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {resource.Description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 font-mono">
            <Badge variant={resource.Auth ? "default" : "outline"}>
              <KeyRound className="mr-1 size-4" />
              {resource.Auth || "No Auth"}
            </Badge>
            <Badge variant={resource.HTTPS ? "default" : "outline"}>
              {resource.HTTPS ? (
                <Lock className="mr-1 size-4" />
              ) : (
                <LockOpen className="mr-1 size-4" />
              )}
              {resource.HTTPS ? "HTTPS" : "No HTTPS"}
            </Badge>
            <Badge variant={resource.Cors === "yes" ? "default" : "outline"}>
              {resource.Cors === "yes" ? (
                <Check className="mr-1 size-4" />
              ) : (
                <CircleOff className="mr-1 size-4" />
              )}
              {resource.Cors === "yes" ? "CORS" : "No CORS"}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href={resource.Link} target="_blank">
              View API <ExternalLink className="ml-1 size-4" />
            </Link>
          </Button>
          {isLoggedIn && (
            <IdeaGenerator
              api={resource.API}
              description={resource.Description}
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
