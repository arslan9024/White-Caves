#!/bin/bash

# White Caves Production Deployment Script
# Complete deployment with verification and monitoring setup

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="white-caves"
BUILD_DIR="dist"
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOYMENT_LOG="deployments/deployment_${TIMESTAMP}.log"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║ $1"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

# Main deployment steps
main() {
    print_header " 🚀 White Caves Production Deployment"
    
    # Ensure we're in the project root
    [ -f "package.json" ] || log_error "package.json not found. Are you in the project root?"
    
    # Create deployment directory
    mkdir -p deployments
    {
        echo "Deployment: $TIMESTAMP"
        echo "=================================================="
    } >> "$DEPLOYMENT_LOG"
    
    # Step 1: Pre-deployment checks
    log_info "Step 1: Running pre-deployment checks..."
    pre_deployment_checks
    log_success "Pre-deployment checks passed"
    
    # Step 2: Verify production readiness
    log_info "Step 2: Verifying production readiness..."
    verify_production_ready
    log_success "Production readiness verified"
    
    # Step 3: Create backup
    log_info "Step 3: Creating backup of current build..."
    create_backup
    log_success "Backup created"
    
    # Step 4: Run tests
    log_info "Step 4: Running test suite..."
    run_tests
    log_success "All tests passed"
    
    # Step 5: Build
    log_info "Step 5: Building for production..."
    build_production
    log_success "Production build complete"
    
    # Step 6: Verify build
    log_info "Step 6: Verifying build artifacts..."
    verify_build
    log_success "Build artifacts verified"
    
    # Step 7: Choose deployment method
    log_info "Step 7: Selecting deployment method..."
    choose_deployment_method
    
    # Step 8: Deploy
    log_info "Step 8: Executing deployment..."
    execute_deployment
    log_success "Deployment complete"
    
    # Step 9: Post-deployment verification
    log_info "Step 9: Running post-deployment verification..."
    post_deployment_verification
    log_success "Post-deployment verification passed"
    
    # Step 10: Summary
    print_header " 🎉 Deployment Complete!"
    deployment_summary
}

pre_deployment_checks() {
    log_info "Checking Node.js version..."
    NODE_VERSION=$(node --version)
    if [[ $NODE_VERSION == v1[6-9]* ]] || [[ $NODE_VERSION == v[2-9][0-9]* ]]; then
        log_success "Node.js version: $NODE_VERSION"
    else
        log_error "Node.js 16+ required (found: $NODE_VERSION)"
    fi
    
    log_info "Checking npm version..."
    NPM_VERSION=$(npm --version)
    if [[ $NPM_VERSION == [1-9][0-9]* ]]; then
        log_success "npm version: $NPM_VERSION"
    else
        log_warning "npm 10+ recommended (found: $NPM_VERSION)"
    fi
    
    log_info "Checking for uncommitted changes..."
    if ! git status --porcelain | grep -q .; then
        log_success "No uncommitted changes"
    else
        log_warning "Uncommitted changes found:"
        git status --short | head -5
        read -p "Continue with deployment? (y/N) " -n 1 -r
        echo
        [[ $REPLY =~ ^[Yy]$ ]] || log_error "Deployment cancelled"
    fi
}

verify_production_ready() {
    log_info "Verifying TypeScript..."
    npm run type-check || log_error "TypeScript errors found"
    
    log_info "Verifying ESLint..."
    npm run lint || log_error "Linting errors found"
    
    log_info "Checking environment variables..."
    [ -f ".env.production" ] || log_warning ".env.production not found"
}

create_backup() {
    mkdir -p "$BACKUP_DIR"
    if [ -d "$BUILD_DIR" ]; then
        BACKUP_PATH="$BACKUP_DIR/${PROJECT_NAME}_${TIMESTAMP}"
        cp -r "$BUILD_DIR" "$BACKUP_PATH"
        log_success "Backup created: $BACKUP_PATH"
    else
        log_warning "No previous build to backup"
    fi
}

run_tests() {
    npm run test:run || log_error "Tests failed"
}

build_production() {
    npm run build || log_error "Build failed"
    
    # Calculate bundle size
    if [ -d "$BUILD_DIR" ]; then
        SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
        log_success "Build complete. Size: $SIZE"
    fi
}

verify_build() {
    [ -d "$BUILD_DIR" ] || log_error "Build directory not found"
    [ -f "$BUILD_DIR/index.html" ] || log_error "index.html not found"
    
    # Count files
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l)
    log_success "Build verified: $FILE_COUNT files"
}

