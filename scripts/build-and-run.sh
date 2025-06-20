#!/bin/bash

# Product Orchestration API - Build and Run Script
# This script provides various options for building and running the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists java; then
        print_error "Java is not installed. Please install Java 17 or higher."
        exit 1
    fi
    
    java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$java_version" -lt 17 ]; then
        print_error "Java 17 or higher is required. Current version: $java_version"
        exit 1
    fi
    
    if ! command_exists mvn; then
        print_error "Maven is not installed. Please install Maven 3.6 or higher."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to clean the project
clean_project() {
    print_status "Cleaning project..."
    mvn clean
    print_success "Project cleaned"
}

# Function to compile the project
compile_project() {
    print_status "Compiling project..."
    mvn compile
    print_success "Project compiled"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    mvn test
    print_success "Tests completed"
}

# Function to run tests with coverage
run_tests_with_coverage() {
    print_status "Running tests with coverage..."
    mvn test jacoco:report
    print_success "Tests with coverage completed"
    print_status "Coverage report available at: target/site/jacoco/index.html"
}

# Function to package the application
package_application() {
    print_status "Packaging application..."
    mvn package -DskipTests
    print_success "Application packaged"
}

# Function to run the application
run_application() {
    print_status "Starting application..."
    print_status "Application will be available at: http://localhost:8080/api/v1"
    print_status "Swagger UI: http://localhost:8080/api/v1/swagger-ui.html"
    print_status "H2 Console: http://localhost:8080/api/v1/h2-console"
    print_status "Press Ctrl+C to stop the application"
    mvn spring-boot:run
}

# Function to build Docker image
build_docker_image() {
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker."
        exit 1
    fi
    
    print_status "Building Docker image..."
    docker build -t product-orchestration-api:latest .
    print_success "Docker image built successfully"
}

# Function to run with Docker
run_with_docker() {
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker."
        exit 1
    fi
    
    print_status "Running application with Docker..."
    docker run -p 8080:8080 --name product-api product-orchestration-api:latest
}

# Function to run with Docker Compose
run_with_docker_compose() {
    if ! command_exists docker-compose && ! command_exists docker; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_status "Running application with Docker Compose..."
    docker-compose up --build
}

# Function to stop Docker containers
stop_docker() {
    print_status "Stopping Docker containers..."
    docker-compose down
    print_success "Docker containers stopped"
}

# Function to show help
show_help() {
    echo "Product Orchestration API - Build and Run Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  check           Check prerequisites"
    echo "  clean           Clean the project"
    echo "  compile         Compile the project"
    echo "  test            Run tests"
    echo "  test-coverage   Run tests with coverage report"
    echo "  package         Package the application"
    echo "  run             Run the application locally"
    echo "  build-docker    Build Docker image"
    echo "  run-docker      Run with Docker"
    echo "  run-compose     Run with Docker Compose"
    echo "  stop-docker     Stop Docker containers"
    echo "  full-build      Clean, compile, test, and package"
    echo "  quick-start     Quick start (compile and run)"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 quick-start     # Compile and run the application"
    echo "  $0 full-build      # Complete build with tests"
    echo "  $0 run-compose     # Run with Docker Compose"
}

# Main script logic
case "${1:-help}" in
    check)
        check_prerequisites
        ;;
    clean)
        check_prerequisites
        clean_project
        ;;
    compile)
        check_prerequisites
        compile_project
        ;;
    test)
        check_prerequisites
        run_tests
        ;;
    test-coverage)
        check_prerequisites
        run_tests_with_coverage
        ;;
    package)
        check_prerequisites
        package_application
        ;;
    run)
        check_prerequisites
        run_application
        ;;
    build-docker)
        build_docker_image
        ;;
    run-docker)
        build_docker_image
        run_with_docker
        ;;
    run-compose)
        run_with_docker_compose
        ;;
    stop-docker)
        stop_docker
        ;;
    full-build)
        check_prerequisites
        clean_project
        compile_project
        run_tests
        package_application
        print_success "Full build completed successfully!"
        ;;
    quick-start)
        check_prerequisites
        compile_project
        print_success "Quick build completed! Starting application..."
        run_application
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
