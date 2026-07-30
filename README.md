# 🌐 APIxplore

**APIxplore** is a clean and elegant web app for discovering public APIs, generating side project ideas with AI, and saving your favorite inspirations.

## ✨ Features

* 🔍 Browse APIs by category and filter core features
* 🧠 Generate AI-powered project ideas from any public API
* 💾 Save the ideas you like to your personal history
* 🧼 Clean UI built with Tailwind CSS v4 + Shadcn UI
* 💫 Smooth animations with Framer Motion
* 📱 Fully responsive with mobile bottom navigation
* 🌙 Dark mode ready
* 📊 Daily quota system with progress tracking
* 👤 GitHub authentication (NextAuth)
* 🧾 Pagination for large datasets (1500+ APIs)

## 🛠 Tech Stack

* [Next.js 15 (App Router)](https://nextjs.org/)
* [Tailwind CSS v4](https://tailwindcss.com/)
* [Shadcn UI](https://ui.shadcn.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [OpenAI](https://openai.com/) – AI idea generation
* [Neon](https://neon.tech/) – serverless Postgres storage
* [NextAuth](https://next-auth.js.org/) – GitHub OAuth

## 📂 Project structure

```txt
app/
  api/ideas/                   # Idea generation + persistence API
  api/quota/                  # Quota tracking
  resources/page.tsx          # Paginated resources list
  dashboard/page.tsx          # User's saved ideas
components/
  idea-generator.tsx          # Idea generation UI
  ideas-history.tsx           # Saved ideas display
  mobile-nav.tsx              # Bottom navigation with dropdown menu
  landing-page.tsx            # Elegant animated hero section
lib/
  db/                          # DB interaction helpers (Neon/Postgres)
  auth.ts                     # Auth configuration (NextAuth)
```

## 🚀 Getting started

```bash
pnpm install
pnpm dev
```

## 🔮 Upcoming

* 🧩 Public/private toggle for saved ideas
* 🌍 Public idea sharing page `/idea/[id]`
* 🔎 Global fuzzy search for all APIs
* 📁 Export filtered APIs to CSV / JSON
* 💬 Community library of shared ideas

---

Feel free to contribute or fork the project.
💜 Open source on [GitHub](https://github.com/tmaurie/apixplore)
