# --- Этап сборки фронта ---
FROM node:22-alpine AS build
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci || npm install

# Копируем исходники и собираем
COPY . .
RUN npm run build

# --- Этап сервера Nginx со статикой из dist ---
FROM nginx:alpine

# Наш конфиг Nginx с правилом для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Готовые файлы фронта кладём в стандартную папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (опционально локально) порт 80
EXPOSE 80
