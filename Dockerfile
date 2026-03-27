# Используем LTS версию Node.js
FROM node:20-slim

# Устанавливаем необходимые зависимости для сборки нативных модулей (sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем остальные файлы
COPY . .

# Создаем пустой файл БД, если его нет, и даем права (для безопасности лучше использовать тома)
RUN touch database.sqlite && chmod 666 database.sqlite

# Переменные окружения по умолчанию
ENV PORT=3000
ENV NODE_ENV=production
ENV SESSION_SECRET=ken-secret-default-change-me

# Открываем порт
EXPOSE 3000

# Запуск приложения
CMD ["node", "server.js"]
