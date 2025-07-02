# 🔧 Comprehensive Troubleshooting Guide

## Problem: Application Issues Across Different Devices and Environments

This guide helps you diagnose and fix common issues with the Modern Product Search application.

## 🚀 Quick Diagnostic Steps

### 1. Use the Diagnostic Tool
1. **Local Development**: Navigate to `http://localhost:3000/diagnostic.html`
2. **Production/Hosted**: Navigate to `https://your-app-url.com/diagnostic.html`
3. Click "🚀 Run All Diagnostic Tests"
4. Review results to identify specific issues

### 2. Check Backend Status
```bash
# Local development
curl http://localhost:8080/api/v1/actuator/health

# Production
curl https://your-app-url.com/api/v1/actuator/health

# Check if products exist
curl http://localhost:8080/api/v1/products?size=1
```

## 🔍 Common Issues & Solutions

### Issue 1: 404 Not Found Error
**Symptoms:** Page shows "HTTP Status 404 – Not Found"
**Causes & Solutions:**

#### Backend Not Running
```bash
# Check if backend is running
netstat -tulpn | grep :8080  # Linux/Mac
netstat -ano | findstr :8080  # Windows

# Start backend
mvn spring-boot:run
# OR
java -jar target/your-app.jar
```

#### Frontend Build Issues
```bash
# Rebuild frontend
cd frontend
npm install
npm run build

# Check if build files exist
ls -la build/  # Should contain index.html, static/ folder
```

#### Routing Configuration
- Check `WebConfig.java` for proper static resource handling
- Verify `FrontendController.java` handles root path
- Ensure context-path is set correctly in `application.yml`

### Issue 2: Data Not Loading
**Symptoms:** Empty product list, "No products found"
**Solutions:**

#### Manual Data Loading
```bash
# Load data via API
curl -X POST http://localhost:8080/api/v1/data/load

# Or use frontend "Load Data" button
```

#### External API Issues
- Check if dummyjson.com is accessible
- Verify network connectivity
- Check timeout settings in `application.yml`

#### Database Issues
```bash
# Check H2 console (development only)
http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:productdb
# Username: sa, Password: password
```

### Issue 3: CORS Errors
**Symptoms:** "Access to fetch blocked by CORS policy"
**Solutions:**

#### Check CORS Configuration
```java
// Verify CorsConfig.java allows your domain
.allowedOrigins("*") // For development
.allowedOrigins("https://your-domain.com") // For production
```

#### Proxy Issues (Development)
```json
// Check package.json has proxy
"proxy": "http://localhost:8080"
```

### Issue 4: Mobile/Network Access Issues
**Symptoms:** Works on one device but not another
**Solutions:**

#### Network Configuration
```bash
# Find your IP address
ipconfig  # Windows
ifconfig  # Linux/Mac

# Update API configuration for mobile access
# Check frontend/src/config/api.ts
```

#### Firewall Settings
```bash
# Allow ports through firewall
# Windows: Windows Defender Firewall settings
# Linux: ufw allow 8080 && ufw allow 3000
# Mac: System Preferences > Security & Privacy > Firewall
```

### Issue 5: Production Deployment Issues
**Symptoms:** Works locally but fails in production

#### Environment Variables
```bash
# Check production environment variables
REACT_APP_API_BASE_URL=https://your-backend-url.com/api/v1
SPRING_PROFILES_ACTIVE=render  # or your production profile
```

#### Build Configuration
```yaml
# Check render.yaml or deployment config
buildCommand: |
  cd frontend && npm install && npm run build
  mkdir -p ../src/main/resources/static
  cp -r build/* ../src/main/resources/static/
  cd .. && mvn clean package -DskipTests
```

## 🛠️ Device-Specific Troubleshooting

### Windows
- Check Windows Defender firewall
- Verify localhost resolution: `ping localhost`
- Check hosts file: `C:\Windows\System32\drivers\etc\hosts`
- Use PowerShell as Administrator for network commands

