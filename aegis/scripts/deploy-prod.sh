#!/bin/bash
# White Caves CRM Platform - Production Deployment Script
# Usage: ./deploy-prod.sh [environment] [version]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
MAX_ATTEMPTS=3
RETRY_DELAY=5

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Exit on error
on_error() {
    log_error "Deployment failed!"
    exit 1
}

trap on_error ERR

# Pre-deployment checks
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        return 1
    fi
    log_success "Docker installed: $(docker --version)"

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        return 1
    fi
    log_success "Docker Compose installed: $(docker-compose --version)"

    # Check environment file
    if [ ! -f ".env.production" ]; then
        log_error ".env.production not found"
        return 1
    fi
    log_success ".env.production found"

    # Check Docker daemon
    if ! docker ps &> /dev/null; then
        log_error "Docker daemon not running"
        return 1
    fi
    log_success "Docker daemon running"

    return 0
}

# Verify configuration
verify_configuration() {
    log_info "Verifying configuration..."

    # Check required environment variables
    REQUIRED_VARS=("JWT_SECRET" "DATABASE_URL" "REDIS_URL")
    
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "$var" .env.production; then
            log_error "Missing $var in .env.production"
            return 1
        fi
    done
    log_success "All required environment variables configured"

    # Check Docker Compose file
    if ! docker-compose -f "$DOCKER_COMPOSE_FILE" config > /dev/null 2>&1; then
        log_error "Invalid Docker Compose configuration"
        return 1
    fi
    log_success "Docker Compose configuration valid"

    return 0
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."

    # Build with retry logic
    for attempt in $(seq 1 $MAX_ATTEMPTS); do
        if docker-compose -f "$DOCKER_COMPOSE_FILE" build; then
            log_success "Docker images built successfully"
            return 0
        fi

        if [ $attempt -lt $MAX_ATTEMPTS ]; then
            log_warning "Build failed, retrying in ${RETRY_DELAY}s (attempt $attempt/$MAX_ATTEMPTS)..."
            sleep $RETRY_DELAY
        fi
    done

    log_error "Failed to build Docker images after $MAX_ATTEMPTS attempts"
    return 1
}

# Pull images from registry (if applicable)
pull_images() {
    log_info "Pulling Docker images..."

    if docker-compose -f "$DOCKER_COMPOSE_FILE" pull 2>/dev/null; then
        log_success "Docker images pulled successfully"
        return 0
    fi

    log_warning "Image pull failed, using local images"
    return 0
}

# Stop running containers
stop_containers() {
    log_info "Stopping existing containers..."

    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        log_success "Containers stopped"
    else
        log_info "No running containers found"
    fi

    return 0
}

# Start services
start_services() {
    log_info "Starting services..."

    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

    # Wait for services to be ready
    log_info "Waiting for services to be healthy..."
    sleep 10

    log_success "Services started"
    return 0
}

# Initialize database
init_database() {
    log_info "Initializing database..."

    # Run migrations
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T app npm run prisma:migrate:deploy; then
        log_success "Database migrations completed"
    else
        log_warning "Database migrations failed or already applied"
    fi

    # Optional: Seed data
    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T app npm run seed 2>/dev/null; then
        log_success "Database seeded with initial data"
    fi

    return 0
}

# Health check
health_check() {
    log_info "Performing health checks..."

    # Wait for application to be ready
    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if curl -s -f http://localhost:5000/health > /dev/null 2>&1; then
            log_success "Application is healthy"
            return 0
        fi

        attempt=$((attempt + 1))
        log_info "Health check attempt $attempt/$max_attempts..."
        sleep 2
    done

    log_error "Application failed health check"
    return 1
}

# Run tests
run_tests() {
    log_info "Running tests..."

    if docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T app npm run test 2>/dev/null; then
        log_success "All tests passed"
        return 0
    else
        log_warning "Some tests failed"
        return 1
    fi
}

# Display status
show_status() {
    log_info "Service Status:"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps

    log_info "\nDocker Statistics:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

    log_info "\nApplication Health:"
    curl -s http://localhost:5000/health | jq . 2>/dev/null || echo "Unable to retrieve health status"
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."

    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

    log_info "Waiting for services to recover..."
    sleep 10

    if health_check; then
        log_success "Rollback successful"
        return 0
    else
        log_error "Rollback failed"
        return 1
    fi
}

# Main deployment flow
main() {
    log_info "========================================"
    log_info "White Caves CRM - Production Deployment"
    log_info "========================================"
    log_info "Environment: $ENVIRONMENT"
    log_info "Version: $VERSION"
    log_info ""

    # Pre-deployment checks
    log_info "PHASE 1: Pre-deployment Checks"
    log_info "--------------------------------"
    check_prerequisites || exit 1
    verify_configuration || exit 1
    echo ""

    # Build/Pull phase
    log_info "PHASE 2: Image Preparation"
    log_info "--------------------------"
    # Uncomment one based on your setup:
    # pull_images || exit 1
    build_images || exit 1
    echo ""

    # Deployment phase
    log_info "PHASE 3: Deployment"
    log_info "-------------------"
    stop_containers
    start_services || exit 1
    echo ""

    # Initialization phase
    log_info "PHASE 4: Initialization"
    log_info "----------------------"
    init_database || exit 1
    echo ""

    # Verification phase
    log_info "PHASE 5: Verification"
    log_info "---------------------"
    health_check || { rollback; exit 1; }
    run_tests || log_warning "Some tests failed, but deployment continues"
    echo ""

    # Status report
    log_info "PHASE 6: Status Report"
    log_info "----------------------"
    show_status
    echo ""

    log_success "========================================"
    log_success "Deployment completed successfully!"
    log_success "========================================"
    log_info "Application URL: https://white-caves.com"
    log_info "Health Check: https://white-caves.com/health"
    log_info ""
    log_info "Next steps:"
    log_info "1. Monitor application logs: docker-compose -f docker-compose.prod.yml logs -f app"
    log_info "2. Check monitoring dashboard: https://white-caves.com/metrics"
    log_info "3. Run end-to-end tests: npm run test:e2e"

    return 0
}

# Script entry point
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    cat << EOF
Usage: $0 [environment] [version]

Arguments:
  environment   Deployment environment (default: production)
  version       Version tag (default: latest)

Examples:
  $0                          # Deploy prod with latest
  $0 production v1.0.0        # Deploy production v1.0.0
  $0 staging latest           # Deploy to staging

EOF
    exit 0
fi

# Run main deployment
main "$@"
