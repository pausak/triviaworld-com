FROM node:24-alpine AS base

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# better-sqlite3 ships a prebuilt binary for every platform, and this image has no
# compiler: without this, npm tries to build it because it finds a binding.gyp.
RUN npm ci --ignore-scripts

# --- Builder ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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
COPY --from=builder /app/public ./public

# Ensure /data directory exists and is writable for persistent SQLite storage
RUN mkdir -p /data

RUN chown -R nextjs:nodejs /app /data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
