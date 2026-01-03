// Script to reset the Attendance collection and fix index issues
require('dotenv').config();
const mongoose = require('mongoose');

const resetAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the entire attendances collection to remove old indexes
        await mongoose.connection.db.dropCollection('attendances');
        console.log('✅ Dropped attendances collection');

        console.log('✅ Done! Please restart your server.');
        process.exit(0);
    } catch (err) {
        if (err.message.includes('ns not found')) {
            console.log('Collection does not exist, nothing to drop');
        } else {
            console.error('Error:', err);
        }
        process.exit(1);
    }
};

resetAttendance();
