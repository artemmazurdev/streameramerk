.PHONY: help install dev build start stop clean test

help:
	@echo "StreamYard Clone - Available commands:"
	@echo "  make install     - Install all dependencies"
	@echo "  make dev         - Run in development mode"
	@echo "  make build       - Build all projects"
	@echo "  make start       - Start all services with Docker"
	@echo "  make stop        - Stop all Docker services"
	@echo "  make clean       - Clean node_modules and build files"
	@echo "  make test        - Run all tests"
	@echo "  make logs        - View Docker logs"
	@echo "  make db-migrate  - Run database migrations"
	@echo "  make db-seed     - Seed database with test data"

install:
	@echo "Installing dependencies..."
	npm run install:all

dev:
	@echo "Starting development servers..."
	npm run dev

build:
	@echo "Building all projects..."
	npm run build

start:
	@echo "Starting Docker services..."
	docker-compose up -d

stop:
	@echo "Stopping Docker services..."
	docker-compose down

clean:
	@echo "Cleaning project..."
	npm run clean
	rm -rf */dist */build

test:
	@echo "Running tests..."
	npm run test

logs:
	@echo "Viewing Docker logs..."
	docker-compose logs -f

db-migrate:
	@echo "Running database migrations..."
	cd backend && npx prisma migrate dev

db-seed:
	@echo "Seeding database..."
	cd backend && npx prisma db seed

restart:
	@echo "Restarting services..."
	docker-compose restart

status:
	@echo "Service status..."
	docker-compose ps



