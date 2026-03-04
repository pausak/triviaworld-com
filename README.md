# TriviaWorld.com

A full-stack trivia platform built with Next.js, featuring multiple game modes, leaderboards, achievements, and user accounts. Powered by the [Open Trivia Database](https://opentdb.com).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![SQLite](https://img.shields.io/badge/SQLite-Drizzle_ORM-003B57)

## Game Modes

### ⚡ Quick Play
Pick a category and difficulty, then answer 10 questions with a 15-second timer. Score is based on accuracy and speed.

### 📅 Daily Challenge
Everyone gets the same 10 questions each day. One attempt only. Compete on the daily leaderboard.

### 🏃 Category Marathon
Choose a category and answer up to 50 questions with a 30-second timer. An endurance test of your knowledge.

### 💀 Survival
Start with 3 lives. Mixed categories, 20 seconds per question. Wrong answers cost a life. Streak multipliers reward consistency. Play until you're eliminated.

## Features

- **Server-side answer validation** — The client never sees correct answers before submitting, preventing cheating
- **Leaderboards** — Ranked by mode with timeframe filtering (today, this week, this month, all time)
- **18 Achievements** — Unlock awards like Perfect 10, Streak Master, Speed Demon, and more
- **User accounts** — Play anonymously or create an account to preserve history across devices
- **Account upgrade** — Seamlessly convert an anonymous profile to a registered account without losing data
- **Profile dashboard** — View games played, accuracy stats, category mastery progress, and recent games
- **Dark/light theme** — Toggle between themes, persisted across sessions
- **Sound effects** — Synthesized audio feedback for correct/wrong answers (Web Audio API, no files needed)
- **Confetti** — Celebration animation on high-accuracy games
- **Share results** — Wordle-style shareable text with emoji grid
- **Responsive design** — Desktop navbar + mobile bottom navigation
- **Rate-limited API** — Server-side request queue with 5-second minimum gap to respect OpenTDB limits

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + [next-themes](https://github.com/pacocoursey/next-themes) |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Auth | Anonymous (localStorage) + email/password ([bcrypt](https://github.com/kelektiv/node.bcrypt.js) + [jose](https://github.com/panva/jose) JWT) |
| State | [Zustand](https://github.com/pmndrs/zustand) (game state) + React Context (auth) |
| Other | [nanoid](https://github.com/ai/nanoid), [canvas-confetti](https://github.com/catdad/canvas-confetti) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/pausak/triviaworld-com.git
cd triviaworld-com

# Install dependencies
npm install

# Initialize the database
npx drizzle-kit push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables (Optional)

Create a `.env.local` file for production settings:

```env
# JWT secret for auth tokens (defaults to a dev secret)
JWT_SECRET=your-secure-random-string
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page with game mode cards
│   ├── layout.tsx                # Root layout with providers
│   ├── play/
│   │   ├── page.tsx              # Quick Play
│   │   ├── daily/page.tsx        # Daily Challenge
│   │   ├── marathon/page.tsx     # Category Marathon
│   │   └── survival/page.tsx     # Survival Mode
│   ├── leaderboard/page.tsx      # Leaderboard with mode/timeframe tabs
│   ├── achievements/page.tsx     # Achievement gallery
│   ├── profile/page.tsx          # Profile stats dashboard
│   ├── auth/page.tsx             # Login/register page
│   └── api/
│       ├── trivia/
│       │   ├── questions/        # Fetch & cache questions from OpenTDB
│       │   ├── categories/       # List available categories
│       │   └── daily/            # Daily challenge questions
│       ├── game/
│       │   ├── session/          # Create game session
│       │   ├── answer/           # Submit & validate answer
│       │   └── complete/         # Finalize game, compute score, check achievements
│       ├── leaderboard/          # Ranked entries by mode/timeframe
│       ├── auth/                 # Register, login, session check
│       └── profile/              # Stats and achievements
├── components/                   # React components
│   ├── QuestionCard.tsx          # Question display with answer buttons
│   ├── AnswerButton.tsx          # Individual answer option
│   ├── Timer.tsx                 # Circular countdown timer
│   ├── GameResults.tsx           # Score summary with share/confetti
│   ├── CategoryPicker.tsx        # Category selection grid
│   ├── DifficultySelector.tsx    # Difficulty toggle
│   ├── Navbar.tsx                # Desktop navigation
│   ├── MobileNav.tsx             # Mobile bottom navigation
│   ├── AuthContext.tsx           # Auth provider & useAuth hook
│   ├── ThemeProvider.tsx         # Dark/light theme provider
│   └── ThemeToggle.tsx           # Theme switch button
├── hooks/
│   ├── useTimer.ts               # Countdown timer with 100ms precision
│   ├── useSound.ts               # Web Audio API sound effects
│   └── useAchievementToast.ts    # Achievement unlock detection
├── stores/
│   └── gameStore.ts              # Zustand store (game state machine)
├── lib/
│   ├── opentdb.ts                # OpenTDB API client with rate limiting
│   ├── scoring.ts                # Per-mode scoring formulas
│   ├── achievements.ts           # Achievement definitions & checking
│   ├── auth.ts                   # JWT token creation & verification
│   ├── shareResults.ts           # Wordle-style share text generator
│   └── db/
│       ├── schema.ts             # Drizzle ORM schema (8 tables)
│       ├── index.ts              # Database connection
│       └── users.ts              # User CRUD helpers
└── types/
    └── trivia.ts                 # TypeScript type definitions
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Anonymous & registered users, streak tracking, preferences |
| `game_sessions` | One row per played game (mode, score, timing, status) |
| `answers` | Individual answers per session with server-validated results |
| `daily_challenges` | Pre-cached daily questions (one set per day) |
| `leaderboard_entries` | Denormalized for fast ranked queries |
| `achievements` | Achievement definitions (18 total) |
| `user_achievements` | Earned achievements per user |
| `category_stats` | Per-user accuracy breakdown by category |

### Database Commands

```bash
npx drizzle-kit push      # Push schema changes to SQLite
npx drizzle-kit generate  # Generate migration files
npx drizzle-kit studio    # Open Drizzle Studio GUI
```

## Scoring System

| Mode | Formula |
|------|---------|
| Quick Play | `base × difficulty × (1 + timeBonus × 0.5)` |
| Daily | `base × (1 + timeBonus × 0.5)` |
| Marathon | `base × 0.8 × difficulty × (1 + timeBonus × 0.3)` |
| Survival | `base × difficulty × streakMultiplier × (1 + timeBonus × 0.3)` |

- **Base points**: 100
- **Difficulty multipliers**: Easy ×1, Medium ×1.5, Hard ×2
- **Time bonus**: Proportional to remaining time (faster = more points)
- **Streak multiplier** (Survival): +10% per consecutive correct answer, up to ×3

## Achievements

| Achievement | Requirement |
|-------------|------------|
| First Steps | Complete your first game |
| Getting Started | Complete 5 games |
| Perfect 10 | 100% accuracy in Quick Play |
| Speed Demon | Average under 5s per question |
| Hard Mode Hero | 70%+ accuracy on Hard difficulty |
| On Fire | 5-question answer streak |
| Unstoppable | 10-question answer streak |
| Streak Master | 3-day play streak |
| Daily Devotee | 7-day play streak |
| Rising Star | Reach 1,000 total score |
| Trivia Champion | Reach 10,000 total score |
| *...and 7 more* | |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trivia/questions` | Fetch questions from OpenTDB (rate-limited) |
| `GET` | `/api/trivia/categories` | List available categories |
| `GET` | `/api/trivia/daily` | Get today's daily challenge |
| `POST` | `/api/game/session` | Create a new game session |
| `POST` | `/api/game/answer` | Submit and validate an answer |
| `POST` | `/api/game/complete` | Finalize game and check achievements |
| `GET` | `/api/leaderboard` | Get ranked entries (filterable) |
| `POST` | `/api/auth/register` | Create account or upgrade anonymous |
| `POST` | `/api/auth/login` | Email/password login |
| `GET` | `/api/auth/me` | Get current session user |
| `GET` | `/api/profile/stats` | User stats and category breakdown |
| `GET` | `/api/profile/achievements` | User achievement progress |

## Architecture Decisions

- **Server-side answer validation**: The client receives questions without correct answers. Each answer is validated by the server, preventing inspection of network responses to cheat.
- **OpenTDB rate limiting**: A server-side queue enforces a 5-second minimum gap between outgoing API requests to respect OpenTDB's rate limits.
- **Denormalized leaderboard**: A dedicated `leaderboard_entries` table avoids JOINs for the most frequent read operation.
- **Zustand over Context for game state**: Fine-grained subscriptions mean timer ticks (100ms) don't re-render the question card or answer buttons.
- **Web Audio API for sounds**: Synthesized tones instead of audio files — zero additional assets to load.
- **SQLite**: Single-file database, zero configuration, perfect for self-hosted deployments.

## Deploying to Cloudflare Pages

This project uses SQLite via better-sqlite3 (a native C++ addon) and bcrypt (also native). These won't run on Cloudflare's edge runtime. To deploy to Cloudflare, you need to:

1. Switch from **better-sqlite3** to **Cloudflare D1** (Cloudflare's edge SQLite)
2. Switch from **bcrypt** to **bcryptjs** (pure JavaScript implementation)
3. Use **@opennextjs/cloudflare** to adapt Next.js for Cloudflare Pages

### Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated

```bash
npm install -g wrangler
wrangler login
```

### Step 1: Install Cloudflare Dependencies

```bash
# Remove incompatible native packages
npm uninstall better-sqlite3 @types/better-sqlite3 bcrypt @types/bcrypt

# Install Cloudflare-compatible replacements
npm install bcryptjs drizzle-orm
npm install -D @opennextjs/cloudflare bcryptjs @types/bcryptjs
```

### Step 2: Create a D1 Database

```bash
# Create the D1 database
wrangler d1 create triviaworld-db
```

This outputs a database ID. Copy it for the next step.

### Step 3: Create `wrangler.jsonc`

Create a `wrangler.jsonc` file in the project root:

```jsonc
{
  "name": "triviaworld",
  "compatibility_date": "2024-12-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": ".open-next",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "triviaworld-db",
      "database_id": "<your-database-id-from-step-2>"
    }
  ],
  "vars": {
    "JWT_SECRET": "change-this-to-a-secure-random-string"
  }
}
```

> **Note:** For production, set `JWT_SECRET` as an encrypted secret instead:
> ```bash
> wrangler secret put JWT_SECRET
> ```

### Step 4: Update the Database Connection

Replace `src/lib/db/index.ts` with:

```typescript
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema });
}

export { schema };
```

### Step 5: Update Drizzle Config

Update `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    // For local dev with wrangler
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/<your-db-id>/db.sqlite",
  },
});
```

### Step 6: Update API Routes to Use D1

Every API route that imports `db` needs to access D1 through the Cloudflare environment. In Next.js on Cloudflare, you access bindings via `getRequestContext()`:

```typescript
// In each API route, replace:
import { db } from "@/lib/db";

// With:
import { getDb } from "@/lib/db";
import { getRequestContext } from "@cloudflare/next-on-pages";

// Then inside the handler:
const { env } = getRequestContext();
const db = getDb(env);
```

**Affected files:**
- `src/app/api/game/session/route.ts`
- `src/app/api/game/answer/route.ts`
- `src/app/api/game/complete/route.ts`
- `src/app/api/leaderboard/route.ts`
- `src/app/api/trivia/daily/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/profile/stats/route.ts`
- `src/app/api/profile/achievements/route.ts`
- `src/lib/achievements.ts`
- `src/lib/db/users.ts`

### Step 7: Swap bcrypt for bcryptjs

In `src/app/api/auth/register/route.ts` and `src/app/api/auth/login/route.ts`, replace:

```typescript
// Before
import bcrypt from "bcrypt";

// After
import bcrypt from "bcryptjs";
```

The API is identical — no other code changes needed.

### Step 8: Push Schema to D1

```bash
# Apply schema to your remote D1 database
wrangler d1 migrations apply triviaworld-db --remote

# Or use Drizzle to push directly (local dev)
npx drizzle-kit push
```

### Step 9: Add the OpenNext Config

Create `open-next.config.ts` in the project root:

```typescript
import { defineConfig } from "@opennextjs/cloudflare";

export default defineConfig({});
```

### Step 10: Build and Deploy

```bash
# Build for Cloudflare
npx cloudflare
# Deploy
wrangler deploy
```

Or connect your GitHub repo for automatic deployments:

1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create a project** → **Connect to Git**
3. Select the `triviaworld-com` repository
4. Set build settings:
   - **Build command:** `npx cloudflare`
   - **Build output directory:** `.open-next`
5. Add the D1 database binding under **Settings → Functions → D1 database bindings**
6. Add `JWT_SECRET` under **Settings → Environment variables**

### Step 11: Local Development with D1

For local development using D1 instead of better-sqlite3:

```bash
# Run Next.js with wrangler (provides local D1)
wrangler dev
```

### Summary of Changes

| Component | Local (current) | Cloudflare |
|-----------|----------------|------------|
| Database | better-sqlite3 | Cloudflare D1 |
| DB Driver | `drizzle-orm/better-sqlite3` | `drizzle-orm/d1` |
| Password Hashing | bcrypt (native) | bcryptjs (pure JS) |
| Build Tool | `next build` | `npx cloudflare` (via @opennextjs/cloudflare) |
| Config | `next.config.ts` | `next.config.ts` + `wrangler.jsonc` |
| Runtime | Node.js | Cloudflare Workers |

### Alternative: Deploy with Docker (Self-Hosted)

If you prefer to keep better-sqlite3 and deploy to a VPS or container platform:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx drizzle-kit push
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/triviaworld.db ./
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t triviaworld .
docker run -p 3000:3000 triviaworld
```

This avoids the D1 migration entirely and works on any platform that supports Docker (Fly.io, Railway, DigitalOcean, AWS, etc.).

## License

MIT
