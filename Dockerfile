FROM node:20-slim

# Build deps for native sqlite3 module
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production && npm rebuild sqlite3 --build-from-source

COPY . .

# /data — persistent storage dir (Hugging Face Spaces mounts it when enabled)
RUN mkdir -p /data

# HF Spaces runs containers as uid 1000 — grant write access
RUN chown -R 1000:1000 /app /data

USER 1000

ENV PORT=7860
ENV NODE_ENV=production
ENV SESSION_SECRET=ken-secret-change-me-in-hf-secrets
ENV DB_PATH=/data/database.sqlite

EXPOSE 7860

CMD ["node", "server.js"]
