# 📋 Backlog

Suivi des chantiers identifiés pour APIxplore. Pas de sprint/priorité formelle — on coche au fil de l'eau.

Légende : `[ ]` à faire · `[~]` en cours · `[x]` fait

## 🎯 Métier / valeur ajoutée

- [x] Corriger la logique du quota — il compte les idées *sauvegardées*, pas les générations (appels OpenAI). Un utilisateur peut spammer `/api/ideas/generate` sans jamais toucher la limite. *(nouvelle table `idea_generations`, comptage sur les appels réels)*
- [ ] Régénérer / itérer sur une idée ("encore 3 idées" / "affine celle-ci") plutôt que de tout relancer depuis zéro
- [ ] Organisation de l'historique — tags/catégories/collections sur les idées sauvegardées (`ideas-history.tsx` est une liste plate aujourd'hui)
- [ ] Profils publics — `app/user/[id]` existe mais redirige si ce n'est pas soi-même ; ouvrir une vue publique (ses idées publiques)
- [ ] Exploiter les événements analytics — `/api/events` fait juste un `console.info`, rien n'est persisté ; stocker en base pour avoir une vraie vue sur les APIs/idées populaires
- [ ] Recherche floue globale sur le catalogue d'APIs (1500+ entrées)

## 🔧 Technique / chore

- [ ] Ajouter des tests (au minimum : logique de quota, parsing de `/api/ideas/generate`)
- [ ] Mettre en place une CI (`.github/workflows`) qui lance `lint` / `typecheck` / `build` sur les PRs
- [ ] Rate limiting / middleware sur les routes API (rien ne protège au-delà du quota, lui-même buggé)
- [x] Ajouter `error.tsx` / `not-found.tsx` / `loading.tsx` à l'App Router
- [ ] Nettoyer les métadonnées scaffold de `package.json` (nom `next-template`, version `0.0.2`)
- [ ] Réaligner les versions qui ont dérivé (TypeScript `^4.9.5`, ESLint 8 / `eslint-config-next` 15.3.1 vs Next 16 / React 19)
- [ ] Ajouter `sitemap.xml` / `robots.txt` (pénalise l'indexation de `/idea/[id]` et du catalogue)
- [ ] Réparer le script `npm run lint` — `next lint` n'est plus supporté sur Next 16, la commande échoue (`Invalid project directory`)

## 🎨 UI/UX

- [x] Open Graph image sur les pages d'idées publiques (`generateMetadata` a déjà title/description, pas d'image) *(`app/idea/[id]/opengraph-image.tsx`, généré via `next/og`, réutilisé automatiquement pour `twitter:image`)*
- [ ] Vérifier/ajouter des états de chargement (`loading.tsx`, skeletons) sur le catalogue paginé et le dashboard
- [ ] Persister les filtres de génération (`skillLevel`, `stackFocus`, `tone`, `aiUsage`) entre les sessions
- [ ] Auditer les empty states (`/history`, `/dashboard` sans idée sauvegardée) — CTA clair vers le générateur
- [ ] Auditer le parcours mobile génération → review → save

---

*Créé le 2026-07-30 avec Claude Code. Idées export CSV/JSON du catalogue et recherche floue déjà notées dans le [README](README.md#-upcoming).*
