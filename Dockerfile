FROM docker.io/node:latest as builder

WORKDIR /usr/app/src

COPY package.json yarn.lock ./
RUN  yarn

COPY index.ts index.html webpack.config.js tsconfig.json ./
COPY src ./src

RUN yarn build

FROM docker.io/nginx:1.16.1-alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /usr/app/src/dist/ ./
COPY assets ./assets
