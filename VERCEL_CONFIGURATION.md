# Vercel Backend Configuration - Latest Version (2024)

## ✅ Configuration Complete

Your backend is now configured with the latest Vercel best practices for 2024.

## 📁 Project Structure

```
server/
├── server.js          # Main Express app (exported for Vercel)
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies
└── .vercelignore      # Files to exclude from deployment
```

## 🔧 Configuration Details

### 1. **vercel.json** (Latest Format)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "functions": {
    "server.js": {
      "runtime": "nodejs20.x",    // Latest Node.js runtime
      "maxDuration": 30,          // 30 seconds max execution
      "memory": 1024              // 1GB memory allocation
    }
  }
}
```

**Key Features:**
- ✅ Uses Node.js 20.x (latest LTS)
- ✅ 30-second timeout (Pro plan allows up to 60s)
- ✅ 1GB memory allocation
- ✅ All routes redirect to server.js

### 2. **server.js** (Serverless-Ready)

- ✅ Exports Express app: `export default app`
- ✅ Lazy database connection (serverless-optimized)
- ✅ Health check endpoint: `/api/health`
- ✅ Local development support with `app.listen()`

### 3. **Database Connection** (Optimized)

- ✅ Connection caching for serverless
- ✅ Lazy connection on first request
- ✅ Optimized pool settings for serverless

## 🚀 Deployment Steps

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to server directory
cd server

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Option 2: Git Integration (Automatic)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository

2. **Configure Project:**
   - **Root Directory:** `server` (if deploying only backend)
   - **Framework Preset:** Other
   - **Build Command:** Leave empty or `echo 'No build needed'`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

3. **Environment Variables:**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=https://your-frontend.vercel.app
   SECRET_KEY_ACCESS_TOKEN=your_access_token_secret
   SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_ENDPOINT_SECRET=your_stripe_webhook_secret
   RESEND_API_KEY=your_resend_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Deploy:**
   - Push to your main branch
   - Vercel will auto-deploy

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://your-app.vercel.app/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

### 2. Test API Endpoints
```bash
# Register user
curl -X POST https://your-app.vercel.app/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

## 📊 Vercel Dashboard Settings

### Recommended Settings:

1. **General:**
   - Node.js Version: 20.x
   - Build Command: (empty or `echo 'No build needed'`)
   - Output Directory: (empty)
   - Install Command: `npm install`

2. **Functions:**
   - Runtime: Node.js 20.x
   - Max Duration: 30s (Pro: 60s, Enterprise: 900s)
   - Memory: 1024 MB

3. **Environment Variables:**
   - Add all required variables
   - Set for Production, Preview, and Development

## 🔍 Monitoring & Debugging

### View Logs:
```bash
# Via CLI
vercel logs

# Or in Dashboard
# Vercel Dashboard → Your Project → Deployments → View Function Logs
```

### Common Issues:

1. **Function Timeout:**
   - Increase `maxDuration` in vercel.json
   - Optimize database queries
   - Use connection pooling

2. **Cold Starts:**
   - Normal for first request
   - Subsequent requests are faster
   - Consider Vercel Pro for better performance

3. **Database Connection:**
   - Ensure MongoDB URI is correct
   - Check network access (IP whitelist)
   - Verify connection string format

## 🎯 Best Practices

### 1. **Environment Variables**
- ✅ Never commit `.env` files
- ✅ Use Vercel Dashboard for secrets
- ✅ Use different values for dev/prod

### 2. **Error Handling**
- ✅ Always return proper HTTP status codes
- ✅ Don't expose sensitive error details
- ✅ Log errors for debugging

### 3. **Performance**
- ✅ Cache database connections
- ✅ Use async/await properly
- ✅ Optimize database queries
- ✅ Minimize dependencies

### 4. **Security**
- ✅ Use HTTPS (automatic on Vercel)
- ✅ Validate all inputs
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting (consider middleware)

## 📈 Scaling

Vercel automatically scales your functions:
- **Free Tier:** 100GB bandwidth, 100 hours execution
- **Pro Tier:** Unlimited bandwidth, better performance
- **Enterprise:** Custom limits, dedicated support

## 🔄 Updates & Maintenance

### Update Dependencies:
```bash
cd server
npm update
npm audit fix
```

### Redeploy:
```bash
# Automatic on git push
# Or manually:
vercel --prod
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express on Vercel](https://vercel.com/guides/hosting-backend-apis)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## ✅ Checklist Before Deployment

- [ ] All environment variables set in Vercel
- [ ] Database connection string configured
- [ ] CORS origin set correctly
- [ ] Health check endpoint working
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Dependencies up to date
- [ ] `.vercelignore` configured
- [ ] Git repository connected
- [ ] Build settings verified

---

**Your backend is now ready for production deployment on Vercel! 🚀**
