# --- Builder Stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Runner Stage ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install required libraries and Chromium
RUN apk add --no-cache \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    udev \
    bash \
    chromium

# Puppeteer settings for direct Chromium use
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy production build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]