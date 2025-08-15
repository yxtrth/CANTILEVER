# 🚀 Netlify Deployment Checklist

## ✅ Pre-Deployment Checklist

### Backend Deployment (Deploy First!)
- [ ] Choose backend hosting platform (Railway/Render/Heroku)
- [ ] Set up MongoDB Atlas database
- [ ] Configure environment variables:
  - [ ] `MONGODB_URI` (MongoDB Atlas connection string)
  - [ ] `JWT_SECRET` (strong secret key)
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (usually set automatically)
- [ ] Deploy backend and note the URL

### Frontend Deployment (Deploy Second!)
- [ ] Update `REACT_APP_API_URL` environment variable in Netlify
- [ ] Test backend API endpoints are working
- [ ] Push latest changes to GitHub
- [ ] Deploy to Netlify

## 🔧 Netlify Configuration

### Build Settings
- **Base directory**: `(root)`
- **Build command**: `cd client && npm run build`
- **Publish directory**: `client/build`

### Environment Variables (Set in Netlify Dashboard)
- **REACT_APP_API_URL**: `https://your-backend-url.com/api`

### Files Created for Deployment
- ✅ `client/public/_redirects` - Handles React Router
- ✅ `netlify.toml` - Netlify configuration
- ✅ `client/.env.example` - Environment variables template

## 🐛 Common Issues & Solutions

### Issue: API calls failing in production
**Solution**: Make sure `REACT_APP_API_URL` is set correctly in Netlify environment variables

### Issue: 404 errors on page refresh
**Solution**: The `_redirects` file should handle this automatically

### Issue: Build fails
**Solution**: 
1. Check that all dependencies are in `client/package.json`
2. Ensure build command is `cd client && npm run build`
3. Check build logs for specific errors

### Issue: CORS errors
**Solution**: Make sure your backend includes proper CORS configuration for your Netlify domain

## 📝 After Deployment

- [ ] Test user registration and login
- [ ] Test creating and viewing blog posts
- [ ] Test responsive design on mobile
- [ ] Verify all retro styling is working
- [ ] Check browser console for any errors

## 🌐 Example URLs Structure

After deployment, your URLs will look like:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend API**: `https://your-backend.railway.app/api`

## 📚 Helpful Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

🎉 **Ready to deploy your retro blog to the world!** 🌍
