#!/bin/bash

echo "🚀 Starting Commercial Real Estate Platform..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start all services
echo "📦 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Platform is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Dashboard: http://localhost:3002"
echo "   Backend:   http://localhost:3001"
echo "   API Docs:  http://localhost:3001/api"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop all:  docker-compose down"
echo ""
