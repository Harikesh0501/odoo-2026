const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String, // YYYY-MM
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
    },
    workingDays: {
        type: Number,
        default: 0
    },
    presentDays: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Paid'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    },
    generatedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Compound index to ensure one payroll per user per month
PayrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', PayrollSchema);