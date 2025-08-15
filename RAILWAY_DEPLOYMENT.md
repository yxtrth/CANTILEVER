# Railway Backend Deployment Guide

## 🚂 Deploy Your Retro Blog Backend to Railway

### Step 1: Setup Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" and sign in with GitHub
3. Authorize Railway to access your repositories

### Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `CANTILEVER` repository
4. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables
In your Railway project dashboard, go to "Variables" and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogwebsite
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
PORT=5000
```

### Step 4: Set Root Directory (Important!)
1. Go to "Settings" in your Railway project
2. Set "Root Directory" to `server`
3. This tells Railway to deploy from the server folder

### Step 5: Deploy!
- Railway will automatically build and deploy
- You'll get a URL like: `https://cantilever-production.up.railway.app`

### Step 6: Update Netlify Environment Variable
In your Netlify dashboard, set:
```
REACT_APP_API_URL=https://your-railway-url.railway.app/api
```

## 🔍 Common Issues & Solutions

### Issue: Build fails
**Solution**: Make sure "Root Directory" is set to `server` in Railway settings

### Issue: Database connection fails
**Solution**: 
1. Create MongoDB Atlas account (free)
2. Get connection string
3. Add to `MONGODB_URI` in Railway variables

### Issue: CORS errors
**Solution**: Your backend already has CORS configured, but make sure your Netlify domain is allowed

## 📊 Railway Benefits
- ✅ Free tier: 500 hours/month
- ✅ Automatic deployments from GitHub
- ✅ Built-in databases (if needed)
- ✅ Easy environment variable management
- ✅ Automatic HTTPS

## 🎯 Final URLs Structure
- **Backend API**: `https://your-app.railway.app/api`
- **Frontend**: `https://your-site.netlify.app`
- **Database**: MongoDB Atlas (cloud)

---

**Your retro blog will be live and ready to rock the 90s vibes! 🕹️**
