# Deployment Guide

This guide covers various deployment options for Modern Product Search.

## 🚀 Quick Deploy Options

### 1. GitHub Pages (Frontend Only)
**Best for**: Portfolio showcase, documentation

```bash
# Automatic deployment via GitHub Actions
# Just push to main branch and GitHub Pages will deploy automatically
```

**Live URL**: `https://vineetkumarg8.github.io/modern-product-search`

### 2. GitHub Codespaces (Development)
**Best for**: Development, testing, demos

1. Go to your repository on GitHub
2. Click "Code" → "Codespaces" → "Create codespace on main"
3. Wait for environment to load
4. Run: `./mvnw spring-boot:run` (backend) and `cd frontend && npm start` (frontend)

### 3. Heroku (Full-Stack)
**Best for**: Production deployment, full-stack apps

#### Setup:
1. Create Heroku account at heroku.com
2. Install Heroku CLI
3. Deploy:

```bash
# Login to Heroku
heroku login

# Create app
heroku create modern-product-search

# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=heroku

# Deploy
git push heroku main
```

#### Automatic Deployment:
- Set up GitHub Actions (already configured)
- Add `HEROKU_API_KEY` to GitHub Secrets
- Push to main branch for automatic deployment

### 4. Railway (Full-Stack)
**Best for**: Modern deployment, great developer experience

1. Go to railway.app
2. Connect your GitHub repository
3. Railway will automatically detect and deploy your app
4. Configuration is already set in `railway.json`

### 5. Docker Deployment
**Best for**: Containerized deployment, any cloud provider

```bash
# Build and run locally
docker-compose up --build

# Or build individual image
docker build -t modern-product-search .
docker run -p 8080:8080 modern-product-search
```

## 🔧 Environment Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8080 |
| `SPRING_PROFILES_ACTIVE` | Active profile | default |
| `EXTERNAL_API_BASE_URL` | External API URL | https://dummyjson.com |
| `JAVA_OPTS` | JVM options | -Xmx512m |

### Profiles

- **default**: Local development
- **docker**: Docker deployment
- **heroku**: Heroku deployment
- **railway**: Railway deployment
- **test**: Testing environment

## 📊 Deployment Comparison

| Platform | Cost | Ease | Performance | Features |
|----------|------|------|-------------|----------|
| GitHub Pages | Free | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Frontend only |
| Heroku | Free tier | ⭐⭐⭐⭐ | ⭐⭐⭐ | Full-stack |
| Railway | Free tier | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Modern platform |
| Docker | Varies | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Maximum control |

## 🔍 Health Checks

All deployments include health check endpoints:

- **Health**: `/api/v1/actuator/health`
- **Info**: `/api/v1/actuator/info`
- **Metrics**: `/api/v1/actuator/metrics`

## 🐛 Troubleshooting

### Common Issues:

1. **Port binding errors**: Ensure `PORT` environment variable is set
2. **Memory issues**: Adjust `JAVA_OPTS` for heap size
3. **Database connection**: Check H2 configuration in active profile
4. **CORS issues**: Verify frontend URL in CORS configuration

### Logs:

```bash
# Heroku logs
heroku logs --tail

# Docker logs
docker logs container-name

# Local logs
tail -f logs/application.log
```

## 📈 Monitoring

### Production Monitoring:
- Health checks via actuator endpoints
- Application metrics
- Error tracking
- Performance monitoring

### Recommended Tools:
- **Heroku**: Built-in metrics
- **Railway**: Built-in monitoring
- **External**: New Relic, DataDog, Sentry

## 🔒 Security Considerations

### Production Checklist:
- [ ] Disable H2 console in production
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up authentication (if needed)
- [ ] Regular security updates

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Open an issue on GitHub
4. Contact platform support

Happy deploying! 🚀
