import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'General',
    tags: '',
    featuredImage: '',
    isPublished: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const categories = [
    'General', 'Technology', 'Lifestyle', 'Travel', 'Food', 
    'Health', 'Business', 'Education', 'Entertainment', 'Sports'
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      const post = response.data;
      
      // Check if user owns the post
      if (post.author._id !== user._id) {
        toast.error('You are not authorized to edit this post');
        navigate('/dashboard');
        return;
      }

      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category,
        tags: post.tags.join(', '),
        featuredImage: post.featuredImage || '',
        isPublished: post.isPublished
      });
    } catch (error) {
      toast.error('Failed to load post');
      console.error('Error fetching post:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
    
    if (errors.content) {
      setErrors(prev => ({
        ...prev,
        content: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }

    if (formData.excerpt && formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt must be less than 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray
      };

      await postService.updatePost(id, postData);
      
      toast.success('Post updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
      console.error('Error updating post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title to save draft');
      return;
    }

    try {
      setSaving(true);
      
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray,
        isPublished: false
      };

      await postService.updatePost(id, postData);
      
      toast.success('Draft saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save draft');
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>Edit Post</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your post"
              disabled={saving}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                disabled={saving}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. react, javascript, web development"
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt (Optional)</label>
            <textarea
              id="excerpt"
              name="excerpt"
              className={`form-control ${errors.excerpt ? 'error' : ''}`}
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief description of your post (will be auto-generated if left empty)"
              rows="3"
              disabled={saving}
            />
            {errors.excerpt && <div className="error-message">{errors.excerpt}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="featuredImage">Featured Image URL (Optional)</label>
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              className="form-control"
              value={formData.featuredImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleContentChange}
              modules={quillModules}
              placeholder="Write your post content here..."
              style={{ minHeight: '300px' }}
            />
            {errors.content && <div className="error-message">{errors.content}</div>}
          </div>

          <div className="form-group">
            <label className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                disabled={saving}
              />
              <span>Published</span>
            </label>
            <small className="text-muted">
              Check to publish the post, uncheck to save as draft
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn btn-secondary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              className="btn"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
