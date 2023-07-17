FROM node:current-alpine3.18 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:current-alpine3.18 

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["npm", "run", "start:prod"]