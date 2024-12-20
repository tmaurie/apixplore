import React from "react"

import CategoryCard from "@/components/cateogry-card"

export default function Page() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Browse categories
      </h1>
      <div>
        <CategoryCard />
      </div>
    </section>
  )
}
