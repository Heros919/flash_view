FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main"]