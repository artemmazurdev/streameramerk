#!/bin/bash

# StreamYard Clone Setup Script
# This script sets up the development environment

set -e

echo "🚀 StreamYard Clone - Setup Script"
echo "=================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   Install it or use Docker Compose."
else
    echo "✅ PostgreSQL version: $(psql --version)"
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis is not installed or not in PATH."
    echo "   Install it or use Docker Compose."
else
    echo "✅ Redis version: $(redis-cli --version)"
fi

# Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg is not installed or not in PATH."
    echo "   Some features may not work."
else
    echo "✅ FFmpeg version: $(ffmpeg -version | head -n1)"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📦 Installing workspace dependencies..."
npm run install:all

# Setup environment files
echo ""
echo "⚙️  Setting up environment files..."

if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from example..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "backend/.env.example not found, skipping..."
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend/.env..."
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:4000
VITE_SIGNALING_URL=ws://localhost:5000
VITE_MEDIA_SERVER_URL=http://localhost:6000
EOF
fi

if [ ! -f signaling-server/.env ]; then
    echo "Creating signaling-server/.env..."
    cat > signaling-server/.env << EOF
NODE_ENV=development
PORT=5000
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
EOF
fi

if [ ! -f media-server/.env ]; then
    echo "Creating media-server/.env..."
    cat > media-server/.env << EOF
NODE_ENV=development
PORT=6000
RTC_MIN_PORT=40000
RTC_MAX_PORT=49999
ANNOUNCED_IP=127.0.0.1
EOF
fi

# Setup database
echo ""
echo "🗄️  Setting up database..."
if command -v psql &> /dev/null; then
    echo "Running Prisma migrations..."
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init 2>/dev/null || echo "Migrations already applied or database not available"
    cd ..
else
    echo "⚠️  PostgreSQL not available. Run 'make db-migrate' after starting PostgreSQL."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start PostgreSQL and Redis (or use 'docker-compose up postgres redis -d')"
echo "  2. Run 'npm run dev' to start all services"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
echo "For Docker setup, run: docker-compose up -d"



