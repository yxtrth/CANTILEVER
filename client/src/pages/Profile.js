import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { generateAvatar } from '../utils/helpers';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
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
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2>My Profile</h2>
        
        {/* Profile Overview */}
        <div className="card mb-3">
          <div className="card-body text-center">
            <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '24px', margin: '0 auto 15px' }}>
              {generateAvatar(`${user.firstName} ${user.lastName}`)}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p className="text-muted">@{user.username}</p>
            <p className="text-muted">{user.email}</p>
            <small className="text-muted">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-control ${errors.firstName ? 'error' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                disabled={loading}
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-control ${errors.lastName ? 'error' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                disabled={loading}
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className={`form-control ${errors.bio ? 'error' : ''}`}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
              disabled={loading}
            />
            <small className="text-muted">
              {formData.bio.length}/500 characters
            </small>
            {errors.bio && <div className="error-message">{errors.bio}</div>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>

        {/* Account Information */}
        <div className="card mt-4">
          <div className="card-header">
            <h3>Account Information</h3>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span><strong>Username:</strong></span>
              <span>{user.username}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span><strong>Email:</strong></span>
              <span>{user.email}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span><strong>Account Status:</strong></span>
              <span className={`status-badge ${user.isActive ? 'status-published' : 'status-draft'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span><strong>Member Since:</strong></span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="card mt-4">
          <div className="card-header">
            <h3>Security</h3>
          </div>
          <div className="card-body">
            <p className="text-muted mb-3">
              For security reasons, email and username changes are not currently available. 
              If you need to update these details, please contact support.
            </p>
            <div className="alert alert-info">
              <strong>Password Changes:</strong> Password reset functionality will be available in a future update. 
              For now, please contact support if you need to change your password.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
