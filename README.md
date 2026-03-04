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

## Deployment

A `Dockerfile` is included. The quickest way to deploy is with [Fly.io](https://fly.io):

```bash
# Install the Fly CLI (macOS)
brew install flyctl

# Sign up / log in
fly auth signup

# Launch and deploy (auto-detects Dockerfile)
fly launch
```

That's it. Your app will be live at `https://your-app-name.fly.dev`.

Future deploys are just `fly deploy`.

> **Note on data persistence:** By default the SQLite database lives inside the container and resets on each deploy. This is fine for demos and hobby use. If you need data to survive deploys, add a [persistent volume](https://fly.io/docs/volumes/):
>
> ```bash
> fly volumes create triviaworld_data --size 1
> ```
>
> Then add to your `fly.toml`:
> ```toml
> [mounts]
>   source = "triviaworld_data"
>   destination = "/data"
> ```
>
> And set `JWT_SECRET` as a secret:
> ```bash
> fly secrets set JWT_SECRET=$(openssl rand -hex 32)
> ```

### Other Hosting Options

The Dockerfile works on any container platform:

| Platform | Cost | How to Deploy |
|----------|------|---------------|
| **[Railway](https://railway.app)** | $5/mo credit | Connect GitHub repo — auto-detects Dockerfile |
| **[Render](https://render.com)** | Free tier | Connect GitHub repo — select Docker runtime |
| **Any VPS** | ~$4-6/mo | `docker build -t triviaworld . && docker run -p 3000:3000 triviaworld` |

## License

MIT
