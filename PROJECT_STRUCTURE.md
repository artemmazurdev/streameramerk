# 📁 Структура проекта StreamYard Clone

Полное описание структуры файлов и директорий проекта.

```
streamyard/
│
├── 📄 README.md                      # Главный README
├── 📄 QUICKSTART.md                  # Быстрый старт
├── 📄 INSTALLATION.md                # Детальная установка
├── 📄 ARCHITECTURE.md                # Техническая архитектура
├── 📄 CONTRIBUTING.md                # Гайд для контрибьюторов
├── 📄 CHANGELOG.md                   # История изменений
├── 📄 LICENSE                        # MIT License
├── 📄 PROJECT_STRUCTURE.md           # Этот файл
│
├── 📦 package.json                   # Root package.json (workspaces)
├── 📦 package-lock.json
├── 🐳 docker-compose.yml             # Docker Compose для dev
├── 🐳 docker-compose.prod.yml        # Docker Compose для prod
├── 📄 .dockerignore
├── 📄 .gitignore
├── 📄 .editorconfig
├── 📄 Makefile                       # Команды для быстрого запуска
│
├── 📂 .github/                       # GitHub конфигурация
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
│
├── 📂 scripts/                       # Утилиты и скрипты
│   ├── setup.sh                      # Скрипт первоначальной настройки
│   ├── check-ports.sh                # Проверка портов
│   └── health-check.sh               # Health check всех сервисов
│
├── 📂 infrastructure/                # Инфраструктура
│   └── nginx/
│       ├── nginx.conf                # Nginx конфигурация (dev)
│       ├── nginx.prod.conf           # Nginx конфигурация (prod)
│       └── ssl/                      # SSL сертификаты
│
├── 📂 frontend/                      # 🎨 React Frontend
│   ├── 📦 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 vite.config.ts
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   ├── 📄 .eslintrc.cjs
│   ├── 📄 index.html
│   ├── 🐳 Dockerfile
│   │
│   ├── public/                       # Статические файлы
│   │   └── vite.svg
│   │
│   └── src/
│       ├── main.tsx                  # Entry point
│       ├── App.tsx                   # Root component
│       ├── index.css                 # Global styles
│       │
│       ├── components/               # React компоненты
│       │   ├── VideoGrid/
│       │   │   ├── VideoGrid.tsx
│       │   │   └── VideoTile.tsx
│       │   ├── ControlPanel/
│       │   │   └── ControlPanel.tsx
│       │   ├── Chat/
│       │   ├── Overlays/
│       │   └── Settings/
│       │
│       ├── pages/                    # Страницы
│       │   ├── HomePage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── DashboardPage.tsx
│       │   └── StudioPage.tsx
│       │
│       ├── services/                 # API сервисы
│       │   ├── api.service.ts
│       │   ├── socket.service.ts
│       │   └── webrtc.service.ts
│       │
│       ├── store/                    # State management
│       │   └── useStudioStore.ts
│       │
│       ├── hooks/                    # Custom hooks
│       │   ├── useMediaDevices.ts
│       │   ├── useWebRTC.ts
│       │   └── useBroadcast.ts
│       │
│       ├── types/                    # TypeScript types
│       │   └── index.ts
│       │
│       └── utils/                    # Утилиты
│           ├── canvas-compositor.ts
│           └── media-utils.ts
│
├── 📂 backend/                       # 🔧 Backend API
│   ├── 📦 package.json
│   ├── 📄 tsconfig.json
│   ├── 🐳 Dockerfile
│   │
│   ├── prisma/                       # Prisma ORM
│   │   ├── schema.prisma             # Database schema
│   │   ├── seed.ts                   # Database seed
│   │   └── migrations/               # DB миграции
│   │
│   └── src/
│       ├── index.ts                  # Entry point
│       │
│       ├── routes/                   # Express routes
│       │   ├── index.ts
│       │   ├── auth.routes.ts
│       │   ├── broadcast.routes.ts
│       │   ├── recording.routes.ts
│       │   └── upload.routes.ts
│       │
│       ├── controllers/              # Route controllers
│       │   ├── auth.controller.ts
│       │   ├── broadcast.controller.ts
│       │   ├── recording.controller.ts
│       │   └── upload.controller.ts
│       │
│       ├── middleware/               # Express middleware
│       │   ├── auth.middleware.ts
│       │   ├── errorHandler.ts
│       │   ├── validate.middleware.ts
│       │   └── upload.middleware.ts
│       │
│       ├── validators/               # Request validators
│       │   └── auth.validator.ts
│       │
│       ├── services/                 # Business logic
│       │   ├── auth.service.ts
│       │   ├── broadcast.service.ts
│       │   └── rtmp.service.ts
│       │
│       └── utils/                    # Утилиты
│           └── jwt.ts
│
├── 📂 signaling-server/              # 📡 WebSocket Signaling
│   ├── 📦 package.json
│   ├── 📄 tsconfig.json
│   ├── 🐳 Dockerfile
│   │
│   └── src/
│       ├── index.ts                  # Socket.io server
│       │
│       └── services/
│           └── roomManager.ts        # Room management
│
├── 📂 media-server/                  # 🎥 Mediasoup SFU
│   ├── 📦 package.json
│   ├── 📄 tsconfig.json
│   ├── 🐳 Dockerfile
│   │
│   └── src/
│       ├── index.ts                  # Media server
│       │
│       └── config/
│           └── mediasoup.ts          # Mediasoup config
│
├── 📂 rtmp-relay/                    # 📺 RTMP Server
│   ├── 📦 package.json
│   ├── 📄 tsconfig.json
│   ├── 🐳 Dockerfile
│   │
│   └── src/
│       └── index.ts                  # Node-Media-Server
│
├── 📂 compositor/                    # 🎬 Video Compositor
│   ├── 📦 package.json
│   ├── 📄 tsconfig.json
│   │
│   └── src/
│       └── index.ts                  # FFmpeg compositor
│
└── 📂 shared/                        # 📚 Shared Code
    ├── 📦 package.json
    ├── 📄 tsconfig.json
    │
    └── src/
        ├── types.ts                  # Shared types
        └── constants.ts              # Shared constants
```

