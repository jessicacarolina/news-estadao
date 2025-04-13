FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:23-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

RUN npm install -g ts-node tsconfig-paths

EXPOSE 3000

CMD ["npm", "run", "start:dev"]