FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

# The SQLite file lives in its own folder so it can be kept in a Docker volume.
ENV NODE_ENV=production \
    DB_PATH=/app/data/database.sqlite
RUN mkdir -p /app/data

EXPOSE 3000

# Migrations run automatically when the server starts.
CMD ["node", "dist/index.js"]