## Описание основных директорий

### 📂 frontend/
React приложение с TypeScript, WebRTC, Canvas API для клиентской части.

**Ключевые файлы:**
- `src/pages/StudioPage.tsx` - Главная студия трансляции
- `src/services/webrtc.service.ts` - WebRTC логика
- `src/services/socket.service.ts` - WebSocket коммуникация
- `src/store/useStudioStore.ts` - Глобальное состояние

### 📂 backend/
REST API сервер на Express с Prisma ORM и PostgreSQL.

**Ключевые файлы:**
- `src/index.ts` - Express сервер
- `prisma/schema.prisma` - Database schema
- `src/controllers/` - API controllers
- `src/middleware/auth.middleware.ts` - JWT authentication

### 📂 signaling-server/
WebSocket сервер на Socket.io для координации WebRTC соединений.

**Ключевые файлы:**
- `src/index.ts` - Socket.io server
- `src/services/roomManager.ts` - Управление комнатами

### 📂 media-server/
SFU сервер на Mediasoup для маршрутизации медиа потоков.

**Ключевые файлы:**
- `src/index.ts` - Mediasoup worker и router
- `src/config/mediasoup.ts` - Codecs и настройки

### 📂 rtmp-relay/
RTMP сервер для приема и ретрансляции потоков на платформы.

**Ключевые файлы:**
- `src/index.ts` - Node-Media-Server конфигурация

### 📂 compositor/
Сервис композитинга видео через FFmpeg.

**Ключевые файлы:**
- `src/index.ts` - FFmpeg layouts и композитинг

### 📂 shared/
Общий код и типы для всех сервисов.

**Ключевые файлы:**
- `src/types.ts` - Shared TypeScript types
- `src/constants.ts` - Константы

### 📂 infrastructure/
Конфигурация инфраструктуры (Nginx, SSL, etc).

### 📂 scripts/
Утилиты для разработки и деплоя.

## Порты и сервисы

| Сервис | Порт | Описание |
|--------|------|----------|
| Frontend | 3000 | React приложение |
| Backend API | 4000 | REST API |
| Signaling Server | 5000 | WebSocket |
| Media Server | 6000 | Mediasoup HTTP API |
| Media Server RTC | 40000-49999 | WebRTC UDP/TCP |
| RTMP | 1935 | RTMP ingest |
| RTMP HTTP | 8888 | HLS/DASH |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| Nginx | 80/443 | Reverse proxy |

## Переменные окружения

### Global (.env)
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_SIGNALING_URL=ws://localhost:5000
VITE_MEDIA_SERVER_URL=http://localhost:6000
```

### Media Server (.env)
```env
RTC_MIN_PORT=40000
RTC_MAX_PORT=49999
ANNOUNCED_IP=127.0.0.1
```

## Технологический стек

### Frontend
- React 18 + TypeScript
- WebRTC API
- Canvas API
- Socket.io Client
- Zustand (State)
- Tailwind CSS
- Vite

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT

### Media
- Mediasoup (SFU)
- FFmpeg (Compositor)
- Node-Media-Server (RTMP)

### Infrastructure
- Docker + Docker Compose
- Nginx
- GitHub Actions (CI/CD)

## Команды

```bash
# Установка
npm run install:all

# Разработка
npm run dev

# Сборка
npm run build

# Тесты
npm run test

# Docker
docker-compose up -d
docker-compose down

# Make команды
make install
make dev
make start
make stop
```

---

**Структура организована для масштабируемости и поддерживаемости! 🚀**



