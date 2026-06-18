# ── Stage 1: Build React client ───────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./

RUN npm run build

# ── Stage 2: Production server ─────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy Express server deps
COPY package*.json ./
RUN npm install --production

# Copy Express server
COPY server.js ./

# Copy static assets (logo, images needed by old pages if any)
COPY public/images ./public_react/images

# Copy built React app into public_react/
COPY --from=builder /app/public_react/ ./public_react/

EXPOSE 8080

CMD ["node", "server.js"]
