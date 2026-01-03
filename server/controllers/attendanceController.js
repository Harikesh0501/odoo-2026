const Attendance = require('../models/Attendance');

// Helper to get today's date string YYYY-MM-DD
const getTodayDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
};

// @route   POST api/attendance/clockin
// @desc    Clock in for the day
// @access  Private
exports.clockIn = async (req, res) => {
    try {
        console.log('[DEBUG] ClockIn Request User:', req.user);

        if (!req.user || !req.user.id) {
            throw new Error('User ID missing from request');
        }

        const today = getTodayDate();

        // Check if attendance already exists
        let attendance = await Attendance.findOne({ user: req.user.id, date: today });

        if (attendance) {
            return res.status(400).json({ msg: 'Already clocked in for today' });
        }

        attendance = new Attendance({
            user: req.user.id,
            date: today,
            loginTime: new Date(),
            status: 'Present'
        });

        await attendance.save();
        res.json(attendance);
    } catch (err) {
        console.error('[DEBUG] ClockIn Error:', err);
        // Send JSON so frontend can display err.response.data.msg
        res.status(500).json({ msg: 'Server Error: ' + err.message, error: err.toString() });
    }
};

// @route   POST api/attendance/clockout
// @desc    Clock out for the day
// @access  Private
exports.clockOut = async (req, res) => {
    try {
        const today = getTodayDate();
        let attendance = await Attendance.findOne({ user: req.user.id, date: today });

        if (!attendance) {
            return res.status(400).json({ msg: 'Have not clocked in today' });
        }

        const logoutTime = new Date();
        attendance.logoutTime = logoutTime;

        // Calculate total hours
        const duration = logoutTime - new Date(attendance.loginTime); // in ms
        const hours = duration / (1000 * 60 * 60);
        attendance.totalHours = parseFloat(hours.toFixed(2));

        await attendance.save();
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/attendance/status
// @desc    Get today's status
// @access  Private
exports.getStatus = async (req, res) => {
    try {
        const today = getTodayDate();
        const attendance = await Attendance.findOne({ user: req.user.id, date: today });

        if (!attendance) {
            // Not clocked in yet
            return res.json({ status: 'Not Marked', clockedIn: false });
        }

        res.json({
            status: attendance.status,
            clockedIn: true,
            loginTime: attendance.loginTime,
            logoutTime: attendance.logoutTime,
            data: attendance
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/attendance/history
// @desc    Get attendance history
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        // defaults to last 30 days if no range provided
        const history = await Attendance.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(30);
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
