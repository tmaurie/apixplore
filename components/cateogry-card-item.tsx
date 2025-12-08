import Link from "next/link"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DynamicIcon } from "@/components/icons"

interface Props {
  name: string
  slug: string
  count: number
  viewMode: "grid" | "list"
  index?: number
}

export function CategoryCardItem({
  name,
  slug,
  count,
  viewMode,
  index = 0,
}: Props) {
  return (
    <Link
      href={`/categories/${slug}`}
      className={viewMode === "grid" ? "" : "block w-full"}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: index * 0.05,
        }}
      >
        <Card
          className={`h-full rounded-3xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:shadow-[0_25px_60px_rgba(8,7,45,0.35)] ${
            viewMode === "grid" ? "hover:scale-[1.02]" : ""
          }`}
        >
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <DynamicIcon name={slug} className="size-6" />
              <CardTitle className="text-lg font-bold leading-tight">
                {name}
              </CardTitle>
            </div>
            <CardDescription className="text-white/70">
              Discover APIs related to {name.toLowerCase()}.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center justify-between">
            <Badge className="border-white/15 bg-white/10 text-xs text-white">
              {count} resources
            </Badge>
            <span className="text-sm font-semibold text-white/70">
              Browse {"->"}
            </span>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
