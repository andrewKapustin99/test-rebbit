#Определяем базовый образ
FROM node:14

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Открываем порт, который использует приложение
EXPOSE 3000

# Запускаем приложение
CMD ["node", "server.js"]