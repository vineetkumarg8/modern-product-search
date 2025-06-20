# Product Orchestration API - Build and Run Script (PowerShell)
# This script provides various options for building and running the application

param(
    [Parameter(Position=0)]
    [string]$Action = "help"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "java")) {
        Write-Error "Java is not installed. Please install Java 17 or higher."
        exit 1
    }
    
    $javaVersion = java -version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString().Split('"')[1].Split('.')[0] }
    if ([int]$javaVersion -lt 17) {
        Write-Error "Java 17 or higher is required. Current version: $javaVersion"
        exit 1
    }
    
    if (-not (Test-Command "mvn")) {
        Write-Error "Maven is not installed. Please install Maven 3.6 or higher."
        exit 1
    }
    
    Write-Success "Prerequisites check passed"
}

# Function to clean the project
function Invoke-CleanProject {
    Write-Status "Cleaning project..."
    mvn clean
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Project cleaned"
    } else {
        Write-Error "Failed to clean project"
        exit 1
    }
}

# Function to compile the project
function Invoke-CompileProject {
    Write-Status "Compiling project..."
    mvn compile
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Project compiled"
    } else {
        Write-Error "Failed to compile project"
        exit 1
    }
}

# Function to run tests
function Invoke-RunTests {
    Write-Status "Running tests..."
    mvn test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Tests completed"
    } else {
        Write-Error "Tests failed"
        exit 1
    }
}

# Function to run tests with coverage
function Invoke-RunTestsWithCoverage {
    Write-Status "Running tests with coverage..."
    mvn test jacoco:report
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Tests with coverage completed"
        Write-Status "Coverage report available at: target/site/jacoco/index.html"
    } else {
        Write-Error "Tests with coverage failed"
        exit 1
    }
}

# Function to package the application
function Invoke-PackageApplication {
    Write-Status "Packaging application..."
    mvn package -DskipTests
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application packaged"
    } else {
        Write-Error "Failed to package application"
        exit 1
    }
}

# Function to run the application
function Invoke-RunApplication {
    Write-Status "Starting application..."
    Write-Status "Application will be available at: http://localhost:8080/api/v1"
    Write-Status "Swagger UI: http://localhost:8080/api/v1/swagger-ui.html"
    Write-Status "H2 Console: http://localhost:8080/api/v1/h2-console"
    Write-Status "Press Ctrl+C to stop the application"
    mvn spring-boot:run
}

# Function to build Docker image
function Invoke-BuildDockerImage {
    if (-not (Test-Command "docker")) {
        Write-Error "Docker is not installed. Please install Docker."
        exit 1
    }
    
    Write-Status "Building Docker image..."
    docker build -t product-orchestration-api:latest .
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker image built successfully"
    } else {
        Write-Error "Failed to build Docker image"
        exit 1
    }
}

# Function to run with Docker
function Invoke-RunWithDocker {
    if (-not (Test-Command "docker")) {
        Write-Error "Docker is not installed. Please install Docker."
        exit 1
    }
    
    Write-Status "Running application with Docker..."
    docker run -p 8080:8080 --name product-api product-orchestration-api:latest
}

# Function to run with Docker Compose
function Invoke-RunWithDockerCompose {
    if (-not (Test-Command "docker-compose") -and -not (Test-Command "docker")) {
        Write-Error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    }
    
    Write-Status "Running application with Docker Compose..."
    docker-compose up --build
}

# Function to stop Docker containers
function Stop-Docker {
    Write-Status "Stopping Docker containers..."
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker containers stopped"
    } else {
        Write-Error "Failed to stop Docker containers"
    }
}

# Function to show help
function Show-Help {
    Write-Host "Product Orchestration API - Build and Run Script (PowerShell)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\build-and-run.ps1 [ACTION]" -ForegroundColor White
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor White
    Write-Host "  check           Check prerequisites" -ForegroundColor Gray
    Write-Host "  clean           Clean the project" -ForegroundColor Gray
    Write-Host "  compile         Compile the project" -ForegroundColor Gray
    Write-Host "  test            Run tests" -ForegroundColor Gray
    Write-Host "  test-coverage   Run tests with coverage report" -ForegroundColor Gray
    Write-Host "  package         Package the application" -ForegroundColor Gray
    Write-Host "  run             Run the application locally" -ForegroundColor Gray
    Write-Host "  build-docker    Build Docker image" -ForegroundColor Gray
    Write-Host "  run-docker      Run with Docker" -ForegroundColor Gray
    Write-Host "  run-compose     Run with Docker Compose" -ForegroundColor Gray
    Write-Host "  stop-docker     Stop Docker containers" -ForegroundColor Gray
    Write-Host "  full-build      Clean, compile, test, and package" -ForegroundColor Gray
    Write-Host "  quick-start     Quick start (compile and run)" -ForegroundColor Gray
    Write-Host "  help            Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\build-and-run.ps1 quick-start     # Compile and run the application" -ForegroundColor Gray
    Write-Host "  .\build-and-run.ps1 full-build      # Complete build with tests" -ForegroundColor Gray
    Write-Host "  .\build-and-run.ps1 run-compose     # Run with Docker Compose" -ForegroundColor Gray
}

# Main script logic
switch ($Action.ToLower()) {
    "check" {
        Test-Prerequisites
    }
    "clean" {
        Test-Prerequisites
        Invoke-CleanProject
    }
    "compile" {
        Test-Prerequisites
        Invoke-CompileProject
    }
    "test" {
        Test-Prerequisites
        Invoke-RunTests
    }
    "test-coverage" {
        Test-Prerequisites
        Invoke-RunTestsWithCoverage
    }
    "package" {
        Test-Prerequisites
        Invoke-PackageApplication
    }
    "run" {
        Test-Prerequisites
        Invoke-RunApplication
    }
    "build-docker" {
        Invoke-BuildDockerImage
    }
    "run-docker" {
        Invoke-BuildDockerImage
        Invoke-RunWithDocker
    }
    "run-compose" {
        Invoke-RunWithDockerCompose
    }
    "stop-docker" {
        Stop-Docker
    }
    "full-build" {
        Test-Prerequisites
        Invoke-CleanProject
        Invoke-CompileProject
        Invoke-RunTests
        Invoke-PackageApplication
        Write-Success "Full build completed successfully!"
    }
    "quick-start" {
        Test-Prerequisites
        Invoke-CompileProject
        Write-Success "Quick build completed! Starting application..."
        Invoke-RunApplication
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Unknown action: $Action"
        Show-Help
        exit 1
    }
}
