FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:16-alpine 

WORKDIR /app

COPY --from=builder app/package.json app/package-lock.json ./

RUN npm ci

COPY --from=builder /app/dist /app/dist

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]