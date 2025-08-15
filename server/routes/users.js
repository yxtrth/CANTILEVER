const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// @route   GET /api/users
// @desc    Get all users (for admin purposes or user listing)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('username firstName lastName avatar bio createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;
