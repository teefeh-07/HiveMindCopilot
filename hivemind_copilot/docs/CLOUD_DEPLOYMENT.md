# 🚀 HiveMind Copilot Cloud Deployment Guide

## Quick Cloud Deployment Options

### Option 1: Railway (Recommended - Free Tier)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend**:
   ```bash
   cd hivemind
   railway login
   railway project new hivemind-copilot-backend
   railway up
   ```

3. **Set Environment Variables** in Railway dashboard:
   - `GROQ_API_KEY`: Your Groq API key
   - `HEDERA_ACCOUNT_ID`: 0.0.6273048
   - `HEDERA_PRIVATE_KEY`: Your private key
   - `HEDERA_NETWORK`: testnet

4. **Get Your URL**: Railway will provide a URL like `https://your-app.railway.app`

### Option 2: Render (Free Tier)

1. **Connect GitHub**: Link your repository to Render
2. **Create Web Service**: Use the `render.yaml` configuration
3. **Set Environment Variables**: Add all variables from `.env`
4. **Deploy**: Automatic deployment from GitHub

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Create App**:
   ```bash
   cd hivemind
   heroku create hivemind-copilot-backend
   git push heroku main
   ```

## Frontend Deployment

### VS Code Extension (Current)
- Update `package.json` API URL to your cloud backend
- Rebuild: `npm run compile && npx vsce package`
- Install new VSIX file

### Web Version (New)
- Deploy `web-frontend/` to Netlify/Vercel
- Static hosting with API calls to cloud backend
- Accessible from any browser

## Quick Test
```bash
# Test your deployed backend
curl https://your-backend-url.com/health

# Expected response:
{"status":"healthy","version":"0.1.0"}
```

## Files Created for Deployment:
- ✅ `Dockerfile` - Container configuration
- ✅ `requirements.txt` - Python dependencies  
- ✅ `railway.toml` - Railway configuration
- ✅ `render.yaml` - Render configuration
- ✅ `deploy.py` - Automated deployment script

## Next Steps:
1. Choose a platform (Railway recommended)
2. Deploy backend using above steps
3. Update extension with new API URL
4. Test from any device/location

Your backend is ready for cloud deployment! 🎉
