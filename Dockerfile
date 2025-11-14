# Multi-stage build for production optimization
FROM node:22.12-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:22.12-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S primavera -u 1001 -G nodejs

WORKDIR /app

# Create logs directory
RUN mkdir -p logs && chown -R primavera:nodejs logs

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=primavera:nodejs . .

# Switch to non-root user
USER primavera

# Health check for HTTP mode
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD if [ "$1" = "--streamable-http" ] || [ "$1" = "--sse" ]; then \
        wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3001}/health || exit 1; \
      else \
        echo "stdio mode - no health check needed"; \
      fi

# Expose port (only used in HTTP/SSE modes)
EXPOSE 3001

ENTRYPOINT ["node", "mcpServer.js"]