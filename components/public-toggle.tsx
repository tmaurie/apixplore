"use client"

import { useState, useTransition } from "react"
import { GlobeIcon, LockIcon } from "lucide-react"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"

interface PublicToggleProps {
  ideaId: string
  initialValue: boolean
  onVisibilityChange?: (value: boolean) => void
}

export function PublicToggle({
  ideaId,
  initialValue,
  onVisibilityChange,
}: PublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialValue)
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    const newValue = !isPublic
    setIsPublic(newValue)

    startTransition(async () => {
      const res = await fetch(`/api/ideas/${ideaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: newValue }),
      })

      if (!res.ok) {
        setIsPublic(!newValue)
        toast.error("Error updating visibility")
      } else {
        onVisibilityChange?.(newValue)
        toast.success(`Idea is now ${newValue ? "Public 🌍" : "Private 🔒"}`)
      }
    })
  }

  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-paper/70">
      {isPublic ? (
        <>
          <GlobeIcon className="h-3.5 w-3.5 text-amber-soft" /> Public
        </>
      ) : (
        <>
          <LockIcon className="h-3.5 w-3.5" /> Private
        </>
      )}
      <Switch
        checked={isPublic}
        onCheckedChange={toggle}
        disabled={isPending}
        className="data-[state=checked]:bg-amber data-[state=unchecked]:bg-paper/20 [&>span]:bg-paper"
      />
    </div>
  )
}
