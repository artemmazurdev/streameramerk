# ⚡ Quick Start Guide

Быстрая установка и запуск StreamYard Clone за 5 минут.

## 🚀 Самый быстрый способ (Docker)

### 1. Предварительные требования

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Запуск

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/streamyard-clone.git
cd streamyard-clone

# Запустить все сервисы
docker-compose up -d

# Подождать ~30 секунд для инициализации
# Проверить статус
docker-compose ps
```

### 3. Открыть приложение

Откройте в браузере: **http://localhost:3000**

### 4. Тестовый аккаунт

После запуска вы можете:
- Создать новый аккаунт через регистрацию
- Или использовать тестовый (если запущен seed):
  - Email: `test@example.com`
  - Password: `password123`

## 💻 Альтернативный способ (без Docker)

### 1. Предварительные требования

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- FFmpeg

### 2. Быстрая установка

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/streamyard-clone.git
cd streamyard-clone

# Запустить setup скрипт
chmod +x scripts/setup.sh
./scripts/setup.sh

# Или установить вручную
npm install
npm run install:all
```

### 3. Настроить базу данных

```bash
# Создать БД
sudo -u postgres psql
CREATE DATABASE streamyard;
CREATE USER streamyard WITH PASSWORD 'streamyard_password';
GRANT ALL PRIVILEGES ON DATABASE streamyard TO streamyard;
\q

# Запустить миграции
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Запустить сервисы

```bash
# Вариант 1: Все сервисы одной командой
npm run dev

# Вариант 2: Каждый сервис отдельно (5 терминалов)
cd backend && npm run dev
cd signaling-server && npm run dev
cd media-server && npm run dev
cd rtmp-relay && npm run dev
cd frontend && npm run dev
```

### 5. Открыть приложение

Откройте в браузере: **http://localhost:3000**

## 🎯 Первые шаги

### Создание трансляции

1. Зарегистрируйтесь или войдите
2. Нажмите **"Создать трансляцию"**
3. Разрешите доступ к камере и микрофону
4. Нажмите **"Начать трансляцию"**

### Добавление destinations

1. В настройках трансляции нажмите **"Добавить destination"**
2. Выберите платформу (YouTube, Facebook, Twitch)
3. Введите Stream Key и RTMP URL
4. Сохраните

### Приглашение гостей

1. Скопируйте ссылку на трансляцию
2. Отправьте гостям
3. Гости присоединятся без регистрации

## 🔍 Проверка работы

### Проверка сервисов

```bash
# Health checks
curl http://localhost:4000/health   # Backend API
curl http://localhost:5000/health   # Signaling Server
curl http://localhost:6000/health   # Media Server
curl http://localhost:8888/         # RTMP Relay

# Или используйте скрипт
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

### Проверка портов

```bash
chmod +x scripts/check-ports.sh
./scripts/check-ports.sh
```

## 🛠️ Полезные команды

```bash
# Просмотр логов (Docker)
docker-compose logs -f

# Перезапуск сервисов
docker-compose restart

# Остановка
docker-compose down

# Полная очистка (включая volumes)
docker-compose down -v
```

## ❓ Troubleshooting

### Порты заняты

```bash
# Проверить какой процесс использует порт
sudo lsof -i :3000
sudo lsof -i :4000

# Убить процесс
sudo kill -9 <PID>
```

### База данных не подключается

```bash
# Проверить PostgreSQL
sudo systemctl status postgresql

# Перезапустить PostgreSQL
sudo systemctl restart postgresql
```

### Redis не работает

```bash
# Проверить Redis
redis-cli ping
# Должен вернуть: PONG

# Перезапустить Redis
sudo systemctl restart redis
```

### WebRTC не подключается

1. Разрешите доступ к камере/микрофону в браузере
2. Проверьте firewall
3. Убедитесь что порты 40000-49999 UDP открыты
4. Проверьте `ANNOUNCED_IP` в media-server/.env

## 📚 Дальнейшее чтение

- [Полная инструкция по установке](INSTALLATION.md)
- [Архитектура проекта](ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md)

## 💬 Получить помощь

- GitHub Issues: https://github.com/yourusername/streamyard-clone/issues
- Discord: https://discord.gg/yourinvite
- Email: support@yourdomain.com

---

**Готово! Теперь вы можете стримить! 🎉**



