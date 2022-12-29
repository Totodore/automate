FROM node:18-alpine as build

WORKDIR /build

COPY . .

RUN yarn && yarn build

FROM nginx:latest

WORKDIR /app

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /build/dist/automate/ /app/

EXPOSE 80