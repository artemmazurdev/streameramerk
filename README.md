# 🎥 StreamYard Clone - Платформа для Live Streaming

Полнофункциональная платформа для проведения прямых трансляций и записи видео в браузере.

## 📋 Основные возможности

- ✅ WebRTC видео/аудио коммуникация
- ✅ Поддержка множества участников (до 10)
- ✅ Server-side композитинг видео
- ✅ Multistreaming (YouTube, Facebook, Twitch)
- ✅ Screen sharing (демонстрация экрана)
- ✅ Запись трансляций
- ✅ Чат в реальном времени
- ✅ Настраиваемые overlays и баннеры
- ✅ Виртуальные фоны (AI)

## 🏗️ Архитектура проекта

```
streamyard/
├── frontend/              # React + TypeScript клиент
├── backend/              # Node.js API сервер
├── signaling-server/     # WebSocket сервер для WebRTC
├── media-server/         # SFU сервер (Mediasoup)
├── compositor/           # Видео композитинг (FFmpeg)
├── rtmp-relay/           # RTMP распределение
├── shared/               # Общий код и типы
└── infrastructure/       # Docker, Kubernetes конфиги
```

## 🚀 Технологический стек

### Frontend
- **React 18** + **TypeScript**
- **WebRTC** (getUserMedia, RTCPeerConnection)
- **Canvas API** для композитинга
- **Socket.io-client** для WebSocket
- **Tailwind CSS** для стилей
- **Zustand** для state management
- **Vite** для сборки

### Backend
- **Node.js** + **Express**
- **Socket.io** для WebSocket
- **PostgreSQL** (основная БД)
- **Redis** (кэш, pub/sub)
- **Prisma** ORM
- **JWT** аутентификация

### Media Processing
- **Mediasoup** (WebRTC SFU)
- **FFmpeg** (композитинг, транскодинг)
- **Node-Media-Server** (RTMP)

### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** (reverse proxy)
- **PM2** (process manager)

## 📦 Установка и запуск

### Предварительные требования

- Node.js 18+
- Docker и Docker Compose
- PostgreSQL 14+
- Redis 7+
- FFmpeg

### Быстрый старт

1. **Клонирование и установка зависимостей:**

```bash
# Установка зависимостей для всех сервисов
npm run install:all
```

2. **Настройка переменных окружения:**

```bash
# Скопировать примеры .env файлов
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp signaling-server/.env.example signaling-server/.env
cp media-server/.env.example media-server/.env
```

3. **Запуск через Docker Compose:**

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f
```

4. **Запуск в режиме разработки:**

```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Signaling Server
cd signaling-server
npm run dev

# Terminal 3 - Media Server
cd media-server
npm run dev

# Terminal 4 - Frontend
cd frontend
npm run dev
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Signaling Server: ws://localhost:5000
- Media Server: http://localhost:6000

## 🔧 Конфигурация

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/streamyard
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PORT=4000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_SIGNALING_URL=ws://localhost:5000
VITE_MEDIA_SERVER_URL=http://localhost:6000
```

## 📚 Документация API

После запуска backend сервера, API документация доступна:
- Swagger UI: http://localhost:4000/api-docs

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm run test

# Frontend тесты
cd frontend && npm run test

# Backend тесты
cd backend && npm run test
```

## 📝 Основные компоненты

### 1. Frontend Studio
- **StudioRoom** - главная комната трансляции
- **VideoGrid** - сетка участников
- **ControlPanel** - панель управления
- **OverlayManager** - управление наложениями
- **ChatPanel** - чат

### 2. WebRTC Flow
```
Участник → Signaling Server (обмен SDP)
         ↓
      Media Server (SFU)
         ↓
      Compositor → RTMP → Платформы стриминга
```

### 3. Database Schema
- **users** - пользователи
- **broadcasts** - трансляции
- **destinations** - платформы для стриминга
- **participants** - участники трансляций
- **recordings** - записи

## 🔐 Безопасность

- JWT токены для аутентификации
- HTTPS/WSS в продакшене
- DTLS-SRTP для WebRTC
- Шифрование stream keys
- Rate limiting
- CORS protection

## 🚀 Деплой

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Deploy с Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Рекомендуемый хостинг
- **Frontend**: Vercel, Netlify, CloudFlare Pages
- **Backend**: AWS EC2, DigitalOcean, Heroku
- **Media Server**: Dedicated servers (требуется много CPU)
- **Database**: AWS RDS, DigitalOcean Managed DB
- **Storage**: AWS S3, Google Cloud Storage

## 📈 Roadmap

- [x] Базовая архитектура
- [x] WebRTC P2P соединение
- [ ] Multi-user SFU
- [ ] Server-side композитинг
- [ ] RTMP multistreaming
- [ ] Запись трансляций
- [ ] Виртуальные фоны
- [ ] Продвинутые overlays
- [ ] Аналитика
- [ ] Монетизация

## 🤝 Вклад в проект

Приветствуются pull requests! Для больших изменений сначала откройте issue.

## 📄 Лицензия

MIT

## 📞 Поддержка

Для вопросов и поддержки создайте issue в репозитории.

---

**Создано с ❤️ для стриминга**



