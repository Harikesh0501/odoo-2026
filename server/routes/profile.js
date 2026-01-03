const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, profileController.getCurrentProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, profileController.updateProfile);

module.exports = router;
