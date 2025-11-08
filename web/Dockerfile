FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || (echo "Build failed, listing files" && ls -R . && exit 1)

# Serve built assets with Vite preview for simplicity (can switch to Nginx later)
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app /app
EXPOSE 8080
CMD ["npm", "run", "serve", "--", "--port", "8080", "--host"]