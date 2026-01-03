const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Storing as YYYY-MM-DD for easy querying
        required: true
    },
    loginTime: {
        type: Date
    },
    logoutTime: {
        type: Date
    },
    status: {
        type: String, // 'Present', 'Absent', 'Half Day'
        default: 'Absent'
    },
    totalHours: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Compound index to ensure one attendance record per user per day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
