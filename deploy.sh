#!/bin/bash

# Primavera MCP Server Deployment and Management Script
# Usage: ./deploy.sh [command] [options]

set -e

PROJECT_NAME="primavera-mcp-server"
LOG_DIR="./logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

# Check if Node.js is installed and version is compatible
check_node() {
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -c2- | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    success "Node.js version check passed: $(node --version)"
}

# Check if .env file exists and is configured
check_env() {
    if [ ! -f .env ]; then
        error ".env file not found. Please create it with your API credentials."
        exit 1
    fi
    
    if grep -q "your_username_here\|your_password_here" .env; then
        warn ".env file contains placeholder values. Please update with real credentials."
    fi
    
    success ".env file found"
}

# Install dependencies
install_deps() {
    log "Installing dependencies..."
    npm install
    success "Dependencies installed"
}

# Create logs directory
setup_logs() {
    mkdir -p "$LOG_DIR"
    log "Logs directory created at $LOG_DIR"
}

# Start server in different modes
start_stdio() {
    log "Starting MCP server in stdio mode..."
    check_node
    check_env
    setup_logs
    
    log "Server starting in stdio mode for Claude Desktop integration"
    node mcpServer.js
}

start_http() {
    log "Starting MCP server in HTTP mode..."
    check_node
    check_env
    setup_logs
    
    PORT=${PORT:-3001}
    log "Server will start on http://localhost:$PORT"
    log "Health check available at http://localhost:$PORT/health"
    node mcpServer.js --streamable-http
}

start_sse() {
    log "Starting MCP server in SSE mode..."
    check_node
    check_env
    setup_logs
    
    PORT=${PORT:-3002}
    log "Server will start on http://localhost:$PORT"
    log "SSE endpoint: http://localhost:$PORT/sse"
    log "Messages endpoint: http://localhost:$PORT/messages"
    node mcpServer.js --sse
}

# PM2 process management
start_pm2() {
    MODE=${1:-http}
    
    if ! command -v pm2 &> /dev/null; then
        log "PM2 not found globally, installing..."
        npm install -g pm2
    fi
    
    check_node
    check_env
    setup_logs
    
    case $MODE in
        "stdio")
            log "Starting stdio server with PM2..."
            pm2 start ecosystem.config.json --only primavera-mcp-server-stdio
            ;;
        "http")
            log "Starting HTTP server with PM2..."
            pm2 start ecosystem.config.json --only primavera-mcp-server-http
            ;;
        "sse")
            log "Starting SSE server with PM2..."
            pm2 start ecosystem.config.json --only primavera-mcp-server-sse
            ;;
        "all")
            log "Starting all server modes with PM2..."
            pm2 start ecosystem.config.json
            ;;
        *)
            error "Invalid mode: $MODE. Use stdio, http, sse, or all"
            exit 1
            ;;
    esac
    
    success "Server started with PM2. Use 'pm2 status' to check status"
    log "View logs with: pm2 logs $PROJECT_NAME"
}

# Stop PM2 processes
stop_pm2() {
    log "Stopping PM2 processes..."
    pm2 stop ecosystem.config.json
    success "PM2 processes stopped"
}

# Docker operations
docker_build() {
    log "Building Docker image..."
    docker build -t $PROJECT_NAME .
    success "Docker image built: $PROJECT_NAME"
}

docker_run() {
    MODE=${1:-http}
    
    case $MODE in
        "stdio")
            log "Running Docker container in stdio mode..."
            docker run -i --rm --env-file=.env $PROJECT_NAME
            ;;
        "http")
            log "Running Docker container in HTTP mode..."
            docker run -p 3001:3001 --rm --env-file=.env $PROJECT_NAME --streamable-http
            ;;
        "sse")
            log "Running Docker container in SSE mode..."
            docker run -p 3002:3002 --rm --env-file=.env -e PORT=3002 $PROJECT_NAME --sse
            ;;
        *)
            error "Invalid mode: $MODE. Use stdio, http, or sse"
            exit 1
            ;;
    esac
}

# Health check
health_check() {
    PORT=${1:-3001}
    
    log "Checking server health on port $PORT..."
    
    if curl -f -s "http://localhost:$PORT/health" > /dev/null 2>&1; then
        success "Server is healthy on port $PORT"
        curl -s "http://localhost:$PORT/health" | jq .
    else
        error "Server health check failed on port $PORT"
        exit 1
    fi
}

# List available tools
list_tools() {
    log "Listing available tools..."
    node index.js tools
}

# Show usage information
usage() {
    echo "Primavera MCP Server Deployment Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  install              Install dependencies"
    echo "  start-stdio          Start server in stdio mode (for Claude Desktop)"
    echo "  start-http           Start server in HTTP mode"
    echo "  start-sse            Start server in SSE mode"
    echo "  pm2-start [mode]     Start with PM2 (modes: stdio|http|sse|all)"
    echo "  pm2-stop             Stop PM2 processes"
    echo "  docker-build         Build Docker image"
    echo "  docker-run [mode]    Run Docker container (modes: stdio|http|sse)"
    echo "  health [port]        Check server health (default port: 3001)"
    echo "  list-tools           List available API tools"
    echo "  help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install                    # Install dependencies"
    echo "  $0 start-http                 # Start HTTP server on port 3001"
    echo "  $0 pm2-start http             # Start HTTP server with PM2"
    echo "  $0 docker-run http            # Run HTTP server in Docker"
    echo "  $0 health 3001                # Check health on port 3001"
}

# Main command handler
case ${1:-help} in
    "install")
        install_deps
        ;;
    "start-stdio")
        start_stdio
        ;;
    "start-http")
        start_http
        ;;
    "start-sse")
        start_sse
        ;;
    "pm2-start")
        start_pm2 $2
        ;;
    "pm2-stop")
        stop_pm2
        ;;
    "docker-build")
        docker_build
        ;;
    "docker-run")
        docker_run $2
        ;;
    "health")
        health_check $2
        ;;
    "list-tools")
        list_tools
        ;;
    "help"|*)
        usage
        ;;
esac