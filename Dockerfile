FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Initialize the database
RUN npx drizzle-kit push

# Build Next.js
RUN npm run build

# --- Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true

# Copy the database (will be overwritten by volume mount in production)
COPY --from=builder /app/triviaworld.db ./triviaworld.db

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
