import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from '../components/Button';

const Attendance = () => {
    const [status, setStatus] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every second for the clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        try {
            const [statusRes, historyRes] = await Promise.all([
                api.get('/attendance/status'),
                api.get('/attendance/history')
            ]);
            setStatus(statusRes.data);
            setHistory(historyRes.data);
            console.log("[DEBUG] Frontend History Data:", historyRes.data);
        } catch (err) {
            console.error("Error fetching attendance data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClockIn = async () => {
        try {
            await api.post('/attendance/clockin');
            fetchData(); // Refresh data
        } catch (err) {
            console.error("Error clocking in", err);
            alert(err.response?.data?.msg || "Failed to clock in");
        }
    };

    const handleClockOut = async () => {
        try {
            await api.post('/attendance/clockout');
            fetchData(); // Refresh data
        } catch (err) {
            console.error("Error clocking out", err);
            alert(err.response?.data?.msg || "Failed to clock out");
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Calculate duration for the running timer if clocked in
    const getRunningDuration = () => {
        if (status?.clockedIn && status?.loginTime && !status?.logoutTime) {
            const start = new Date(status.loginTime);
            const diff = currentTime - start;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return null;
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading Attendance...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header / Stats Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>

                <div className="mb-2 text-secondary font-medium uppercase tracking-wider text-sm">Today's Status</div>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>

                {status?.clockedIn && !status?.logoutTime ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Clocked In
                        </div>
                        <div className="text-2xl font-mono font-medium text-gray-700">
                            {getRunningDuration()}
                        </div>
                        <div className="mt-2">
                            <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={handleClockOut}>Clock Out</Button>
                        </div>
                    </div>
                ) : status?.logoutTime ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold border border-gray-200">
                            Day Completed
                        </div>
                        <p className="text-secondary text-sm">You clocked out at {formatTime(status.logoutTime)}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-semibold border border-yellow-100">
                            Not Yet Started
                        </div>
                        <div className="mt-2">
                            <Button variant="primary" className="px-8 py-3 text-lg" onClick={handleClockIn}>Clock In</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-900">Attendance History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-secondary text-sm">
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Clock In</th>
                                <th className="px-6 py-4 font-medium">Clock Out</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Total Hrs</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.length > 0 ? (
                                history.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatDate(record.date)}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">{formatTime(record.loginTime)}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">{formatTime(record.logoutTime)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${record.status === 'Present' ? 'bg-green-50 text-green-700 border-green-100' :
                                                record.status === 'Absent' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{record.totalHours || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-secondary text-sm">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
