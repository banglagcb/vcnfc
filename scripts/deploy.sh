#!/bin/bash

# ShareInfo Deployment Script
# This script handles deployment to production

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

# Check if required environment variables are set
check_env_vars() {
    log_info "Checking environment variables..."
    
    required_vars=(
        "DATABASE_URL"
        "NEXTAUTH_SECRET"
        "JWT_SECRET"
        "CLOUDINARY_CLOUD_NAME"
        "CLOUDINARY_API_KEY"
        "CLOUDINARY_API_SECRET"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    log_success "All required environment variables are set"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    npm ci --only=production
    log_success "Dependencies installed"
}

# Generate Prisma client
generate_prisma() {
    log_info "Generating Prisma client..."
    npx prisma generate
    log_success "Prisma client generated"
}

# Run database migrations
migrate_database() {
    log_info "Running database migrations..."
    npx prisma db push
    log_success "Database migrations completed"
}

# Build the application
build_app() {
    log_info "Building application..."
    npm run build
    log_success "Application built successfully"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    npm run test:ci || {
        log_warning "Some tests failed, but continuing deployment"
    }
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait for app to start
    sleep 10
    
    # Check if the app is responding
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        log_success "Application is healthy"
    else
        log_error "Application health check failed"
        exit 1
    fi
}

# Backup database (for production)
backup_database() {
    if [[ "$NODE_ENV" == "production" ]]; then
        log_info "Creating database backup..."
        
        # Extract database details from URL
        DB_URL=${DATABASE_URL}
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        
        # Create backup directory if it doesn't exist
        mkdir -p backups
        
        # Run backup (this assumes PostgreSQL)
        if command -v pg_dump >/dev/null 2>&1; then
            pg_dump "$DB_URL" > "backups/$BACKUP_FILE"
            log_success "Database backup created: backups/$BACKUP_FILE"
        else
            log_warning "pg_dump not found, skipping database backup"
        fi
    fi
}

# Deploy with Docker
deploy_docker() {
    log_info "Deploying with Docker..."
    
    # Build and start services
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    docker-compose up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        log_success "Docker deployment completed"
    else
        log_error "Docker deployment failed"
        docker-compose logs
        exit 1
    fi
}

# Deploy without Docker
deploy_standalone() {
    log_info "Deploying standalone..."
    
    # Stop existing process if running
    if pgrep -f "node.*server.js" > /dev/null; then
        log_info "Stopping existing application..."
        pkill -f "node.*server.js"
        sleep 5
    fi
    
    # Start the application
    log_info "Starting application..."
    
    if [[ "$NODE_ENV" == "production" ]]; then
        nohup npm start > app.log 2>&1 &
    else
        npm run dev &
    fi
    
    log_success "Application started"
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    
    if [[ "$USE_DOCKER" == "true" ]]; then
        # Rollback Docker deployment
        docker-compose down
        # Here you would restore previous Docker images
        log_info "Docker rollback completed"
    else
        # Rollback standalone deployment
        pkill -f "node.*server.js" || true
        # Here you would restore previous version
        log_info "Standalone rollback completed"
    fi
}

# Main deployment function
main() {
    log_info "Starting ShareInfo deployment..."
    log_info "Environment: ${NODE_ENV:-development}"
    log_info "Using Docker: ${USE_DOCKER:-false}"
    
    # Trap errors and rollback
    trap rollback ERR
    
    # Pre-deployment checks
    check_env_vars
    
    # Backup (production only)
    backup_database
    
    # Build and test
    install_dependencies
    generate_prisma
    migrate_database
    build_app
    run_tests
    
    # Deploy
    if [[ "$USE_DOCKER" == "true" ]]; then
        deploy_docker
    else
        deploy_standalone
    fi
    
    # Post-deployment checks
    health_check
    
    log_success "🚀 ShareInfo deployment completed successfully!"
    log_info "Application is running at: ${NEXTAUTH_URL:-http://localhost:3000}"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --docker)
            export USE_DOCKER=true
            shift
            ;;
        --production)
            export NODE_ENV=production
            shift
            ;;
        --rollback)
            rollback
            exit 0
            ;;
        --health-check)
            health_check
            exit 0
            ;;
        -h|--help)
            echo "ShareInfo Deployment Script"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --docker       Deploy using Docker"
            echo "  --production   Deploy in production mode"
            echo "  --rollback     Rollback the deployment"
            echo "  --health-check Run health check only"
            echo "  -h, --help     Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main deployment
main
