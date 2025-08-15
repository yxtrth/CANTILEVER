import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { formatDate, generateAvatar, timeAgo } from '../utils/helpers';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      const postData = response.data;
      setPost(postData);
      
      // Check if current user has liked the post
      if (user && postData.likes.includes(user._id)) {
        setIsLiked(true);
      }
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Error fetching post:', error);
      if (error.response?.status === 404) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to like posts');
      navigate('/login');
      return;
    }

    try {
      setLiking(true);
      const response = await postService.likePost(id);
      
      // Update post likes count and user's like status
      setPost(prev => ({
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(likeId => likeId !== user._id)
          : [...prev.likes, user._id]
      }));
      
      setIsLiked(!isLiked);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to like post');
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Please log in to comment');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setCommenting(true);
      const response = await postService.addComment(id, newComment);
      
      // Add new comment to the post
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, response.data.comment]
      }));
      
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await postService.deleteComment(id, commentId);
      
      // Remove comment from the post
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment._id !== commentId)
      }));
      
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className="error-page">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  const canEditPost = user && user._id === post.author._id;

  return (
    <div className="container">
      <article className="post-detail-container">
        {/* Post Header */}
        <header className="post-detail-header">
          <h1>{post.title}</h1>
          
          <div className="post-meta" style={{ color: 'rgba(255,255,255,0.9)' }}>
            <div className="author-info">
              <div className="avatar">
                {generateAvatar(`${post.author.firstName} ${post.author.lastName}`)}
              </div>
              <div>
                <div>{post.author.firstName} {post.author.lastName}</div>
                <small>@{post.author.username}</small>
              </div>
            </div>
            <div>
              <div>{formatDate(post.publishedAt || post.createdAt)}</div>
              <small>{post.category}</small>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div style={{ width: '100%', maxHeight: '400px', overflow: 'hidden' }}>
            <img 
              src={post.featuredImage} 
              alt={post.title}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Post Content */}
        <div className="post-detail-content">
          {/* Post Stats */}
          <div className="post-meta mb-3">
            <span>👁️ {post.views} views</span>
            <span>❤️ {post.likes.length} likes</span>
            <span>💬 {post.comments.length} comments</span>
          </div>

          {/* Post Actions for Author */}
          {canEditPost && (
            <div className="post-actions mb-3">
              <Link to={`/edit-post/${post._id}`} className="btn btn-secondary mr-2">
                ✏️ Edit Post
              </Link>
              <span className={`status-badge ${post.isPublished ? 'status-published' : 'status-draft'}`}>
                {post.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          )}

          {/* Post Content */}
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Like Button */}
          <div className="post-actions mt-3">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`like-btn ${isLiked ? 'liked' : ''}`}
            >
              {isLiked ? '❤️' : '🤍'} {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
            </button>
          </div>

          {/* Author Bio */}
          {post.author.bio && (
            <div className="card mt-3">
              <div className="card-body">
                <h4>About the Author</h4>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="avatar">
                    {generateAvatar(`${post.author.firstName} ${post.author.lastName}`)}
                  </div>
                  <div>
                    <strong>{post.author.firstName} {post.author.lastName}</strong>
                    <div className="text-muted">@{post.author.username}</div>
                  </div>
                </div>
                <p>{post.author.bio}</p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <section className="comment-section">
        <h3>Comments ({post.comments.length})</h3>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-3">
            <div className="form-group">
              <textarea
                className="form-control"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                disabled={commenting}
              />
            </div>
            <button 
              type="submit" 
              className="btn"
              disabled={commenting || !newComment.trim()}
            >
              {commenting ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <div className="alert alert-info">
            <Link to="/login">Login</Link> to add comments
          </div>
        )}

        {/* Comments List */}
        {post.comments.length > 0 ? (
          <div>
            {post.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {generateAvatar(`${comment.author.firstName} ${comment.author.lastName}`)}
                    </div>
                    <div>
                      <div className="comment-author">
                        {comment.author.firstName} {comment.author.lastName}
                      </div>
                      <div className="comment-date">
                        {timeAgo(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete comment button for comment author */}
                  {user && user._id === comment.author._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div style={{ marginTop: '10px' }}>
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        )}
      </section>
    </div>
  );
};

export default PostDetail;
