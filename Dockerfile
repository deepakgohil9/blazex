# Build stage
FROM node:lts as builder

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

EXPOSE 3000

CMD [ "node", "dist/app.js" ]

HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
