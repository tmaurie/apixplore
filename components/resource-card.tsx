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

import { Resource } from "@/types/resource"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ResourceCard = ({
  resource,
  index = 0,
}: {
  resource: Resource
  index?: number
}) => {
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
      <Card className="w-full rounded-2xl border border-border transition-all hover:border-muted-foreground hover:bg-muted hover:shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold leading-tight">
            {resource.API}
          </CardTitle>
          <CardDescription>{resource.Description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
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

          <div className="pt-2">
            <Button variant="link" size="sm" asChild>
              <Link href={resource.Link} target="_blank">
                View API <ExternalLink className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ResourceCard
