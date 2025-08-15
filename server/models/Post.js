const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  featuredImage: {
    type: String,
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  slug: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Create slug from title
postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim() + '-' + Date.now();
  }
  
  // Set published date
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Create excerpt from content if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  }
  
  next();
});

// Index for search and performance
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model('Post', postSchema);
