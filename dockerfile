# 1. Base image
FROM node:20-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Install system dependencies for Prisma (for SQLite/PostgreSQL)
RUN apk add --no-cache openssl

# 4. Copy package files and install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* bun.lockb* ./
RUN npm install

# 5. Copy the rest of the app
COPY . .

# 6. Generate Prisma client
RUN npx prisma generate

# 7. Build the Next.js app
RUN npm run build

# 8. Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install only production deps
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/next-env.d.ts ./
COPY --from=base /app/tsconfig.json ./
COPY --from=base /app/.env ./

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
