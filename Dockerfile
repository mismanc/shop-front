FROM node:alpine AS builder
ENV NODE_ENV production
WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

# Fetching the latest nginx image
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
