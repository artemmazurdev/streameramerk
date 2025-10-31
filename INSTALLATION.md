# 📦 Руководство по установке StreamYard Clone

Детальное руководство по установке и настройке всех компонентов системы.

## Содержание

1. [Системные требования](#системные-требования)
2. [Установка зависимостей](#установка-зависимостей)
3. [Конфигурация](#конфигурация)
4. [Запуск в режиме разработки](#запуск-в-режиме-разработки)
5. [Запуск с Docker](#запуск-с-docker)
6. [Production деплой](#production-деплой)
7. [Troubleshooting](#troubleshooting)

## Системные требования

### Минимальные требования

- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 50 GB
- **OS**: Linux (Ubuntu 20.04+), macOS, Windows 10+

### Рекомендуемые требования

- **CPU**: 8+ cores
- **RAM**: 16+ GB
- **Storage**: 100+ GB SSD
- **Network**: 100+ Mbps

### Необходимое ПО

- **Node.js**: 18.x или выше
- **npm**: 9.x или выше
- **PostgreSQL**: 14.x или выше
- **Redis**: 7.x или выше
- **FFmpeg**: 4.4 или выше
- **Docker & Docker Compose**: (опционально, но рекомендуется)

## Установка зависимостей

### 1. Установка Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@18

# Windows
# Скачать с https://nodejs.org/
```

### 2. Установка PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@14
brew services start postgresql@14

# Windows
# Скачать с https://www.postgresql.org/download/windows/
```

Создание базы данных:

```bash
sudo -u postgres psql
CREATE DATABASE streamyard;
CREATE USER streamyard WITH PASSWORD 'streamyard_password';
GRANT ALL PRIVILEGES ON DATABASE streamyard TO streamyard;
\q
```

### 3. Установка Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# macOS
brew install redis
brew services start redis

# Windows
# Использовать WSL или скачать с https://github.com/microsoftarchive/redis/releases
```

### 4. Установка FFmpeg

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Скачать с https://ffmpeg.org/download.html
```

Проверка установки:

```bash
ffmpeg -version
```

## Конфигурация

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/streamyard-clone.git
cd streamyard-clone
```

### 2. Установка зависимостей для всех модулей

```bash
npm run install:all
```

Или вручную для каждого модуля:

```bash
cd frontend && npm install
cd ../backend && npm install
cd ../signaling-server && npm install
cd ../media-server && npm install
cd ../rtmp-relay && npm install
```

### 3. Настройка переменных окружения

#### Backend (.env)

```bash
cd backend
cp .env.example .env
nano .env
```

Отредактируйте значения:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://streamyard:streamyard_password@localhost:5432/streamyard
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)

```bash
cd ../frontend
nano .env
```

```env
VITE_API_URL=http://localhost:4000
VITE_SIGNALING_URL=ws://localhost:5000
VITE_MEDIA_SERVER_URL=http://localhost:6000
```

#### Signaling Server (.env)

```bash
cd ../signaling-server
nano .env
```

```env
NODE_ENV=development
PORT=5000
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

#### Media Server (.env)

```bash
cd ../media-server
nano .env
```

```env
NODE_ENV=development
PORT=6000
RTC_MIN_PORT=40000
RTC_MAX_PORT=49999
ANNOUNCED_IP=127.0.0.1
```

### 4. Инициализация базы данных

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## Запуск в режиме разработки

### Вариант 1: Запуск всех сервисов одновременно

```bash
npm run dev
```

### Вариант 2: Запуск каждого сервиса отдельно

Откройте 5 терминалов:

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Signaling Server:**
```bash
cd signaling-server
npm run dev
```

**Terminal 3 - Media Server:**
```bash
cd media-server
npm run dev
```

**Terminal 4 - RTMP Relay:**
```bash
cd rtmp-relay
npm run dev
```

**Terminal 5 - Frontend:**
```bash
cd frontend
npm run dev
```

### Проверка работы сервисов

Откройте в браузере:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/health
- Signaling Server: http://localhost:5000/health
- Media Server: http://localhost:6000/health
- RTMP Relay: http://localhost:8888/

## Запуск с Docker

### 1. Установка Docker

```bash
# Ubuntu
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# macOS
brew install --cask docker

# Windows
# Скачать Docker Desktop с https://www.docker.com/products/docker-desktop
```

### 2. Запуск всех сервисов

```bash
docker-compose up -d
```

Просмотр логов:

```bash
docker-compose logs -f
```

Остановка сервисов:

```bash
docker-compose down
```

### 3. Проверка контейнеров

```bash
docker-compose ps
```

Все контейнеры должны быть в статусе "Up".

## Production деплой

### 1. Build всех проектов

```bash
# Frontend
cd frontend
npm run build

# Backend
cd ../backend
npm run build

# Остальные сервисы аналогично
```

### 2. Настройка переменных окружения для production

Измените `NODE_ENV=production` во всех `.env` файлах.

### 3. Использование PM2 (без Docker)

```bash
# Установка PM2
npm install -g pm2

# Запуск сервисов
cd backend
pm2 start dist/index.js --name backend

cd ../signaling-server
pm2 start dist/index.js --name signaling

cd ../media-server
pm2 start dist/index.js --name media-server

cd ../rtmp-relay
pm2 start dist/index.js --name rtmp-relay

# Настройка автозапуска
pm2 startup
pm2 save
```

### 4. Настройка Nginx

```bash
sudo apt install nginx

# Скопировать конфигурацию
sudo cp infrastructure/nginx/nginx.conf /etc/nginx/nginx.conf

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

### 5. SSL сертификат (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx

sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автообновление сертификата
sudo certbot renew --dry-run
```

### 6. Мониторинг

```bash
# Просмотр логов PM2
pm2 logs

# Мониторинг ресурсов
pm2 monit

# Список процессов
pm2 list
```

## Troubleshooting

### Проблема: База данных не подключается

**Решение:**
```bash
# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Проверить подключение
psql -h localhost -U streamyard -d streamyard

# Проверить DATABASE_URL в .env
```

### Проблема: Redis недоступен

**Решение:**
```bash
# Проверить статус Redis
sudo systemctl status redis

# Проверить подключение
redis-cli ping
# Должен вернуть: PONG
```

### Проблема: Порты заняты

**Решение:**
```bash
# Найти процесс на порту
sudo lsof -i :4000

# Убить процесс
sudo kill -9 <PID>
```

### Проблема: FFmpeg не найден

**Решение:**
```bash
# Установить FFmpeg
sudo apt install ffmpeg

# Проверить путь
which ffmpeg

# Добавить в PATH если нужно
export PATH=$PATH:/usr/local/bin
```

### Проблема: WebRTC соединение не устанавливается

**Решение:**
1. Проверить настройки firewall
2. Открыть UDP порты 40000-49999
3. Проверить `ANNOUNCED_IP` в media-server
4. Использовать TURN сервер для NAT traversal

```bash
# Открыть порты на Ubuntu
sudo ufw allow 40000:49999/udp
sudo ufw allow 40000:49999/tcp
```

### Проблема: CORS ошибки

**Решение:**
Проверить `CORS_ORIGIN` в .env файлах:
```env
CORS_ORIGIN=http://localhost:3000
```

### Получение помощи

- GitHub Issues: https://github.com/yourusername/streamyard-clone/issues
- Discord: https://discord.gg/yourinvite
- Email: support@yourdomain.com

## Полезные команды

```bash
# Очистка всех node_modules
npm run clean

# Переустановка зависимостей
npm run install:all

# Запуск тестов
npm run test

# Проверка версий
node --version
npm --version
psql --version
redis-cli --version
ffmpeg -version

# Docker команды
docker-compose up -d        # Запуск в фоне
docker-compose down         # Остановка
docker-compose logs -f      # Логи
docker-compose ps           # Статус контейнеров
docker-compose restart      # Перезапуск
```

---

**Успешной установки! 🚀**

Если возникли проблемы, обратитесь к документации или создайте issue.



