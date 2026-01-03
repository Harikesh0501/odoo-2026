const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @route   GET api/payroll
// @desc    Get user's payroll history
// @access  Private
exports.getPayroll = async (req, res) => {
    try {
        const payrolls = await Payroll.find({ user: req.user.id }).sort({ year: -1, month: -1 });
        res.json(payrolls);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/payroll/:id
// @desc    Get single payroll
// @access  Private
exports.getPayrollById = async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);

        if (!payroll) {
            return res.status(404).json({ msg: 'Payroll not found' });
        }

        // Check if user owns the payroll
        if (payroll.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(payroll);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/payroll/generate
// @desc    Generate payroll for a month
// @access  Private
exports.generatePayroll = async (req, res) => {
    try {
        const { month, year, basicSalary } = req.body;

        if (!month || !year || !basicSalary) {
            return res.status(400).json({ msg: 'Month, year, and basic salary are required' });
        }

        // Check if payroll already exists
        const existing = await Payroll.findOne({ user: req.user.id, month, year });
        if (existing) {
            return res.status(400).json({ msg: 'Payroll already generated for this month' });
        }

        // Simple payroll generation - for demo purposes
        // In a real app, this would be more complex with attendance, taxes, etc.
        const allowances = basicSalary * 0.1; // 10% allowances
        const deductions = basicSalary * 0.05; // 5% deductions
        const netSalary = parseFloat(basicSalary) + allowances - deductions;

        const payroll = new Payroll({
            user: req.user.id,
            month: month.toString().padStart(2, '0'),
            year: parseInt(year),
            basicSalary: parseFloat(basicSalary),
            allowances,
            deductions,
            netSalary,
            workingDays: 30, // Assuming 30 days
            presentDays: 30 // Assuming full attendance for demo
        });

        await payroll.save();
        res.json(payroll);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};