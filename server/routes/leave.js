const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

router.post('/apply', auth, leaveController.applyLeave);
router.get('/', auth, leaveController.getLeaves);
router.get('/:id', auth, leaveController.getLeave);

module.exports = router;