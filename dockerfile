# --------------------------
# Build stage
# --------------------------
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma                
RUN npm install

# Copy rest of the app
COPY . .

# Generate Prisma client and build the Next.js app
RUN npm run build                   

# --------------------------
# Production stage
# --------------------------
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.* ./
COPY --from=base /app/tsconfig.json ./
COPY --from=base /app/next-env.d.ts ./
COPY --from=base /app/prisma ./prisma  

# Set environment
ENV NODE_ENV production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
