import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-secondary font-medium mb-2">Total Employees</h3>
                    <p className="text-3xl font-bold text-gray-900">124</p>
                    <span className="text-sm text-green-500 font-medium">↑ 12% from last month</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-secondary font-medium mb-2">On Leave Today</h3>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-secondary font-medium mb-2">New Hires</h3>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Dayflow</h2>
                    <p className="text-secondary">Select "My Profile" from the sidebar to view the implementation.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
