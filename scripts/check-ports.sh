#!/bin/bash

# Check if required ports are available

echo "🔍 Checking required ports..."

PORTS=(3000 4000 5000 6000 1935 8888 5432 6379)
PORT_NAMES=("Frontend" "Backend API" "Signaling Server" "Media Server" "RTMP" "RTMP HTTP" "PostgreSQL" "Redis")

ALL_AVAILABLE=true

for i in "${!PORTS[@]}"; do
    PORT=${PORTS[$i]}
    NAME=${PORT_NAMES[$i]}
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "❌ Port $PORT ($NAME) is already in use"
        echo "   Process: $(lsof -Pi :$PORT -sTCP:LISTEN | tail -n 1)"
        ALL_AVAILABLE=false
    else
        echo "✅ Port $PORT ($NAME) is available"
    fi
done

echo ""

if [ "$ALL_AVAILABLE" = true ]; then
    echo "✅ All required ports are available!"
    exit 0
else
    echo "❌ Some ports are in use. Stop the processes or change ports in .env files."
    exit 1
fi