### macOS
- Check macOS firewall in System Preferences
- Verify localhost resolution: `ping localhost`
- Check hosts file: `/etc/hosts`
- Use `sudo` for system-level changes

### Linux
- Check iptables/ufw firewall: `sudo ufw status`
- Verify localhost resolution: `ping localhost`
- Check hosts file: `/etc/hosts`
- Check if ports are in use: `sudo netstat -tulpn | grep :8080`

### Mobile Devices
- Use device IP instead of localhost: `http://192.168.1.100:3000`
- Ensure both devices are on same WiFi network
- Check if mobile data/WiFi has restrictions
- Try different browsers (Chrome, Safari, Firefox)

## 🔧 Advanced Debugging

### Enable Debug Logging
```yaml
# Add to application.yml
logging:
  level:
    com.productapi: DEBUG
    org.springframework.web: DEBUG
    org.springframework.web.reactive.function.client: DEBUG
```

### Network Analysis
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try loading data
4. Check for failed requests (red entries)
5. Look at request/response headers
6. Check Console tab for JavaScript errors

### Backend Logs Analysis
```bash
# Check application logs
tail -f logs/application.log

# Look for common error patterns:
# - Connection refused
# - Timeout exceptions
# - 404 errors
# - CORS violations
# - Database connection issues
```

## 📊 Environment Configuration

### Development (.env.development)
```bash
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
GENERATE_SOURCEMAP=true
REACT_APP_ENVIRONMENT=development
```

### Production (.env.production)
```bash
REACT_APP_API_BASE_URL=https://your-backend-url.com/api/v1
GENERATE_SOURCEMAP=false
REACT_APP_ENVIRONMENT=production
```

### Application Profiles
```yaml
# application.yml (development)
server:
  port: 8080
  servlet:
    context-path: /api/v1

# application-render.yml (production)
server:
  port: ${PORT:8080}
  servlet:
    context-path: /
```

## 🚨 Emergency Solutions

### Quick Fix 1: Reset Everything
```bash
# Stop all processes
# Clear browser cache completely
# Restart backend: mvn spring-boot:run
# Restart frontend: npm start
# Clear npm cache: npm start -- --reset-cache
```

### Quick Fix 2: Force Data Load
```javascript
// Open browser console (F12) and run:
fetch('/api/v1/data/load', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Quick Fix 3: Direct API Test
1. Open: `http://localhost:8080/api/v1/products`
2. If this works → Frontend issue
3. If this fails → Backend issue

## 📞 Getting Help

### Information to Collect
1. **Operating System**: Windows/Mac/Linux version
2. **Browser**: Chrome/Firefox/Safari version
3. **Network**: Home/Corporate/Mobile
4. **Error Messages**: Exact text from console/logs
5. **Diagnostic Results**: Output from diagnostic tool

### Useful Commands for Support
```bash
# System information
node --version
npm --version
java --version
mvn --version

# Network information
ipconfig /all  # Windows
ifconfig -a    # Linux/Mac

# Process information
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac
```

## 🔗 Quick Reference Links

### Local Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **Health Check**: http://localhost:8080/api/v1/actuator/health
- **H2 Console**: http://localhost:8080/h2-console
- **Diagnostic Tool**: http://localhost:3000/diagnostic.html

### Production
- **Main App**: https://your-app-url.com
- **API Health**: https://your-app-url.com/api/v1/actuator/health
- **Diagnostic Tool**: https://your-app-url.com/diagnostic.html

## 📋 Troubleshooting Checklist

- [ ] Backend server is running
- [ ] Frontend development server is running (if local)
- [ ] API health check responds successfully
- [ ] No firewall blocking required ports
- [ ] Browser cache cleared
- [ ] Correct environment variables set
- [ ] Data loaded in database
- [ ] Network connectivity working
- [ ] No proxy interference
- [ ] CORS configured correctly
- [ ] Build files exist in static directory
- [ ] Routing configuration correct
