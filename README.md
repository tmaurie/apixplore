# 🌐 APIxplore

**APIxplore** is a clean and modern web app for discovering public APIs, organized by categories and filterable by core features.

## ✨ Features

* 🔍 Browse APIs by category
* 🎛 Filter by:
`HTTPS support` `CORS support` `Required authentication`
* 🧼 Fully responsive UI built with Tailwind CSS v4 + Shadcn UI
* 💫 Smooth appearance animations (Framer Motion)
* 🌙 Dark mode ready
* 🧠 AI-generated side project ideas from any API

## 🛠 Tech Stack

* [Next.js 15 (App Router)](https://nextjs.org/)
* [Tailwind CSS v4](https://tailwindcss.com/)
* [Shadcn UI](https://ui.shadcn.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [OpenAI](https://openai.com/) (for AI project idea generation)

## 📂 Project structure

```txt
app/
  categories/[category]/page.tsx   # Category-specific resource page
components/
  category-card-item.tsx           # Individual category UI
  enhanced-resource-card.tsx      # Resource UI card
lib/
  fetchResources.ts                # Data fetching abstraction
```

## 🚀 Getting started

```bash
pnpm install
pnpm dev
```


## 🧩 Upcoming

* AI project idea generator (based on Spring AI)
* Global search bar for all APIs
* API detail pages
* CSV / JSON export of filtered results

---


Feel free to contribute or fork the project. Open source on [GitHub](https://github.com/tmaurie/apixplore).
