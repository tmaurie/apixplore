"use client"

import React from "react"
import Link from "next/link"
import {
  Check,
  CircleOff,
  KeyRound,
  Lock,
  LockOpen,
} from "lucide-react"

import { Resource } from "@/types/resource"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <div>
      <Link href={resource?.Link} target="_blank">
        <Card className="group w-[400px] border border-input p-2 transition-all duration-300 ease-in-out hover:scale-105 hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-extrabold leading-tight">
                {resource?.API}
              </CardTitle>
              <CardDescription>{resource?.Description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-start gap-3">
            <CardDescription>
              <span
                className={`flex gap-1 ${
                  resource?.Auth
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <KeyRound />
                {resource?.Auth || "No Auth"}
              </span>
            </CardDescription>
            <CardDescription>
              <span
                className={`flex gap-1 ${
                  resource?.HTTPS
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {resource?.HTTPS ? <Lock /> : <LockOpen />}
                {resource?.HTTPS ? "HTTPS" : "No HTTPS"}
              </span>
            </CardDescription>
            <CardDescription>
              <span
                className={`flex gap-1 ${
                  resource?.Cors === "yes"
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {resource?.Cors === "yes" ? <Check /> : <CircleOff />}
                {resource?.Cors === "yes" ? "CORS" : "No CORS"}
              </span>
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default ResourceCard
