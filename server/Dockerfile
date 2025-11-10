FROM node:18-bullseye-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-bullseye-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client if schema exists
RUN npx prisma generate || echo "Skipping prisma generate"
RUN npm run build

FROM node:18-bullseye-slim AS runtime

# Install OpenSSL for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# Copy dependencies and build artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Ensure Prisma Client is generated in final image
RUN npx prisma generate

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Use non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]