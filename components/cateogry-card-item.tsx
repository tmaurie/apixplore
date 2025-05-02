import Link from "next/link"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DynamicIcon } from "@/components/icons"

interface Props {
  name: string
  slug: string
  count: number
  viewMode: "grid" | "list"
}

const CategoryCardItem = ({ name, slug, count, viewMode }: Props) => (
  <Link
    href={`/categories/${slug}`}
    className={viewMode === "grid" ? "" : "block w-full"}
  >
    <Card
      className={`h-full rounded-2xl border border-border transition-all duration-300 hover:border-muted-foreground hover:bg-muted hover:shadow-sm ${
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
    </Card>
  </Link>
)

export default CategoryCardItem
