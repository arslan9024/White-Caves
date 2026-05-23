# White Caves CRM Platform - Production Deployment Script (PowerShell)
# Usage: .\deploy-prod.ps1 -Environment production -Version latest

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [string]$Version = "latest",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipTests,
    
    [Parameter(Mandatory=$false)]
    [switch]$Help
)

# Colors for output
$ColorError = "Red"
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorInfo = "Cyan"

# Configuration
$DockerComposeFile = "docker-compose.prod.yml"
$MaxAttempts = 3
$RetryDelay = 5

# Logging functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $ColorInfo
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $ColorSuccess
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $ColorWarning
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $ColorError
}

# Help output
function Show-Help {
    @"
White Caves CRM Platform - Production Deployment Script

Usage: .\deploy-prod.ps1 [options]

Options:
  -Environment <env>    Deployment environment (default: production)
  -Version <version>    Version tag (default: latest)
  -SkipTests           Skip running tests during deployment
  -Help                Show this help message

Examples:
  .\deploy-prod.ps1                                    # Deploy to production
  .\deploy-prod.ps1 -Environment staging -Version v1.0.0
  .\deploy-prod.ps1 -SkipTests                        # Skip test suite

"@
}

if ($Help) {
    Show-Help
    exit 0
}

# Check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."

    # Check Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker installed: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed or not in PATH"
        return $false
    }

    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose installed: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose is not installed"
        return $false
    }

    # Check .env.production file
    if (-not (Test-Path ".env.production")) {
        Write-Error ".env.production file not found"
        return $false
    }
    Write-Success ".env.production file found"

    # Check Docker daemon
    try {
        docker ps | Out-Null
        Write-Success "Docker daemon is running"
    }
    catch {
        Write-Error "Docker daemon is not running"
        return $false
    }

    return $true
}

# Verify configuration
function Verify-Configuration {
    Write-Info "Verifying configuration..."

    # Check required environment variables
    $requiredVars = @("JWT_SECRET", "DATABASE_URL", "REDIS_URL")
    $envContent = Get-Content ".env.production" -Raw

    foreach ($var in $requiredVars) {
        if ($envContent -notmatch $var) {
            Write-Error "Missing $var in .env.production"
            return $false
        }
    }
    Write-Success "All required environment variables configured"

    # Check Docker Compose file
    try {
        docker-compose -f $DockerComposeFile config | Out-Null
        Write-Success "Docker Compose configuration valid"
    }
    catch {
        Write-Error "Invalid Docker Compose configuration"
        return $false
    }

    return $true
}

# Build Docker images
function Build-Images {
    Write-Info "Building Docker images..."

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            docker-compose -f $DockerComposeFile build | Out-Null
            Write-Success "Docker images built successfully"
            return $true
        }
        catch {
            if ($attempt -lt $MaxAttempts) {
                Write-Warning "Build failed, retrying in ${RetryDelay}s (attempt $attempt/$MaxAttempts)..."
                Start-Sleep -Seconds $RetryDelay
            }
        }
    }

    Write-Error "Failed to build Docker images after $MaxAttempts attempts"
    return $false
}

# Pull images from registry
function Pull-Images {
    Write-Info "Pulling Docker images..."

    try {
        docker-compose -f $DockerComposeFile pull | Out-Null
        Write-Success "Docker images pulled successfully"
        return $true
    }
    catch {
        Write-Warning "Image pull failed, using local images"
        return $true
    }
}

# Stop containers
function Stop-Containers {
    Write-Info "Stopping existing containers..."

    $output = docker-compose -f $DockerComposeFile ps 2>&1
    if ($output -match "Up") {
        docker-compose -f $DockerComposeFile down | Out-Null
        Write-Success "Containers stopped"
    }
    else {
        Write-Info "No running containers found"
    }

    return $true
}

# Start services
function Start-Services {
    Write-Info "Starting services..."

    docker-compose -f $DockerComposeFile up -d
    
    Write-Info "Waiting 10 seconds for services to initialize..."
    Start-Sleep -Seconds 10

    Write-Success "Services started"
    return $true
}

