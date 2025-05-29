# --- Builder Stage ---
FROM node:18-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Runner Stage ---
FROM node:18-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install Google Chrome Stable (not Chromium)
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-freefont-ttf && \
    rm -rf /var/lib/apt/lists/*

# Puppeteer configuration
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
    PROTOCOL_TIMEOUT=0

# Copy production build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]