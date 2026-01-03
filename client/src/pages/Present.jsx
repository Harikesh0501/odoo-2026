import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from '../components/Button';

const Present = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await api.get('/attendance/status');
            setStatus(res.data);
        } catch (err) {
            console.error("Error fetching status", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleMarkPresent = async () => {
        try {
            await api.post('/attendance/clockin');
            fetchStatus(); // Refresh status
            alert("Marked as Present!");
        } catch (err) {
            console.error("Error marking present", err);
            alert(err.response?.data?.msg || "Failed to mark present");
        }
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mark Attendance</h2>
                {status?.clockedIn ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100">
                            Already Marked Present
                        </div>
                        <p className="text-secondary">You are marked as present for today.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-secondary mb-4">Click below to mark yourself as present.</p>
                        <Button variant="primary" onClick={handleMarkPresent}>Mark Present</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Present;