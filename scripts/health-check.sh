#!/bin/bash

# Health check for all services

echo "🏥 Running health checks..."

check_service() {
    SERVICE_NAME=$1
    URL=$2
    
    if curl -f -s "$URL" > /dev/null 2>&1; then
        echo "✅ $SERVICE_NAME is healthy"
        return 0
    else
        echo "❌ $SERVICE_NAME is not responding"
        return 1
    fi
}

ALL_HEALTHY=true

# Check Frontend
if ! check_service "Frontend" "http://localhost:3000"; then
    ALL_HEALTHY=false
fi

# Check Backend API
if ! check_service "Backend API" "http://localhost:4000/health"; then
    ALL_HEALTHY=false
fi

# Check Signaling Server
if ! check_service "Signaling Server" "http://localhost:5000/health"; then
    ALL_HEALTHY=false
fi

# Check Media Server
if ! check_service "Media Server" "http://localhost:6000/health"; then
    ALL_HEALTHY=false
fi

# Check RTMP Relay
if ! check_service "RTMP Relay" "http://localhost:8888/"; then
    ALL_HEALTHY=false
fi

# Check PostgreSQL
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL is healthy"
else
    echo "❌ PostgreSQL is not responding"
    ALL_HEALTHY=false
fi

# Check Redis
if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis is not responding"
    ALL_HEALTHY=false
fi

echo ""

if [ "$ALL_HEALTHY" = true ]; then
    echo "✅ All services are healthy!"
    exit 0
else
    echo "❌ Some services are not responding"
    exit 1
fi



