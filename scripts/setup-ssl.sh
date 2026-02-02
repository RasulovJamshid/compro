#!/bin/bash

# SSL Setup Script for compro.uz using Let's Encrypt
# This script automates SSL certificate installation

set -e

echo "======================================"
echo "  SSL Certificate Setup for compro.uz"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Error: Please run as root (use sudo)${NC}"
   exit 1
fi

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Configuration
DOMAIN="compro.uz"
EMAIL="admin@compro.uz"  # Change this to your email

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    print_info "Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installed"
else
    print_success "Certbot already installed"
fi

# Stop Nginx temporarily
print_info "Stopping Nginx temporarily..."
systemctl stop nginx

# Obtain SSL certificate
print_info "Obtaining SSL certificate for $DOMAIN and subdomains..."
certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    -d api.$DOMAIN \
    -d dashboard.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    print_success "SSL certificate obtained successfully"
else
    print_error "Failed to obtain SSL certificate"
    systemctl start nginx
    exit 1
fi

# Create SSL directories
print_info "Setting up SSL directories..."
mkdir -p /etc/ssl/certs /etc/ssl/private

# Create symbolic links
print_info "Creating symbolic links..."
ln -sf /etc/letsencrypt/live/$DOMAIN/fullchain.pem /etc/ssl/certs/$DOMAIN.crt
ln -sf /etc/letsencrypt/live/$DOMAIN/privkey.pem /etc/ssl/private/$DOMAIN.key
ln -sf /etc/letsencrypt/live/$DOMAIN/chain.pem /etc/ssl/certs/ca-bundle.crt

print_success "Symbolic links created"

# Set proper permissions
print_info "Setting permissions..."
chmod 644 /etc/ssl/certs/$DOMAIN.crt
chmod 600 /etc/ssl/private/$DOMAIN.key
chmod 644 /etc/ssl/certs/ca-bundle.crt

print_success "Permissions set"

# Test Nginx configuration
print_info "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration has errors"
    exit 1
fi

# Start Nginx
print_info "Starting Nginx..."
systemctl start nginx
print_success "Nginx started"

# Set up auto-renewal
print_info "Setting up automatic renewal..."

# Create renewal hook script
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# Test renewal
print_info "Testing certificate renewal..."
certbot renew --dry-run

if [ $? -eq 0 ]; then
    print_success "Certificate renewal test passed"
else
    print_error "Certificate renewal test failed"
fi

# Display certificate information
print_info "Certificate information:"
certbot certificates

echo ""
echo "======================================"
echo -e "${GREEN}  SSL Setup completed successfully!${NC}"
echo "======================================"
echo ""
echo "Certificate locations:"
echo "  Certificate: /etc/ssl/certs/$DOMAIN.crt"
echo "  Private Key: /etc/ssl/private/$DOMAIN.key"
echo "  CA Bundle: /etc/ssl/certs/ca-bundle.crt"
echo ""
echo "Certificates will auto-renew before expiration."
echo ""
echo "Test your SSL configuration at:"
echo "  https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
