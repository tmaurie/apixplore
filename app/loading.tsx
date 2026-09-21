import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeletal loader shaped like the page that follows, rather than a spinner.
 */
export default function Loading() {
  return (
    <div className="pt-4" aria-busy="true" aria-label="Loading">
      <div className="grid gap-12 pb-20 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-6 xl:col-span-5">
          <Skeleton className="h-11 w-full max-w-[26rem]" />
          <Skeleton className="h-11 w-full max-w-[18rem]" />
          <div className="space-y-2 pt-3">
            <Skeleton className="h-4 w-full max-w-[24rem]" />
            <Skeleton className="h-4 w-full max-w-[20rem]" />
          </div>
          <div className="flex gap-3 pt-3">
            <Skeleton className="h-11 w-44" />
            <Skeleton className="h-11 w-40" />
          </div>
        </div>
        <div className="lg:col-span-6 xl:col-span-7">
          <Skeleton className="aspect-[4/3] w-full" />
        </div>
      </div>
    </div>
  )
}
