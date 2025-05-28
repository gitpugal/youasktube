# 1. Base image
FROM node:20-alpine AS base

# 2. Set working directory
WORKDIR /app

# 3. Install system dependencies (for Prisma + OpenSSL)
RUN apk add --no-cache openssl

# 4. Copy and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 5. Copy app source
COPY . .

# 6. Generate Prisma client
RUN npx prisma generate

# 7. Build Next.js app
RUN npm run build

# 8. Prune dev dependencies
RUN npm prune --production

# 9. Production image
FROM node:20-alpine AS production

WORKDIR /app

# 10. Copy production dependencies and build artifacts
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.env ./.env

# Also copy config files and source if needed by Next.js runtime
COPY --from=base /app/next.config.* ./      
COPY --from=base /app/tsconfig.json ./     
COPY --from=base /app/next-env.d.ts ./     

# 11. Expose port
EXPOSE 3000

# 12. Start app
CMD ["npm", "start"]
