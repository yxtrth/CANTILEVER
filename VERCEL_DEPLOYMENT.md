# 🚀 Vercel Backend Deployment Guide

## Environment Variables for Vercel Dashboard

### 📋 Required Variables
Set these in your Vercel project settings → Environment Variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/blogwebsite` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your_super_secret_jwt_key_here_make_it_long_and_random` | Strong random secret for JWT tokens |
| `NODE_ENV` | `production` | Sets app to production mode |

### 🔐 Example Values

**MONGODB_URI:**
```
mongodb+srv://bloguser:mypassword123@cluster0.abc123.mongodb.net/blogwebsite?retryWrites=true&w=majority
```

**JWT_SECRET:**
```
retro_blog_2024_super_secret_jwt_key_abcdefghijklmnopqrstuvwxyz123456789
```

**NODE_ENV:**
```
production
```

## 🛠️ Deployment Steps

### 1. Deploy Backend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `server`
4. Add the environment variables above
5. Deploy!

### 2. Get Your Backend URL
After deployment, Vercel will give you a URL like:
```
https://cantilever-backend.vercel.app
```

### 3. Update Frontend (Netlify)
In your Netlify dashboard, set:
```
REACT_APP_API_URL=https://your-vercel-url.vercel.app/api
```

## 📁 Files Created
- ✅ `server/vercel.json` - Vercel configuration
- ✅ This deployment guide

## 🔍 Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution**: Make sure Root Directory is set to `server` in Vercel

### Issue: Database connection fails
**Solution**: Double-check your MongoDB Atlas connection string and whitelist all IPs (0.0.0.0/0)

### Issue: CORS errors
**Solution**: Your backend already has CORS configured for all origins

## 🎯 Final Architecture
```
Frontend (Netlify) ←→ Backend (Vercel) ←→ Database (MongoDB Atlas)
```

## 🌟 Benefits of Vercel
- ✅ Automatic deployments from GitHub
- ✅ Serverless functions (fast cold starts)
- ✅ Global CDN
- ✅ Great developer experience
- ✅ Free tier with good limits

---

**Your retro blog backend will be deployed and ready! 🕹️**
