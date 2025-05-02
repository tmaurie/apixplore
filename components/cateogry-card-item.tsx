import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DynamicIcon } from "@/components/icons"
import { MagicCard } from "@/components/magicui/magic-card"

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
  const { theme } = useTheme()

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
          className={`h-full rounded-2xl border border-border transition-all duration-300 hover:border-muted-foreground hover:bg-muted hover:shadow-xs ${
            viewMode === "grid" ? "hover:scale-[1.02]" : ""
          }`}
        >
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <DynamicIcon name={slug} className="size-6" />
                <CardTitle className="text-lg font-bold leading-tight">
                  {name}
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Discover APIs related to {name.toLowerCase()}.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {count} resources
              </Badge>
              <span className="text-sm font-medium text-primary">Browse →</span>
            </CardFooter>
          </MagicCard>
        </Card>
      </motion.div>
    </Link>
  )
}
