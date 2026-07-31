# 📋 Backlog

Suivi des chantiers identifiés pour APIxplore. Pas de sprint/priorité formelle — on coche au fil de l'eau.

Légende : `[ ]` à faire · `[~]` en cours · `[x]` fait

## 🎯 Métier / valeur ajoutée

- [x] Corriger la logique du quota — il compte les idées *sauvegardées*, pas les générations (appels OpenAI). Un utilisateur peut spammer `/api/ideas/generate` sans jamais toucher la limite. *(nouvelle table `idea_generations`, comptage sur les appels réels)*
- [x] Régénérer / itérer sur une idée ("encore 3 idées" / "affine celle-ci") plutôt que de tout relancer depuis zéro *("encore 3 idées" existait déjà via "Regenerate" ; ajouté "affiner celle-ci" — nouvelle route `/api/ideas/refine`, formulaire inline par carte avec instruction libre, protégée par le même quota + rate limit (5 req/60s) que la génération*
- [ ] Organisation de l'historique — tags/catégories/collections sur les idées sauvegardées (`ideas-history.tsx` est une liste plate aujourd'hui)
- [x] Profils publics — `app/user/[id]` existe mais redirige si ce n'est pas soi-même ; ouvrir une vue publique (ses idées publiques) *(vue publique accessible sans connexion pour tout id ≠ le sien, dashboard privé conservé pour soi-même ; nouveau composant `public-profile.tsx`, avatar dérivé du github_username, 404 si profil introuvable ; attribution auteur ajoutée sur les cartes d'idées du feed public et de la page idée individuelle, sinon la page profil n'était atteignable par personne ; ajouté au sitemap, retiré du disallow robots.txt)*
- [ ] Exploiter les événements analytics — `/api/events` fait juste un `console.info`, rien n'est persisté ; stocker en base pour avoir une vraie vue sur les APIs/idées populaires
- [x] Recherche floue globale sur le catalogue d'APIs (1500+ entrées) *(Fuse.js sur nom + description, tolérant aux fautes de frappe)*

## 🔧 Technique / chore

- [x] Ajouter des tests (au minimum : logique de quota, parsing de `/api/ideas/generate`) *(Vitest, `lib/ideaGeneration.test.ts` + `lib/db/generations.test.ts`, `npm run test`)*
- [x] Mettre en place une CI (`.github/workflows`) qui lance `lint` / `typecheck` / `build` sur les PRs *(+ `test` maintenant que Vitest existe ; `.github/workflows/ci.yml`)*
- [x] Rate limiting / middleware sur les routes API (rien ne protège au-delà du quota, lui-même buggé) *(`middleware.ts` + `lib/rateLimit.ts`, table `rate_limit_hits` ; 5 req/60s sur `/api/ideas/generate`, 20 req/60s sur `/api/events`)*
- [x] Ajouter `error.tsx` / `not-found.tsx` / `loading.tsx` à l'App Router
- [x] Nettoyer les métadonnées scaffold de `package.json` (nom `next-template`, version `0.0.2`) *(nom → `apixplore`, version → `0.1.0`, ajout description/license/repository)*
- [x] Réaligner les versions qui ont dérivé (TypeScript `^4.9.5`, ESLint 8 / `eslint-config-next` 15.3.1 vs Next 16 / React 19) *(TS → 5.9.3, ESLint → 9.39.5 + flat config `eslint.config.mjs`, eslint-config-next → 16.2.12, `class-variance-authority` → 0.7.1 pour lever un conflit de peer deps ; `middleware.ts` renommé `proxy.ts` (convention Next 16) ; nettoyage des `any`/imports inutiles remontés par le nouveau lint)*
- [x] Ajouter `sitemap.xml` / `robots.txt` (pénalise l'indexation de `/idea/[id]` et du catalogue) *(`app/sitemap.ts` + `app/robots.ts`, pages statiques + toutes les idées publiques ; nécessite `NEXT_PUBLIC_SITE_URL` sur Vercel)*
- [x] Réparer le script `npm run lint` — `next lint` n'est plus supporté sur Next 16, la commande échoue (`Invalid project directory`) *(remplacé par `eslint .`, nécessaire pour que la CI ait un vrai step lint)*

- [ ] Revoir les 3 usages de `setState` synchrone dans un `useEffect` remontés par `react-hooks/set-state-in-effect` (downgradé en warning pour ne pas bloquer la CI) : reset de pagination dans `app/resources/page.tsx`, détection de `navigator.share` dans `share-idea-button.tsx`, sync avec Embla dans `ui/carousel.tsx`

## 🎨 UI/UX

- [x] Open Graph image sur les pages d'idées publiques (`generateMetadata` a déjà title/description, pas d'image) *(`app/idea/[id]/opengraph-image.tsx`, généré via `next/og`, réutilisé automatiquement pour `twitter:image`)*
- [x] Vérifier/ajouter des états de chargement (`loading.tsx`, skeletons) sur le catalogue paginé et le dashboard *(catalogue et historique avaient déjà un skeleton ; ajouté sur `user-hub.tsx` — spinner texte remplacé par un skeleton fidèle à la mise en page réelle)*
- [x] Persister les filtres de génération (`skillLevel`, `stackFocus`, `tone`, `aiUsage`) entre les sessions *(`localStorage`, clé `apixplore:idea-filters`, validés via `resolveFilters` au chargement)*
- [x] Auditer les empty states (`/history`, `/dashboard` sans idée sauvegardée) — CTA clair vers le générateur *(CTA ajoutés sur `/history`, `/likes`, et les 2 sections du dashboard ; bug trouvé au passage : `IdeasHistory` plantait pour un visiteur non connecté car `data.ideas` est `undefined` sur un 401 — corrigé)*
- [x] Auditer le parcours mobile génération → review → save *(bug réel trouvé et corrigé : `ScrollArea` de Radix force `display:table` sur son contenu, ce qui cassait le `max-width`/`flex-wrap` et faisait déborder horizontalement les filtres et les cartes d'idées sur mobile — fix dans `components/ui/scroll-area.tsx`. Reste du parcours — trigger, filtres, carrousel, save, navigation entre idées — vérifié OK. Point mineur noté ci-dessous, pas corrigé)*
- [x] Toast "Idea generated/saved" chevauche les boutons Prev/Next du carrousel sur mobile (position bottom du `Toaster` global) *(`mobileOffset={{ bottom: "130px" }}` sur le `Toaster`, ne touche pas au positionnement desktop ; chevauchement vérifié résolu par mesure DOM)*

---

*Créé le 2026-07-30 avec Claude Code. Idée export CSV/JSON du catalogue déjà notée dans le [README](README.md#-upcoming).*
