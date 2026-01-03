const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

router.post('/clockin', auth, attendanceController.clockIn);
router.post('/clockout', auth, attendanceController.clockOut);
router.get('/status', auth, attendanceController.getStatus);
router.get('/history', auth, attendanceController.getHistory);

module.exports = router;
