FROM node:15-alpine as build

WORKDIR /build

COPY . .

RUN npm it && npm run build --prod

FROM nginx:latest

WORKDIR /app

COPY ./docker/nginx.conf .

COPY --from=build /build/dist/automate/* /app/

EXPOSE 80