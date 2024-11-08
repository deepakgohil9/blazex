# Build stage
FROM node:lts AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


#Production stage
FROM node:lts-slim

RUN apt update && apt install -y curl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", "dist/index.js" ]

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
