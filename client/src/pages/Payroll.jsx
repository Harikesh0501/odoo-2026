import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Payroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [generateForm, setGenerateForm] = useState({
        month: '',
        year: '',
        basicSalary: ''
    });

    const fetchPayrolls = async () => {
        try {
            const res = await api.get('/payroll');
            setPayrolls(res.data);
        } catch (err) {
            console.error("Error fetching payrolls", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payroll/generate', generateForm);
            setShowModal(false);
            setGenerateForm({ month: '', year: '', basicSalary: '' });
            fetchPayrolls(); // Refresh list
            alert("Payroll generated successfully!");
        } catch (err) {
            console.error("Error generating payroll", err);
            alert(err.response?.data?.msg || "Failed to generate payroll");
        }
    };

    const handleViewDetails = (payroll) => {
        setSelectedPayroll(payroll);
    };

    const formatMonth = (month) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[parseInt(month) - 1];
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading Payroll...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>Generate Payroll</Button>
            </div>

            {/* Payroll History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">Payroll History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-secondary text-sm">
                                <th className="px-6 py-4 font-medium">Month</th>
                                <th className="px-6 py-4 font-medium">Year</th>
                                <th className="px-6 py-4 font-medium">Basic Salary</th>
                                <th className="px-6 py-4 font-medium">Net Salary</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payrolls.length > 0 ? (
                                payrolls.map((payroll) => (
                                    <tr key={payroll._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatMonth(payroll.month)}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">{payroll.year}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">₹{payroll.basicSalary.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-secondary">₹{payroll.netSalary.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                                payroll.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                                                payroll.status === 'Processed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-100'
                                            }`}>
                                                {payroll.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(payroll)}>View Details</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-secondary text-sm">
                                        No payroll records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Generate Payroll Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate Payroll">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select
                                name="month"
                                value={generateForm.month}
                                onChange={(e) => setGenerateForm({ ...generateForm, month: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            >
                                <option value="">Select Month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                        {formatMonth(String(i + 1).padStart(2, '0'))}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={generateForm.year}
                                onChange={(e) => setGenerateForm({ ...generateForm, year: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="2024"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                        <input
                            type="number"
                            name="basicSalary"
                            value={generateForm.basicSalary}
                            onChange={(e) => setGenerateForm({ ...generateForm, basicSalary: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="50000"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Generate</Button>
                    </div>
                </form>
            </Modal>

            {/* Payroll Details Modal */}
            <Modal isOpen={!!selectedPayroll} onClose={() => setSelectedPayroll(null)} title="Payroll Details">
                {selectedPayroll && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary">Month</p>
                                <p className="font-medium">{formatMonth(selectedPayroll.month)} {selectedPayroll.year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Status</p>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                    selectedPayroll.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                                    selectedPayroll.status === 'Processed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-100'
                                }`}>
                                    {selectedPayroll.status}
                                </span>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-secondary">Basic Salary</p>
                                    <p className="font-medium">₹{selectedPayroll.basicSalary.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Allowances</p>
                                    <p className="font-medium">₹{selectedPayroll.allowances.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Deductions</p>
                                    <p className="font-medium">₹{selectedPayroll.deductions.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-secondary">Net Salary</p>
                                    <p className="font-bold text-lg">₹{selectedPayroll.netSalary.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div>
                                <p className="text-sm text-secondary">Working Days</p>
                                <p className="font-medium">{selectedPayroll.workingDays}</p>
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Present Days</p>
                                <p className="font-medium">{selectedPayroll.presentDays}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Payroll;