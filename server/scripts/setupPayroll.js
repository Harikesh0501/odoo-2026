const mongoose = require('mongoose');
const Payroll = require('../models/Payroll');
const User = require('../models/User');
require('dotenv').config();

const clearPayrollData = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error("❌ MONGODB_URI not found in .env file");
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully');

        // Get all users
        const users = await User.find({});
        console.log(`👥 Found ${users.length} users in database`);

        if (users.length === 0) {
            console.log('❌ No users found.');
            process.exit(1);
        }

        console.log('🧹 Clearing all payroll data...');
        const deleteResult = await Payroll.deleteMany({});
        console.log(`✅ Successfully cleared ${deleteResult.deletedCount} payroll records from database`);

        // Verify the data was cleared
        const remainingPayrolls = await Payroll.find({});
        console.log(`📊 Verification: ${remainingPayrolls.length} payroll records remaining in database`);

        console.log('\n🎉 All payroll data cleared successfully!');
        console.log('💡 You can now generate fresh payroll data through the frontend');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing payroll data:', error.message);
        console.error('🔍 Full error:', error);
        process.exit(1);
    }
};

clearPayrollData();