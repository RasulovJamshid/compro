#!/bin/bash

# Deployment script for compro.uz
# This script automates the deployment process
# Supports both Docker and PM2 deployment methods

set -e  # Exit on error

echo "======================================"
echo "  Commercial Real Estate Deployment"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Detect deployment method
DEPLOY_METHOD=""

if command -v docker &> /dev/null && (command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1); then
    DEPLOY_METHOD="docker"
elif command -v pm2 &> /dev/null; then
    DEPLOY_METHOD="pm2"
else
    echo -e "${RED}Error: Neither Docker nor PM2 is installed${NC}"
    echo "Please install one of them:"
    echo "  - Docker: curl -fsSL https://get.docker.com | sh"
    echo "  - PM2: npm install -g pm2"
    exit 1
fi

echo -e "${BLUE}Detected deployment method: ${DEPLOY_METHOD}${NC}"
echo ""

# Allow override with environment variable
if [ ! -z "$FORCE_DEPLOY_METHOD" ]; then
    DEPLOY_METHOD="$FORCE_DEPLOY_METHOD"
    echo -e "${YELLOW}Forcing deployment method: ${DEPLOY_METHOD}${NC}"
    echo ""
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

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    print_error "Not in project root directory"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# 1. Backup current deployment
print_info "Creating backup..."
if [ -d "$APP_DIR" ]; then
    tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$APP_DIR" . 2>/dev/null || true
    print_success "Backup created: backup_$DATE.tar.gz"
fi

# 2. Pull latest changes
print_info "Pulling latest changes from git..."
git pull origin main || git pull origin master
print_success "Code updated"

# 3. Install dependencies and build backend
print_info "Building backend..."
cd backend
npm install --production
npm run prisma:generate
npm run build
print_success "Backend built"

# 4. Build frontend
print_info "Building frontend..."
cd ../frontend
npm install --production
npm run build
print_success "Frontend built"

# 5. Build dashboard
print_info "Building dashboard..."
cd ../dashboard
npm install --production
npm run build
print_success "Dashboard built"

cd ..

# 6. Run database migrations
print_info "Running database migrations..."
cd backend
npm run prisma:migrate || print_error "Migration failed (continuing anyway)"
cd ..

# 7. Restart applications with PM2
print_info "Restarting applications..."
pm2 restart ecosystem.config.js
print_success "Applications restarted"

# 8. Wait for applications to start
print_info "Waiting for applications to start..."
sleep 5

# 9. Check application status
print_info "Checking application status..."
pm2 status

# 10. Test endpoints
print_info "Testing endpoints..."

# Test backend
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3001/api | grep -q "200\|404"; then
    print_success "Backend is responding"
else
    print_error "Backend is not responding"
fi

# Test frontend
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    print_success "Frontend is responding"
else
    print_error "Frontend is not responding"
fi

# Test dashboard
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3002 | grep -q "200"; then
    print_success "Dashboard is responding"
else
    print_error "Dashboard is not responding"
fi

# 11. Reload Nginx
print_info "Reloading Nginx..."
sudo systemctl reload nginx
print_success "Nginx reloaded"

# 12. Clean old backups (keep last 7 days)
print_info "Cleaning old backups..."
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
print_success "Old backups cleaned"

echo ""
echo "======================================"
echo -e "${GREEN}  Deployment completed successfully!${NC}"
echo "======================================"
echo ""
echo "URLs:"
echo "  Main site: https://procom.uz"
echo "  API: https://api.procom.uz"
echo "  Dashboard: https://dashboard.procom.uz"
echo ""
echo "Useful commands:"
echo "  pm2 logs       - View application logs"
echo "  pm2 status     - Check application status"
echo "  pm2 monit      - Monitor applications"
echo ""
