#!/bin/bash

# Docker Deployment script for compro.uz
# This script automates the deployment process using Docker Compose

set -e  # Exit on error

echo "======================================"
echo "  Docker Deployment - compro.uz"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/compro"
BACKUP_DIR="/opt/backups/compro"
DATE=$(date +%Y%m%d_%H%M%S)

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Error: Do not run this script as root${NC}"
   exit 1
fi

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed"
    exit 1
fi

# Determine docker compose command
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

print_success "Using: $DOCKER_COMPOSE"

# Navigate to application directory
cd "$APP_DIR" || exit 1
print_success "Changed to application directory: $APP_DIR"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup current .env file
print_info "Backing up .env file..."
if [ -f .env ]; then
    cp .env "$BACKUP_DIR/.env.$DATE"
    print_success ".env backed up"
fi

# Pull latest code
print_info "Pulling latest code from repository..."
git pull origin main
print_success "Code updated"

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "Please create .env file from .env.production template"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a
print_success "Environment variables loaded"

# Stop running containers
print_info "Stopping running containers..."
$DOCKER_COMPOSE -f docker-compose.prod.yml down
print_success "Containers stopped"

# Remove old images (optional - uncomment if you want to rebuild from scratch)
# print_info "Removing old images..."
# docker image prune -af
# print_success "Old images removed"

# Build new images
print_info "Building Docker images..."
$DOCKER_COMPOSE -f docker-compose.prod.yml build --no-cache
print_success "Images built"

# Start postgres first
print_info "Starting PostgreSQL database..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d postgres
print_success "PostgreSQL started"

# Wait for postgres to be healthy
print_info "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker inspect compro-db-prod --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
        print_success "PostgreSQL is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "PostgreSQL failed to become healthy"
        print_info "PostgreSQL logs:"
        $DOCKER_COMPOSE -f docker-compose.prod.yml logs postgres
        exit 1
    fi
    echo "Waiting for database to be healthy... (attempt $i/30)"
    sleep 2
done

# Run database migrations
print_info "Running database migrations..."
$DOCKER_COMPOSE -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy
print_success "Migrations completed"

# Start all containers
print_info "Starting all containers..."
$DOCKER_COMPOSE -f docker-compose.prod.yml up -d
print_success "All containers started"

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check container status
print_info "Checking container status..."
$DOCKER_COMPOSE -f docker-compose.prod.yml ps

# Check if all containers are running
RUNNING_CONTAINERS=$($DOCKER_COMPOSE -f docker-compose.prod.yml ps --services --filter "status=running" | wc -l)
TOTAL_CONTAINERS=$($DOCKER_COMPOSE -f docker-compose.prod.yml ps --services | wc -l)

if [ "$RUNNING_CONTAINERS" -eq "$TOTAL_CONTAINERS" ]; then
    print_success "All containers are running ($RUNNING_CONTAINERS/$TOTAL_CONTAINERS)"
else
    print_error "Some containers failed to start ($RUNNING_CONTAINERS/$TOTAL_CONTAINERS)"
    echo ""
    echo "Check logs with: $DOCKER_COMPOSE -f docker-compose.prod.yml logs"
    exit 1
fi

# Show container logs (last 20 lines)
print_info "Recent logs:"
$DOCKER_COMPOSE -f docker-compose.prod.yml logs --tail=20

echo ""
echo "======================================"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo "======================================"
echo ""
echo "URLs:"
echo "  Frontend:  https://compro.uz"
echo "  API:       https://api.compro.uz"
echo "  Dashboard: https://dashboard.compro.uz"
echo ""
echo "Useful commands:"
echo "  View logs:        $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f"
echo "  Restart:          $DOCKER_COMPOSE -f docker-compose.prod.yml restart"
echo "  Stop:             $DOCKER_COMPOSE -f docker-compose.prod.yml down"
echo "  Container status: $DOCKER_COMPOSE -f docker-compose.prod.yml ps"
echo ""
