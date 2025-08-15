import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postService } from '../services/postService';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'General',
    tags: '',
    featuredImage: '',
    isPublished: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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
      setLoading(true);
      
      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray
      };

      const response = await postService.createPost(postData);
      
      toast.success('Post created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title to save draft');
      return;
    }

    try {
      setLoading(true);
      
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...formData,
        tags: tagsArray,
        isPublished: false
      };

      await postService.createPost(postData);
      
      toast.success('Draft saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save draft');
      console.error('Error saving draft:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create New Post</h2>
        
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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
              />
              <span>Publish immediately</span>
            </label>
            <small className="text-muted">
              If unchecked, post will be saved as draft
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? 'Publishing...' : (formData.isPublished ? 'Publish Post' : 'Save Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
