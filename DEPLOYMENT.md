# Primavera MCP Server - Quick Start Guide

## 🚀 Quick Start

### 1. First-time Setup

```bash
# Install dependencies
npm install

# Or use the deployment script
./deploy.sh install
```

### 2. Configure Environment

Update the `.env` file with your actual Primavera Data Service credentials:

```bash
PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_SYNC_METADATA_PX1SFB8R_USERNAME=your_actual_username
PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_SYNC_METADATA_BSADL03P_PASSWORD=your_actual_password
# ... (update other credentials as needed)
```

### 3. Run the Server

#### For Claude Desktop Integration (Recommended)

```bash
# Method 1: Using npm script
npm start

# Method 2: Using deployment script
./deploy.sh start-stdio
```

#### For HTTP API Access

```bash
# Method 1: Using npm script
npm run start:http

# Method 2: Using deployment script
./deploy.sh start-http

# Server will be available at: http://localhost:3001
# Health check: http://localhost:3001/health
```

#### For Server-Sent Events

```bash
npm run start:sse
# Server will be available at: http://localhost:3002
```

## 🔧 Production Deployment

### Using PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Start HTTP server with PM2
./deploy.sh pm2-start http

# Start all server modes
./deploy.sh pm2-start all

# View server status
pm2 status

# View logs
pm2 logs

# Stop servers
./deploy.sh pm2-stop
```

### Using Docker

```bash
# Build the image
./deploy.sh docker-build

# Run HTTP server
./deploy.sh docker-run http

# Run for Claude Desktop (stdio mode)
./deploy.sh docker-run stdio
```

## 🔍 Monitoring & Health Checks

### Check Server Health

```bash
# Check if HTTP server is running
./deploy.sh health

# Check specific port
./deploy.sh health 3001
```

### View Available Tools

```bash
# List all available API tools
./deploy.sh list-tools

# Or use npm script
npm run list-tools
```

## 📋 Available API Tools

This server provides 7 Primavera Data Service tools:

1. **sync_metadata** - Sync P6/Unifier metadata
2. **get_tables_metadata** - Get tables metadata
3. **get_columns_metadata_of_table** - Get column metadata for a specific table
4. **query_tables_data** - Query table data
5. **download_zip_data** - Download data as ZIP
6. **view_job_status** - Check job status
7. **view_metadata_seed_status_of_configuration** - Check metadata seed status

## 🔗 Claude Desktop Integration

Add this to your Claude Desktop config (`Settings` → `Developers` → `Edit Config`):

```json
{
  "mcpServers": {
    "primavera-data-service": {
      "command": "/usr/local/bin/node",
      "args": ["/full/path/to/your/mcpServer.js"]
    }
  }
}
```

Get the full paths:

```bash
# Get node path
which node

# Get mcpServer.js path
realpath mcpServer.js
```

## 🐳 Docker Production Setup

### Build and Run

```bash
# Build the image
docker build -t primavera-mcp-server .

# Run HTTP server
docker run -p 3001:3001 --rm --env-file=.env primavera-mcp-server --streamable-http

# Run for Claude Desktop
docker run -i --rm --env-file=.env primavera-mcp-server
```

### Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  primavera-mcp:
    build: .
    ports:
      - "3001:3001"
    env_file: .env
    command: ["--streamable-http"]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🚨 Troubleshooting

### Common Issues

1. **Node.js Version Error**
   - Ensure Node.js 18+ is installed
   - Check with: `node --version`

2. **API Authentication Errors**
   - Verify credentials in `.env` file
   - Check API endpoint accessibility

3. **Port Already in Use**
   - Change port in `.env`: `PORT=3002`
   - Or kill existing process: `lsof -ti:3001 | xargs kill`

4. **Docker Health Check Fails**
   - Ensure server is running in HTTP mode
   - Check logs: `docker logs [container-id]`

### Logs Location

- **PM2**: `./logs/` directory
- **Docker**: `docker logs [container-id]`
- **Direct run**: Console output

## 📚 Additional Commands

```bash
# Development mode with auto-restart
npm run dev

# Development HTTP mode
npm run dev:http

# Test server connection
npm run test-connection

# Docker build
npm run docker:build

# Docker run
npm run docker:run
```
