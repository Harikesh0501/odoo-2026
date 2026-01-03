const Leave = require('../models/Leave');

// @route   POST api/leaves/apply
// @desc    Apply for leave
// @access  Private
exports.applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const leave = new Leave({
            user: req.user.id,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await leave.save();
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/leaves
// @desc    Get user's leave history
// @access  Private
exports.getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user.id }).sort({ appliedDate: -1 });
        res.json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/leaves/:id
// @desc    Get single leave
// @access  Private
exports.getLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ msg: 'Leave not found' });
        }

        // Check if user owns the leave
        if (leave.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};