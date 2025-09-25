# --- Этап 1: сборка фронта (Vite -> dist) ---
FROM node:22-alpine AS build
WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm ci || npm install

# Копируем исходники и собираем
COPY . .
RUN npm run build

# --- Этап 2: Nginx, отдающий статику из /usr/share/nginx/html ---
FROM nginx:alpine

# Наш конфиг Nginx для SPA (правило try_files)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80 (стандартный для Nginx)
EXPOSE 80

# Запуск Nginx в форграунде
CMD ["nginx", "-g", "daemon off;"]
