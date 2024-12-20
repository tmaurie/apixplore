"use client"

import React from "react"
import Link from "next/link"
import { Check, CircleOff, KeyRound, Lock, LockOpen } from "lucide-react"

import { Resource } from "@/types/resource"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ResourceCard = ({ resource }: { resource: Resource }) => {
  console.log(resource)
  return (
    <div>
      <Link href={resource?.Link} target="_blank">
        <Card className="w-[350px] border border-input p-2 transition-all duration-300 ease-in-out hover:border-accent-foreground hover:bg-accent hover:text-accent-foreground">
          <CardHeader>
            <CardTitle className="text-xl font-extrabold leading-tight">
              {resource?.API}
            </CardTitle>
            <CardDescription>{resource?.Description}</CardDescription>
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