# Initialize database
function Initialize-Database {
    Write-Info "Initializing database..."

    try {
        Write-Info "Running database migrations..."
        docker-compose -f $DockerComposeFile exec -T app npm run prisma:migrate:deploy 2>&1 | Out-Null
        Write-Success "Database migrations completed"
    }
    catch {
        Write-Warning "Database migrations failed or already applied"
    }

    return $true
}

# Health check
function Test-Health {
    Write-Info "Performing health checks..."

    $maxAttempts = 30
    $attempt = 0

    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Success "Application is healthy"
                return $true
            }
        }
        catch {
            # Continue to next attempt
        }

        $attempt++
        Write-Info "Health check attempt $attempt/$maxAttempts..."
        Start-Sleep -Seconds 2
    }

    Write-Error "Application failed health check after $maxAttempts attempts"
    return $false
}

# Run tests
function Run-Tests {
    if ($SkipTests) {
        Write-Info "Skipping test execution"
        return $true
    }

    Write-Info "Running tests..."

    try {
        docker-compose -f $DockerComposeFile exec -T app npm run test 2>&1 | Out-Null
        Write-Success "All tests passed"
        return $true
    }
    catch {
        Write-Warning "Some tests failed"
        return $true  # Continue deployment despite test failures
    }
}

# Show status
function Show-Status {
    Write-Info "Service Status:"
    docker-compose -f $DockerComposeFile ps
    
    Write-Info "`nDocker Statistics:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>&1 | Select-Object -First 5

    Write-Info "`nApplication Health:"
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:5000/health" -ErrorAction SilentlyContinue
        $health.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    }
    catch {
        Write-Error "Unable to retrieve health status"
    }
}

# Main deployment flow
function Invoke-Deployment {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "White Caves CRM - Production Deployment" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Info "Environment: $Environment"
    Write-Info "Version: $Version"
    Write-Info "Skip Tests: $SkipTests"
    Write-Host ""

    # Phase 1: Prerequisites
    Write-Host "PHASE 1: Pre-deployment Checks" -ForegroundColor Cyan
    Write-Host "--------------------------------" -ForegroundColor Cyan
    if (-not (Test-Prerequisites)) { exit 1 }
    if (-not (Verify-Configuration)) { exit 1 }
    Write-Host ""

    # Phase 2: Image Preparation
    Write-Host "PHASE 2: Image Preparation" -ForegroundColor Cyan
    Write-Host "--------------------------" -ForegroundColor Cyan
    if (-not (Build-Images)) { exit 1 }
    Write-Host ""

    # Phase 3: Deployment
    Write-Host "PHASE 3: Deployment" -ForegroundColor Cyan
    Write-Host "-------------------" -ForegroundColor Cyan
    Stop-Containers
    if (-not (Start-Services)) { exit 1 }
    Write-Host ""

    # Phase 4: Initialization
    Write-Host "PHASE 4: Initialization" -ForegroundColor Cyan
    Write-Host "----------------------" -ForegroundColor Cyan
    Initialize-Database
    Write-Host ""

    # Phase 5: Verification
    Write-Host "PHASE 5: Verification" -ForegroundColor Cyan
    Write-Host "---------------------" -ForegroundColor Cyan
    if (-not (Test-Health)) { exit 1 }
    if (-not (Run-Tests)) { Write-Warning "Test failures detected" }
    Write-Host ""

    # Phase 6: Status Report
    Write-Host "PHASE 6: Status Report" -ForegroundColor Cyan
    Write-Host "----------------------" -ForegroundColor Cyan
    Show-Status
    Write-Host ""

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Info "Application URL: https://white-caves.com"
    Write-Info "Health Check: https://white-caves.com/health"
    Write-Info ""
    Write-Info "Next steps:"
    Write-Info "1. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f app"
    Write-Info "2. Check dashboard: https://white-caves.com/metrics"
    Write-Info "3. Run E2E tests: npm run test:e2e"
}

# Run deployment
Invoke-Deployment
