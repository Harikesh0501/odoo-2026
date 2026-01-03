import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (err) {
            console.error("Error fetching leaves", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves/apply', formData);
            setShowModal(false);
            setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
            fetchLeaves(); // Refresh list
            alert("Leave application submitted!");
        } catch (err) {
            console.error("Error applying for leave", err);
            alert(err.response?.data?.msg || "Failed to apply for leave");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading Leaves...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>Apply for Leave</Button>
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">Leave History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-secondary text-sm">
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Start Date</th>
                                <th className="px-6 py-4 font-medium">End Date</th>
                                <th className="px-6 py-4 font-medium">Reason</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Applied On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leaves.length > 0 ? (
                                leaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{leave.leaveType}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">{formatDate(leave.startDate)}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">{formatDate(leave.endDate)}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">{leave.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                                leave.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                leave.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondary">{formatDate(leave.appliedDate)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-secondary text-sm">
                                        No leave applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Apply Leave Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply for Leave">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Annual Leave">Annual Leave</option>
                            <option value="Maternity Leave">Maternity Leave</option>
                            <option value="Paternity Leave">Paternity Leave</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Input
                        label="Reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Submit Application</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Leaves;