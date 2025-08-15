import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { formatDateShort, timeAgo } from '../utils/helpers';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getMyPosts();
      const userPosts = response.data.posts;
      setPosts(userPosts);
      
      // Calculate stats
      const totalPosts = userPosts.length;
      const publishedPosts = userPosts.filter(post => post.isPublished).length;
      const draftPosts = totalPosts - publishedPosts;
      const totalViews = userPosts.reduce((sum, post) => sum + post.views, 0);
      const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
      
      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
        totalLikes
      });
    } catch (error) {
      toast.error('Failed to fetch your posts');
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      toast.success('Post deleted successfully');
      fetchUserPosts(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p className="text-muted">Here's an overview of your blog activity</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>{stats.totalPosts}</h3>
          <p>Total Posts</p>
        </div>
        <div className="dashboard-card">
          <h3>{stats.publishedPosts}</h3>
          <p>Published Posts</p>
        </div>
        <div className="dashboard-card">
          <h3>{stats.draftPosts}</h3>
          <p>Draft Posts</p>
        </div>
        <div className="dashboard-card">
          <h3>{stats.totalViews}</h3>
          <p>Total Views</p>
        </div>
        <div className="dashboard-card">
          <h3>{stats.totalLikes}</h3>
          <p>Total Likes</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <Link to="/create-post" className="btn">
          ✏️ Write New Post
        </Link>
        <Link to="/profile" className="btn btn-outline">
          👤 Edit Profile
        </Link>
        <Link to="/" className="btn btn-secondary">
          🏠 View Blog
        </Link>
      </div>

      {/* Posts Table */}
      <div className="posts-table">
        <div className="card-header">
          <h3>Your Posts</h3>
        </div>
        
        {loading ? (
          <div className="loading">Loading your posts...</div>
        ) : posts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <strong>{post.title}</strong>
                    <br />
                    <small className="text-muted">
                      {post.excerpt && post.excerpt.substring(0, 60)}...
                    </small>
                  </td>
                  <td>
                    <span className={`status-badge ${post.isPublished ? 'status-published' : 'status-draft'}`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{post.category}</td>
                  <td>{post.views}</td>
                  <td>{post.likes.length}</td>
                  <td>{post.comments.length}</td>
                  <td>
                    <small>
                      {post.isPublished 
                        ? formatDateShort(post.publishedAt) 
                        : `Created ${timeAgo(post.createdAt)}`
                      }
                    </small>
                  </td>
                  <td>
                    <div className="post-actions-table">
                      <button
                        onClick={() => handleViewPost(post._id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEditPost(post._id)}
                        className="edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Start writing your first blog post to share your thoughts with the world!</p>
            <Link to="/create-post" className="btn">
              Create Your First Post
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {posts.length > 0 && (
        <div className="quick-stats" style={{ marginTop: '30px' }}>
          <div className="card">
            <div className="card-header">
              <h3>Quick Insights</h3>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Most viewed post:</span>
                <strong>
                  {posts.reduce((max, post) => post.views > max.views ? post : max, posts[0])?.title || 'N/A'}
                </strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Most liked post:</span>
                <strong>
                  {posts.reduce((max, post) => post.likes.length > max.likes.length ? post : max, posts[0])?.title || 'N/A'}
                </strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Publishing rate:</span>
                <strong>
                  {Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% published
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
