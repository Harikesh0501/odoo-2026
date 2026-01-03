const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const payrollController = require('../controllers/payrollController');

router.get('/', auth, payrollController.getPayroll);
router.get('/:id', auth, payrollController.getPayrollById);
router.post('/generate', auth, payrollController.generatePayroll);

module.exports = router;