import { Loader2Icon } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2Icon className="h-6 w-6 animate-spin text-ink-soft" />
    </div>
  )
}
