"use client"

import { useEffect, useState } from "react"
import { CheckIcon, CopyIcon, Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { trackEvent } from "@/lib/analytics"
import { Button } from "@/components/ui/button"

interface ShareIdeaButtonProps {
  ideaId: string
  title: string
  source: "history" | "user_hub" | "public_feed" | "public_page"
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ShareIdeaButton({
  ideaId,
  title,
  source,
  variant = "outline",
  size = "sm",
  className,
}: ShareIdeaButtonProps) {
  const [copied, setCopied] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    setHasNativeShare(typeof navigator !== "undefined" && !!navigator.share)
  }, [])

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/idea/${ideaId}`
    const shareData = {
      title: `${title} - APIxplore`,
      text: `Check out this API project idea on APIxplore: ${title}`,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
        toast.success("Public link copied to clipboard.")
      } else {
        throw new Error("Clipboard unavailable")
      }

      void trackEvent("share_clicked", {
        ideaId,
        source,
      })
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return
      }

      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
        toast.success("Public link copied to clipboard.")
        void trackEvent("share_clicked", {
          ideaId,
          source,
          fallback: true,
        })
      } catch {
        toast.error("Unable to share this idea right now.")
      }
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
    >
      {copied ? (
        <>
          <CheckIcon className="mr-2 h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          {hasNativeShare ? (
            <Share2Icon className="mr-2 h-4 w-4" />
          ) : (
            <CopyIcon className="mr-2 h-4 w-4" />
          )}
          Share
        </>
      )}
    </Button>
  )
}
