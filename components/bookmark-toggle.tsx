import { useState } from "react"
import { BookmarkIcon, Loader2Icon } from "lucide-react"

export function BookmarkToggle({
  isSaved,
  idea,
  index,
  onSave,
  onRemove,
}: {
  isSaved: boolean
  idea: any
  index: number
  onSave: () => Promise<void>
  onRemove: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)

    try {
      if (isSaved) {
        await onRemove()
      } else {
        await onSave()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className={`cursor-pointer absolute top-2 right-2 p-1 transition-all duration-200 rounded-full ${
        loading ? "opacity-70" : "hover:scale-110"
      }`}
      title={isSaved ? "Remove from saved" : "Save idea"}
    >
      {loading ? (
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <BookmarkIcon
          className={`h-5 w-5 transition-transform ${
            isSaved
              ? "fill-current text-primary drop-shadow-[0_0_4px_rgba(0,160,255,0.4)] scale-110"
              : "text-muted-foreground"
          }`}
        />
      )}
    </button>
  )
}
