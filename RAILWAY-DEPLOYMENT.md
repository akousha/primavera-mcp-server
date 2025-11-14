# 🚀 Railway Cloud Deployment Guide

This guide walks you through deploying your Primavera MCP Server to Railway with GitHub integration for automatic deployments.

## 📋 Prerequisites

1. **GitHub account** with this repository
2. **Railway account** (free tier available)
3. **Primavera Data Service credentials**

## 🔗 Quick Setup (5 minutes)

### Step 1: Fork/Clone Repository

1. Fork this repository to your GitHub account
2. Clone it locally if you want to make changes

### Step 2: Set up Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repository

### Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to your project → **Variables** tab
2. Copy variables from `railway.env.template`
3. Replace placeholder values with your actual Primavera credentials

**Required Variables:**

```bash
PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_SYNC_METADATA_PX1SFB8R_USERNAME=your_username
PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_SYNC_METADATA_BSADL03P_PASSWORD=your_password
# ... (add others from template)
```

### Step 4: Deploy

Railway will automatically deploy when you push to the `main` branch!

**Your server will be available at:**

- Production: `https://your-project-name.up.railway.app`
- Health check: `https://your-project-name.up.railway.app/health`

## 🔄 CI/CD Pipeline

### Automatic Deployments

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **On Pull Requests:**
   - Runs tests and validation
   - Deploys to staging environment
   - Comments deployment status on PR

2. **On Main Branch Push:**
   - Runs tests and security scans
   - Deploys to production
   - Performs health checks
   - Creates GitHub release

### Branch Strategy

- `main` → Production deployment
- `staging` → Staging environment  
- Feature branches → PR testing

## 🛠️ Manual Railway CLI Deployment

### Install Railway CLI

```bash
npm install -g @railway/cli
```

### Login and Deploy

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Deploy current directory
railway up

# Check deployment status
railway status
```

## 🔧 Configuration Files

### `railway.json` - Railway Configuration

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci --production"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Environment Management

**Production Environment:**

- Set `NODE_ENV=production`
- Use production Primavera API credentials
- Enable logging level `info`

**Staging Environment:**

- Set `NODE_ENV=staging`
- Use test/staging API credentials
- Enable logging level `debug`

## 📊 Monitoring & Health Checks

### Health Endpoint

Your deployed server includes a health endpoint:

```bash
curl https://your-project.up.railway.app/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-11-13T10:30:00.000Z",
  "mode": "streamable-http",
  "tools": 7,
  "version": "0.1.0"
}
```

### Railway Monitoring

Railway provides built-in monitoring:

1. **Metrics Dashboard** - CPU, Memory, Network usage
2. **Logs** - Real-time application logs  
3. **Deployments** - Deployment history and status
4. **Alerts** - Set up notifications for issues

### External Monitoring (Optional)

Add monitoring services by setting environment variables:

```bash
# Sentry for error tracking
SENTRY_DSN=your_sentry_dsn

# New Relic for performance monitoring
NEW_RELIC_LICENSE_KEY=your_key
```

## 🔒 Security Setup

### GitHub Secrets

Set up these secrets in GitHub repository settings:

1. `RAILWAY_TOKEN` - Railway API token for deployments
2. `GITHUB_TOKEN` - Automatically provided by GitHub

### Environment Variables Security

- Never commit `.env` files
- Use Railway's encrypted environment variables
- Rotate API keys regularly
- Use different credentials for staging/production

## 🚨 Troubleshooting

### Common Issues

1. **Deployment Failed**

   ```bash
   # Check Railway logs
   railway logs
   
   # Check build logs in Railway dashboard
   # Verify all environment variables are set
   ```

2. **Health Check Failing**

   ```bash
   # Test locally first
   npm run start:http
   curl localhost:3001/health
   
   # Check Railway service logs
   railway logs --tail
   ```

3. **API Authentication Errors**

   ```bash
   # Verify credentials in Railway dashboard
   # Test API endpoints manually
   # Check Primavera service status
   ```

### Debug Commands

```bash
# Local development
npm run dev

# Test with Railway CLI
railway run npm start

# Check environment variables
railway variables

# View recent logs
railway logs --tail 100
```

## 📈 Scaling & Performance

### Railway Scaling Options

1. **Horizontal Scaling**
   - Increase replicas in `railway.json`
   - Railway handles load balancing

2. **Vertical Scaling**  
   - Upgrade Railway plan for more CPU/Memory
   - Monitor usage in Railway dashboard

3. **Database Connection Pooling**
   - Consider connection limits for Primavera API
   - Implement rate limiting if needed

### Performance Tips

- Enable production optimizations (`NODE_ENV=production`)
- Monitor API response times
- Use Railway's built-in caching
- Consider implementing request queuing for high load

## 🔗 Integration with MCP Clients

### Claude Desktop Integration

Use your Railway URL in Claude Desktop config:

```json
{
  "mcpServers": {
    "primavera-cloud": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "https://your-project.up.railway.app/mcp",
        "-H", "Content-Type: application/json",
        "-d", "@-"
      ]
    }
  }
}
```

### Custom Client Integration

Your Railway deployment provides HTTP endpoints:

- **MCP Endpoint:** `POST https://your-project.up.railway.app/mcp`
- **Health Check:** `GET https://your-project.up.railway.app/health`

## 💰 Cost Optimization

### Railway Pricing

- **Hobby Plan:** $5/month (suitable for development)
- **Pro Plan:** $20/month (production workloads)
- **Free Tier:** Available with limitations

### Cost Reduction Tips

1. Use sleep mode for non-critical environments
2. Monitor resource usage in Railway dashboard
3. Implement request caching
4. Use staging environment sparingly

## 🎯 Next Steps

1. **Set up monitoring alerts**
2. **Configure backup strategies**
3. **Implement CI/CD notifications**
4. **Add load testing**
5. **Set up log aggregation**

Your Primavera MCP Server is now production-ready on Railway! 🎉
