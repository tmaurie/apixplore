<div align="center">

# 🌐 APIxplore

**Discover public APIs, spin up AI-generated project ideas, and save the ones worth building.**

[![License: MIT](https://shieldcn.dev/github/tmaurie/apixplore/license.svg)](LICENSE)
[![Stars](https://shieldcn.dev/github/tmaurie/apixplore/stars.svg)](https://github.com/tmaurie/apixplore/stargazers)
![Next.js](https://shieldcn.dev/badge/Next.js-16-black.svg?logo=nextdotjs&logoColor=white)
![TypeScript](https://shieldcn.dev/badge/TypeScript-5-3178C6.svg?logo=typescript&logoColor=white)
![Tailwind CSS](https://shieldcn.dev/badge/Tailwind_CSS-4-06B6D4.svg?logo=tailwindcss&logoColor=white)
![Neon](https://shieldcn.dev/badge/Database-Neon-00E599.svg?logo=postgresql&logoColor=white)
![OpenAI](https://shieldcn.dev/badge/AI-OpenAI-412991.svg?logo=openai&logoColor=white)
![PRs Welcome](https://shieldcn.dev/badge/PRs-welcome-brightgreen.svg)

</div>

---

## ✨ Features

* 🔍 **Browse public APIs** by category, with fuzzy search (name + description) and filters on core features
* 🧠 **AI-generated project ideas** tailored to your skill level, stack focus, and tone
* 💾 **Save & organize** the ideas you like into a personal history
* ❤️ **Like and share** ideas publicly, or browse the community feed
* 🧼 Clean, minimal UI — Tailwind CSS v4 + Shadcn UI
* 💫 Smooth animations with Framer Motion
* 📱 Fully responsive, with a mobile bottom navigation
* 🌙 Dark mode ready
* 📊 Daily quota system with progress tracking
* 👤 GitHub authentication (NextAuth)
* 🧾 Pagination for large datasets (1500+ APIs)

## 🛠 Tech Stack

| Layer | Stack |
|---|---|
| Framework | [Next.js 16 (App Router)](https://nextjs.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| AI | [OpenAI](https://openai.com/) (idea generation) |
| Database | [Neon](https://neon.tech/) — serverless Postgres |
| Auth | [NextAuth](https://next-auth.js.org/) — GitHub OAuth |

## 📂 Project structure

```txt
app/
  api/ideas/                   # Idea generation + persistence API
  api/quota/                   # Quota tracking
  resources/page.tsx           # Paginated resources list
  dashboard/page.tsx           # User's saved ideas
components/
  idea-generator.tsx           # Idea generation UI
  ideas-history.tsx            # Saved ideas display
  mobile-nav.tsx               # Bottom navigation with dropdown menu
  landing-page.tsx             # Elegant animated hero section
lib/
  db/                          # DB interaction helpers (Neon/Postgres)
  auth.ts                      # Auth configuration (NextAuth)
```

## 🚀 Getting started

```bash
npm install
npm run dev
```

### Environment variables

Create a `.env.local` at the project root:

```bash
# GitHub OAuth (NextAuth)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=

# Neon (Postgres)
DATABASE_URL=
```

## 🔮 Upcoming

* 📁 Export filtered APIs to CSV / JSON

---

<div align="center">

Feel free to contribute or fork the project.
💜 Open source on [GitHub](https://github.com/tmaurie/apixplore)

</div>
