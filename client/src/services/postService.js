import api from './api';

export const postService = {
  // Get all posts
  getAllPosts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/posts?${queryString}`);
  },

  // Get user's posts
  getMyPosts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/posts/my-posts?${queryString}`);
  },

  // Get single post
  getPost: (id) => {
    return api.get(`/posts/${id}`);
  },

  // Get post by slug
  getPostBySlug: (slug) => {
    return api.get(`/posts/slug/${slug}`);
  },

  // Create post
  createPost: (postData) => {
    return api.post('/posts', postData);
  },

  // Update post
  updatePost: (id, postData) => {
    return api.put(`/posts/${id}`, postData);
  },

  // Delete post
  deletePost: (id) => {
    return api.delete(`/posts/${id}`);
  },

  // Like/unlike post
  likePost: (id) => {
    return api.post(`/posts/${id}/like`);
  },

  // Add comment
  addComment: (id, content) => {
    return api.post(`/posts/${id}/comment`, { content });
  },

  // Delete comment
  deleteComment: (postId, commentId) => {
    return api.delete(`/posts/${postId}/comment/${commentId}`);
  }
};

export default postService;
