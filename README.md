# Modern Blog Website

A full-stack blog website built with React frontend, Node.js/Express backend, and MongoDB database. Features user authentication, CRUD operations for blog posts, commenting, and more.

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- User profile management

### Blog Management
- Create, read, update, and delete blog posts
- Rich text editor for content creation
- Featured images support
- Categories and tags
- Draft and publish functionality
- Post search and filtering

### Social Features
- Like/unlike posts
- Comment system
- View tracking
- Author profiles

### Responsive Design
- Mobile-friendly interface
- Modern UI/UX design
- Toast notifications
- Loading states

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Quill (Rich text editor)
- React Toastify (Notifications)
- Axios (HTTP client)
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Express Validator for input validation
- CORS support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-website
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run install:all
   ```
   
   Or install manually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blogwebsite
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud database
   ```

5. **Run the application**
   
   Start both frontend and backend:
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server:dev
   
   # Terminal 2 - Frontend
   npm run client:dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all published posts (with pagination)
- `GET /api/posts/my-posts` - Get current user's posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment

### Users
- `GET /api/users` - Get all users
- `GET /api/users/profile/:id` - Get user profile

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  content: String,
  excerpt: String,
  author: ObjectId (ref: User),
  tags: [String],
  category: String,
  featuredImage: String,
  isPublished: Boolean,
  publishedAt: Date,
  views: Number,
  likes: [ObjectId] (ref: User),
  comments: [{
    author: ObjectId (ref: User),
    content: String,
    createdAt: Date
  }],
  slug: String (unique),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment Options

### Option 1: Heroku (Backend) + Netlify (Frontend)

#### Deploy Backend to Heroku:
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to GitHub or deploy via CLI
4. Use MongoDB Atlas for database

#### Deploy Frontend to Netlify:
1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variable `REACT_APP_API_URL` to your Heroku backend URL

### Option 2: Railway, Render, or DigitalOcean
Similar deployment process with platform-specific configurations.

### Option 3: Docker Deployment
```dockerfile
# Dockerfile for the entire application
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
```

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogwebsite
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Scripts

### Root Package Scripts
- `npm run dev` - Start both frontend and backend in development
- `npm run install:all` - Install all dependencies
- `npm run build` - Build the client for production
- `npm start` - Start the production server

### Server Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Features to Add

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Image upload with Cloudinary
- [ ] Advanced search and filtering
- [ ] User roles (admin, moderator)
- [ ] Post scheduling
- [ ] Social media sharing
- [ ] Email notifications
- [ ] SEO optimizations
- [ ] Analytics dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email your-email@example.com or create an issue in the repository.

## Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB team
- All open-source contributors
"# CANTILEVER" 
