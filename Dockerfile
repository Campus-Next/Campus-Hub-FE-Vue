# syntax=docker/dockerfile:1

# ---- Stage 1: build the Vite bundle ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite inlines these at build time. Default to same-origin paths that the
# runtime nginx proxies to the backend (see default.conf.template).
ARG VITE_API_BASE_URL=/api
ARG VITE_STORAGE_BASE_URL=/storage
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STORAGE_BASE_URL=$VITE_STORAGE_BASE_URL
RUN npm run build

# ---- Stage 2: serve static files with nginx ----
FROM nginx:alpine AS runtime
# Where to proxy /api and /storage. Overridable at runtime; the nginx image
# entrypoint runs envsubst over templates in /etc/nginx/templates.
ENV BACKEND_URL=http://backend
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
