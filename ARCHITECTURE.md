# 🏗️ Архитектура StreamYard Clone

Детальное описание архитектуры и технических решений проекта.

## Обзор системы

StreamYard Clone — это полнофункциональная платформа для проведения прямых трансляций, построенная на микросервисной архитектуре.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Frontend (WebRTC + Canvas + Socket.io)       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      REVERSE PROXY                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Nginx Load Balancer                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │ Backend  │  │Signaling │  │   Media   │  │   RTMP   │  │
│  │   API    │  │  Server  │  │  Server   │  │  Relay   │  │
│  │(Express) │  │(Socket.io│  │(Mediasoup)│  │  (NMS)   │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA TIER                             │
│  ┌──────────────┐           ┌──────────────┐              │
│  │  PostgreSQL  │           │    Redis     │              │
│  │   Database   │           │    Cache     │              │
│  └──────────────┘           └──────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Компоненты системы

### 1. Frontend (React + TypeScript)

**Технологии:**
- React 18
- TypeScript
- WebRTC API
- Canvas API
- Socket.io Client
- Zustand (State Management)
- Tailwind CSS

**Основные модули:**

#### VideoGrid
Отображение участников трансляции с поддержкой различных layout'ов:
- Grid (сетка)
- Spotlight (основной спикер + малые окна)
- Sidebar (боковая панель)

#### ControlPanel
Панель управления трансляцией:
- Включение/выключение микрофона и камеры
- Screen sharing
- Запуск/остановка записи
- Начало/завершение трансляции

#### WebRTC Service
Управление WebRTC соединениями:
- getUserMedia для захвата локального медиа
- RTCPeerConnection для P2P соединений
- Интеграция с Mediasoup Client для SFU

#### Socket Service
WebSocket коммуникация:
- Подключение к signaling серверу
- Обмен SDP/ICE candidates
- Синхронизация состояния участников

### 2. Backend API (Node.js + Express)

**Технологии:**
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication

**API Endpoints:**

```
/api/auth
  POST   /register      - Регистрация
  POST   /login         - Вход
  GET    /me            - Текущий пользователь
  POST   /logout        - Выход

/api/broadcasts
  GET    /              - Список трансляций
  POST   /              - Создать трансляцию
  GET    /:id           - Получить трансляцию
  PATCH  /:id           - Обновить трансляцию
  DELETE /:id           - Удалить трансляцию
  POST   /:id/start     - Начать трансляцию
  POST   /:id/end       - Завершить трансляцию

/api/broadcasts/:id/destinations
  POST   /              - Добавить destination
  DELETE /:destId       - Удалить destination
  POST   /:destId/test  - Проверить подключение

/api/recordings
  GET    /              - Список записей
  GET    /:id           - Получить запись
  DELETE /:id           - Удалить запись

/api/upload
  POST   /              - Загрузка файлов
```

**Database Schema:**

```sql
Users
├─ id (uuid)
├─ email (unique)
├─ password (hashed)
├─ name
├─ avatar
├─ subscriptionTier
└─ timestamps

Broadcasts
├─ id (uuid)
├─ userId (foreign key)
├─ title
├─ description
├─ status (scheduled|live|ended)
├─ settings (json)
├─ startTime
├─ endTime
└─ timestamps

Destinations
├─ id (uuid)
├─ broadcastId (foreign key)
├─ platform (youtube|facebook|twitch)
├─ streamKey (encrypted)
├─ rtmpUrl
└─ status

Participants
├─ id (uuid)
├─ broadcastId (foreign key)
├─ userId (foreign key, nullable)
├─ name
├─ role (host|guest|viewer)
├─ audioEnabled
├─ videoEnabled
└─ timestamps

Recordings
├─ id (uuid)
├─ broadcastId
├─ userId (foreign key)
├─ title
├─ duration
├─ fileSize
├─ url
└─ timestamps
```

### 3. Signaling Server (Socket.io)

**Назначение:**
Координация WebRTC соединений между участниками

**Events:**

```typescript
// Client -> Server
join-broadcast          // Присоединение к комнате
leave-broadcast         // Выход из комнаты
webrtc-offer            // Отправка SDP offer
webrtc-answer           // Отправка SDP answer
ice-candidate           // Отправка ICE candidate
participant-status      // Обновление статуса
chat-message            // Сообщение в чат

// Server -> Client
participant-joined      // Новый участник
participant-left        // Участник вышел
participant-status-updated
webrtc-offer            // Получен offer
webrtc-answer           // Получен answer
ice-candidate           // Получен ICE candidate
broadcast-started       // Трансляция началась
broadcast-ended         // Трансляция завершена
chat-message            // Новое сообщение
```

**Room Management:**
```typescript
class RoomManager {
  private rooms: Map<broadcastId, Map<socketId, Participant>>
  
  addParticipant()
  removeParticipant()
  updateParticipant()
  getParticipants()
}
```

### 4. Media Server (Mediasoup)

**Назначение:**
SFU (Selective Forwarding Unit) для маршрутизации медиа потоков

**Архитектура:**

```
┌─────────────┐
│   Worker    │
│  (Process)  │
└─────────────┘
      │
      ├─ Router
      │   ├─ Transport (WebRTC)
      │   │   ├─ Producer (audio/video)
      │   │   └─ Consumer (audio/video)
      │   │
      │   └─ Transport (WebRTC)
      │       ├─ Producer
      │       └─ Consumer
```

**Codecs:**
- Audio: Opus (48kHz, stereo)
- Video: VP8, VP9, H.264

**API Endpoints:**
```
GET  /router/capabilities   - RTP capabilities
POST /transport/create      - Создать transport
POST /transport/connect     - Подключить transport
POST /transport/produce     - Начать передачу медиа
POST /transport/consume     - Начать прием медиа
```

### 5. RTMP Relay (Node-Media-Server)

**Назначение:**
Прием RTMP потока и ретрансляция на множество платформ (multistreaming)

**Flow:**
```
Compositor → RTMP Relay → YouTube
                        → Facebook
                        → Twitch
                        → Custom RTMP
```

**Features:**
- RTMP Ingest (порт 1935)
- HLS/DASH транскодинг
- HTTP-FLV streaming
- Multi-destination relay

**Configuration:**
```javascript
{
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
  },
  http: {
    port: 8888,
    allow_origin: '*',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [...]
  }
}
```

### 6. Compositor (FFmpeg)

**Назначение:**
Композитинг множества видео потоков в один выходной

**Layouts:**

**Grid (2x2):**
```
┌────────┬────────┐
│  User1 │  User2 │
├────────┼────────┤
│  User3 │  User4 │
└────────┴────────┘
```

**Spotlight:**
```
┌──────────────────┐
│                  │
│   Main Speaker   │
│                  │
│         ┌────────┤
│         │ Guest  │
└─────────┴────────┘
```

**FFmpeg Filter Complex:**
```bash
ffmpeg -i input1 -i input2 -i input3 -i input4 \
  -filter_complex "
    [0:v]scale=640:360[v0];
    [1:v]scale=640:360[v1];
    [2:v]scale=640:360[v2];
    [3:v]scale=640:360[v3];
    [v0][v1]hstack[top];
    [v2][v3]hstack[bottom];
    [top][bottom]vstack[out]
  " \
  -map "[out]" -c:v libx264 -preset veryfast \
  -f flv rtmp://localhost/live/stream
```

## Поток данных

### WebRTC Connection Flow

```
1. User joins broadcast
   ↓
2. Frontend requests RTP capabilities from Media Server
   ↓
3. Frontend creates Mediasoup Device with capabilities
   ↓
4. Frontend creates Send Transport
   ↓
5. Frontend produces audio/video tracks
   ↓
6. Other participants create Recv Transport
   ↓
7. Other participants consume the tracks
   ↓
8. Media flows through SFU to all participants
```

### Broadcast Start Flow

```
1. User clicks "Go Live"
   ↓
2. Frontend sends start-broadcast event to Signaling Server
   ↓
3. Signaling Server notifies all participants
   ↓
4. Compositor starts combining streams
   ↓
5. Compositor sends composite stream to RTMP Relay
   ↓
6. RTMP Relay distributes to all destinations
   ↓
7. Stream goes live on YouTube/Facebook/Twitch
```

## Масштабирование

### Горизонтальное масштабирование

**Media Servers:**
- Несколько Media Server инстансов
- Load balancing через Nginx
- Redis для синхронизации состояния

**Backend API:**
- Stateless design
- Легко масштабируется горизонтально
- Session storage в Redis

**Database:**
- PostgreSQL read replicas
- Connection pooling (PgBouncer)
- Sharding по userId

### Вертикальное масштабирование

**Media Server:**
- Увеличение CPU cores для encoding
- Больше RAM для buffering
- SSD для HLS segments

**RTMP Relay:**
- Более мощный CPU для FFmpeg
- Высокая пропускная способность сети

## Безопасность

### Аутентификация
- JWT tokens
- Refresh tokens в Redis
- HttpOnly cookies

### Авторизация
- Role-based access control (RBAC)
- Владелец broadcast может управлять
- Гости имеют ограниченные права

### WebRTC Security
- DTLS-SRTP encryption
- ICE candidate filtering
- TURN server с аутентификацией

### Data Protection
- Шифрование stream keys в БД
- HTTPS/WSS в production
- Rate limiting на API endpoints

## Мониторинг и логирование

### Metrics
- Количество активных broadcasts
- Количество участников
- CPU/Memory usage
- Network bandwidth
- WebRTC connection quality

### Logging
- Morgan для HTTP логов
- Winston для application логов
- Mediasoup debug logs
- FFmpeg encoding logs

### Alerting
- CPU > 80%
- Memory > 90%
- Disk space < 10%
- Connection failures

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading компонентов
- Canvas rendering optimization
- WebRTC simulcast

### Backend
- Database query optimization
- Redis caching
- Connection pooling
- Gzip compression

### Media
- Adaptive bitrate
- Simulcast (multiple qualities)
- Jitter buffers
- Packet loss recovery

## Будущие улучшения

1. **AI Features:**
   - Виртуальные фоны (BodyPix/MediaPipe)
   - Auto-framing
   - Noise cancellation

2. **Advanced Features:**
   - Picture-in-picture
   - Lower thirds (баннеры)
   - Transition effects
   - Green screen

3. **Analytics:**
   - Real-time viewer analytics
   - Engagement metrics
   - Heatmaps

4. **Cloud Recording:**
   - AWS S3 integration
   - Auto-transcoding
   - Thumbnail generation

5. **CDN Integration:**
   - CloudFlare Stream
   - AWS CloudFront
   - Edge caching

---

**Архитектура постоянно развивается и совершенствуется! 🚀**



