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
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
# Ensure Prisma Client is generated in the final image (avoids runtime init errors)
# Ensure Prisma Client is generated in final image
RUN npx prisma generate || echo "Skipping prisma generate at runtime"
EXPOSE 3000
CMD ["node", "dist/index.js"]