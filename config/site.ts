export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Apixplore",
  description:
    "Get inspired by the world's best APIs. Discover new APIs, learn how to use them, and build amazing projects.",
  mainNav: [
    {
      title: "Categories",
      href: "/categories",
    },
    {
      title: "Resources",
      href: "/resources",
    },
    {
      title: "Explore",
      href: "/public",
    },
  ],
  links: {
    github: "https://github.com/tmaurie/apixplore",
    categories: "/categories",
  },
}
