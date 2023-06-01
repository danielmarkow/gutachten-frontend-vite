FROM node:18-alpine as build
RUN npm install -g pnpm
WORKDIR /app
COPY package.json .
RUN pnpm i
COPY . .
RUN pnpm run build
FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html