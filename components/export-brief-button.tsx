"use client"

import { FileDownIcon } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { buildProjectBriefMarkdown, slugify, ProjectBriefInput } from "@/lib/projectBrief"
import { Button } from "@/components/ui/button"

interface ExportBriefButtonProps extends ProjectBriefInput {
  ideaId?: string
  source: "idea_generator" | "history"
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ExportBriefButton({
  ideaId,
  source,
  variant = "outline",
  size = "sm",
  className,
  ...briefInput
}: ExportBriefButtonProps) {
  const handleExport = () => {
    const markdown = buildProjectBriefMarkdown(briefInput)
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${slugify(briefInput.title)}-brief.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    void trackEvent("brief_exported", { ideaId, source })
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
    >
      <FileDownIcon className="mr-1.5 h-3.5 w-3.5" />
      Export brief
    </Button>
  )
}
