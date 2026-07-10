# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**TriviaWorld.com** — a full-stack trivia web app with four game modes, leaderboards, achievements, and user accounts. Questions come from [The Trivia API](https://the-trivia-api.com). Deployed to Fly.io.

> **Data source note.** Questions originally came from OpenTDB but were migrated to The Trivia API because OpenTDB's "easy" tier was miscalibrated (obscure questions labelled easy). The Trivia API's free tier is **non-commercial only** (CC BY-NC 4.0) — fine for this hobby project, but **do not monetize without a paid plan**. A discreet credit is required and lives in `Footer.tsx` (plus About/Privacy/Terms/FAQ/homepage prose).

## Commands

```bash
npm run dev          # Next.js dev server (Turbopack)
npm run build        # Production build (output: "standalone")
npm run start        # Serve the production build
npm run lint         # ESLint (eslint-config-next)

npm run db:push      # Push schema.ts to SQLite (primary workflow — no migration files)
npm run db:generate  # Generate a migration from schema changes
npm run db:migrate   # Apply generated migrations
npm run db:studio    # Drizzle Studio GUI
```

There is no test suite. Verify changes by running `npm run dev` and driving the flow, plus `npm run build` for type-safety.

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) + **next-themes** (dark/light)
- **SQLite** via **Drizzle ORM** + **better-sqlite3** (`serverExternalPackages` in `next.config.ts`)
- **Auth**: anonymous (localStorage userId) + email/password (**bcrypt** hashing, **jose** JWT)
- **State**: **Zustand** (`src/stores/gameStore.ts`) for game state; React Context (`AuthContext.tsx`) for auth
- **Email**: **Resend** (contact form) — needs `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in `.env.local`
- Misc: **nanoid** (IDs), **canvas-confetti**

## Layout

- `src/app/` — pages + API route handlers (App Router)
- `src/components/` — UI (Navbar, MobileNav, QuestionCard, Timer, GameResults, ...)
- `src/hooks/` — `useTimer`, `useSound`, `useAchievementToast`
- `src/stores/gameStore.ts` — Zustand game state
- `src/lib/` — `triviaApi.ts` (The Trivia API client + category-id→slug mapping), `scoring.ts`, `auth.ts`, `achievements.ts`, `categories.ts`, `posts.ts` (blog), `shareResults.ts`
- `src/lib/db/` — `schema.ts` (8 tables), `index.ts` (connection), `users.ts` (helpers)
- `src/types/trivia.ts` — shared TypeScript types

## Game Modes

| Mode | Route | Questions | Timer | Notes |
|------|-------|-----------|-------|-------|
| Quick Play | `/play` | 10 | 15s | Pick category + difficulty |
| Daily Challenge | `/play/daily` | 10 | 15s | Same questions for everyone, one attempt/day |
| Category Marathon | `/play/marathon` | up to 50 | 30s | Endurance |
| Survival | `/play/survival` | until out of lives | 20s | 3 lives, streak multiplier is the main scoring factor |

## Key Architecture (read before touching game flow)

- **Server-side answer validation — the client never receives the correct answer.**
  `GET /api/trivia/questions` fetches from The Trivia API, stores the full questions (with answers) in an **in-memory `questionStore` Map keyed by `sessionId`** (30-min TTL), and returns *sanitized* questions via `sanitizeForClient()`. `POST /api/game/answer` looks the question back up in `questionStore` to grade it. **`questionStore` is exported from `src/app/api/trivia/questions/route.ts` and imported by the answer route** — keep that coupling in mind.
- **Two different session IDs, don't conflate them:**
  - `sessionId` — key into the in-memory `questionStore` (answer validation)
  - `dbSessionId` — the `game_sessions` row id (persistence)
- **Category IDs vs. slugs**: the app's internal currency is still OpenTDB **numeric category IDs** (`openTdbId` in `src/lib/categories.ts`, used by the `/trivia/[category]` SEO pages and `/play?category=<id>` links). `src/lib/triviaApi.ts` holds `OPENTDB_TO_TRIVIA_API`, mapping each numeric id → one of The Trivia API's **10** category slugs. The Trivia API has fewer topics, so several app categories collapse onto a shared pool (e.g. Video Games/Vehicles → `general_knowledge`). Tune that map to change category behavior. `fetchCategories()` now returns the curated list from `categories.ts` (no network call).
- **Difficulty defaults to Easy.** All interactive setups (`QuickPlaySetup`, survival, marathon) and the daily route request `difficulty: "easy"` by default. Players can still opt into Medium/Hard via `DifficultySelector` ("Any" sends no filter = mixed). The Trivia API returns clean UTF-8 (no HTML-entity decoding needed) and tolerates normal request rates (no 5s throttle like OpenTDB required).
- **Scoring** (`src/lib/scoring.ts`): `BASE_POINTS = 100`, difficulty multiplier (easy 1 / medium 1.5 / hard 2), a time bonus, and per-mode formulas. Survival adds a streak multiplier (capped at streak 20).
- **Auth**: anonymous users are auto-created from a localStorage `userId`. Registering **upgrades the anonymous row in place** (sets email/passwordHash, flips `isAnonymous`) so history is preserved — don't create a new user on registration.
- **Achievements** (`src/lib/achievements.ts`): 18 achievements, seeded on first game completion, auto-checked when a game completes.

## Database

- SQLite file `./triviaworld.db` (WAL mode — `.db-wal` / `.db-shm` alongside it). On Fly it lives on a mounted volume at `/data`.
- Schema is the source of truth: edit `src/lib/db/schema.ts`, then `npm run db:push`. There is no `drizzle/` migrations folder in normal use.
- 8 tables: `users`, `game_sessions`, `answers`, `daily_challenges`, `leaderboard_entries`, `achievements`, `user_achievements`, `category_stats`.

## Deployment

- **Fly.io** (`fly.toml`, app `triviaworld-com`, region `iad`), Docker `output: "standalone"` build, single machine (`min_machines_running = 0`, auto start/stop).
- ⚠️ In-memory state (`questionStore`) is **per-process** and does not survive restarts or scale across machines. This works today because it's a single auto-scaled-to-one machine; if you ever run multiple instances, an active game's `questionStore` entry won't be found on another machine. Move that state to the DB/Redis before scaling out.

## Conventions

- Path alias `@/*` → `src/*`.
- IDs are `nanoid()`. Timestamps are ISO strings in `text` columns (`$defaultFn(() => new Date().toISOString())`).
- API routes return `NextResponse.json`; validate required fields and return 400/404 with an `{ error }` shape (see existing routes for the pattern).
- SEO/content pages already exist: `/about`, `/faq`, `/how-to-play`, `/privacy`, `/terms`, `/blog` (posts in `src/lib/posts.ts`), plus `robots.ts` and `sitemap.ts`.

## Attribution

This project has been built collaboratively with Claude — keep commit co-author trailers when committing.
