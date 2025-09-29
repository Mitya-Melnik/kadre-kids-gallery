# --- Этап 1: сборка фронта (Vite -> dist) ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# --- Этап 2: Nginx, отдающий статику из /usr/share/nginx/html ---
FROM nginx:alpine

# Наш конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ВАЖНО: валидируем конфиг на этапе сборки
RUN nginx -t

# Копируем собранные файлы фронта
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