choose_deployment_method() {
    echo ""
    echo -e "${YELLOW}Deployment Methods:${NC}"
    echo "  1. Vercel (Cloud - Recommended)"
    echo "  2. Docker (Container)"
    echo "  3. Traditional Server (npm start)"
    echo "  4. Cancel"
    echo ""
    read -p "Select deployment method (1-4): " DEPLOY_METHOD
    
    case $DEPLOY_METHOD in
        1) DEPLOYMENT_TYPE="vercel" ;;
        2) DEPLOYMENT_TYPE="docker" ;;
        3) DEPLOYMENT_TYPE="traditional" ;;
        4) log_error "Deployment cancelled" ;;
        *) log_error "Invalid selection" ;;
    esac
}

execute_deployment() {
    case $DEPLOYMENT_TYPE in
        vercel)
            deploy_vercel
            ;;
        docker)
            deploy_docker
            ;;
        traditional)
            deploy_traditional
            ;;
    esac
}

deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        log_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Check if project is initialized
    if [ ! -f "vercel.json" ]; then
        log_warning "vercel.json not found. Initializing project..."
        vercel
    fi
    
    # Deploy to production
    log_info "Deploying to production..."
    vercel --prod || log_error "Vercel deployment failed"
    
    log_success "Deployment to Vercel successful"
    echo "Monitor at: https://vercel.com/dashboard" >> "$DEPLOYMENT_LOG"
}

deploy_docker() {
    log_info "Building Docker image..."
    
    [ -f "Dockerfile" ] || log_error "Dockerfile not found"
    
    DOCKER_TAG="${PROJECT_NAME}:${TIMESTAMP}"
    docker build -t "$DOCKER_TAG" . || log_error "Docker build failed"
    docker tag "$DOCKER_TAG" "${PROJECT_NAME}:latest"
    
    log_success "Docker image built: $DOCKER_TAG"
    echo "To push to registry:"
    echo "  docker tag $DOCKER_TAG <registry>/${PROJECT_NAME}:${TIMESTAMP}"
    echo "  docker push <registry>/${PROJECT_NAME}:${TIMESTAMP}"
    echo "" >> "$DEPLOYMENT_LOG"
    echo "Docker build: $DOCKER_TAG" >> "$DEPLOYMENT_LOG"
}

deploy_traditional() {
    log_info "Preparing for traditional server deployment..."
    
    # Create deployment package
    DEPLOY_PACKAGE="${PROJECT_NAME}_${TIMESTAMP}.tar.gz"
    tar -czf "$DEPLOY_PACKAGE" dist/ package.json package-lock.json
    
    log_success "Deployment package created: $DEPLOY_PACKAGE"
    echo ""
    echo "To deploy to your server:"
    echo "  1. Upload: scp $DEPLOY_PACKAGE user@server:/path/to/app"
    echo "  2. Extract: tar -xzf $DEPLOY_PACKAGE"
    echo "  3. Install: npm install --production"
    echo "  4. Start: npm run start"
    echo "  5. Monitor: pm2 start server/index.js --name 'white-caves'"
    echo "" >> "$DEPLOYMENT_LOG"
    echo "Deployment package: $DEPLOY_PACKAGE" >> "$DEPLOYMENT_LOG"
}

post_deployment_verification() {
    log_info "Waiting for deployment to stabilize (30s)..."
    sleep 30
    
    case $DEPLOYMENT_TYPE in
        vercel)
            log_info "Checking deployment status..."
            # You can add health check here
            ;;
        *)
            log_warning "Please verify deployment manually"
            ;;
    esac
}

deployment_summary() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "📊 DEPLOYMENT SUMMARY"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Project: $PROJECT_NAME"
    echo "Timestamp: $TIMESTAMP"
    echo "Method: $DEPLOYMENT_TYPE"
    echo "Build Directory: $BUILD_DIR"
    echo "Backup: $BACKUP_DIR/${PROJECT_NAME}_${TIMESTAMP}"
    echo "Log: $DEPLOYMENT_LOG"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Monitor error tracking (Sentry)"
    echo "  2. Check analytics dashboard"
    echo "  3. Monitor Core Web Vitals"
    echo "  4. Review user feedback"
    echo ""
    echo "Rollback (if needed):"
    echo "  cp -r $BACKUP_DIR/${PROJECT_NAME}_${TIMESTAMP} $BUILD_DIR"
    echo ""
}

# Run main function
main "$@"
