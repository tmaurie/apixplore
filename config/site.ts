export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Categories",
      href: "/categories",
    },
  ],
  links: {
    github: "https://github.com/tmaurie/apixplore",
    docs: "https://ui.shadcn.com",
  },
}
