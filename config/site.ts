export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Apixplore",
  description:
    "Get inspired by the world's best APIs. Discover new APIs, learn how to use them, and build amazing projects.",
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
