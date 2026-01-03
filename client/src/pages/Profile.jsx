import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [modalMode, setModalMode] = useState('BASIC'); // BASIC, SKILLS, CERTIFICATIONS, INTERESTS

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile/me');
            setProfile(res.data);
            setEditForm(res.data || {});
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const openModal = (mode) => {
        setModalMode(mode);
        // Reset form for that specific mode if needed
        if (mode === 'CERTIFICATIONS') {
            setEditForm(prev => ({ ...prev, certName: '', certIssuer: '', certDate: '' }));
        } else {
            // For basic info, ensure we have latest profile data
            setEditForm(profile || {});
        }
        setIsEditOpen(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.id]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/profile', editForm);
            setProfile(res.data);
            setIsEditOpen(false);
        } catch (err) {
            console.error("Error updating profile", err);
            alert("Failed to update profile");
        }
    };

    if (loading) return <div className="p-8 text-center text-secondary">Loading Profile...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
                {/* Decorative Background for Header */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50/50"></div>

                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 shrink-0">
                    {/* Placeholder for User Image */}
                    <img src={`https://ui-avatars.com/api/?name=${authUser?.name || 'User'}&background=0D8ABC&color=fff&size=128`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-4">
                    <h2 className="text-2xl font-bold text-gray-900">{authUser?.name}</h2>
                    <p className="text-secondary font-medium">{profile?.department || 'Employee'} • {profile?.location || 'Location not set'}</p>

                    <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                        <div className="flex items-center gap-1.5 text-sm text-secondary bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <span>📱</span> {profile?.mobile || 'Add Mobile'}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-secondary bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <span>✉️</span> {authUser?.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-secondary bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <span>📍</span> {profile?.location || 'Add Location'}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 md:self-start pt-4">
                    <Button variant="primary" onClick={() => openModal('BASIC')}>Edit Profile</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Info) */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">About</h3>
                        <p className="text-secondary text-sm leading-relaxed">
                            {profile?.about || 'Add a bio to tell others about yourself.'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Department</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                                💻
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{profile?.department || 'Not Assigned'}</p>
                                <p className="text-xs text-secondary">Product Development</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-secondary mb-1">Current Manager</p>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">M</div>
                                <span className="text-sm font-medium text-gray-900">{profile?.manager || 'Not Assigned'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Skills, Certs, etc) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Skills */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-900">Skills</h3>
                            <button className="text-primary text-sm font-medium hover:underline" onClick={() => openModal('SKILLS')}>+ Add New</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {profile?.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium border border-gray-100">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-secondary">No skills added yet.</span>
                            )}
                        </div>
                    </div>

                    {/* Certifications - Horizontal Scroll or Grid */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-900">Certifications</h3>
                            <button className="text-primary text-sm font-medium hover:underline" onClick={() => openModal('CERTIFICATIONS')}>+ Add New</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {profile?.certifications && profile.certifications.length > 0 ? (
                                profile.certifications.map((cert) => (
                                    <div key={cert._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-3 text-orange-500">
                                            📜
                                        </div>
                                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                                        <p className="text-xs text-secondary mt-1">{cert.issuer}</p>
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm text-secondary">No certifications added yet.</span>
                            )}
                        </div>
                    </div>

                    {/* Custom Sections from Excalidraw */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-900">Job Interests</h3>
                            <button className="text-primary text-sm font-medium hover:underline" onClick={() => openModal('INTERESTS')}>✎</button>
                        </div>
                        <p className="text-sm text-secondary leading-relaxed">
                            {profile?.jobInterests || 'Add your job interests here.'}
                        </p>
                    </div>
                </div>
            </div>

            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={
                modalMode === 'BASIC' ? 'Edit Intro' :
                    modalMode === 'SKILLS' ? 'Add Skill' :
                        modalMode === 'CERTIFICATIONS' ? 'Add Certification' :
                            modalMode === 'INTERESTS' ? 'Edit Job Interests' : 'Edit Profile'
            }>
                {modalMode === 'BASIC' && (
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                        <Input id="mobile" label="Mobile Number" value={editForm.mobile || ''} onChange={handleEditChange} placeholder="+1 234..." />
                        <Input id="location" label="Location" value={editForm.location || ''} onChange={handleEditChange} placeholder="City, Country" />
                        <Input id="department" label="Department" value={editForm.department || ''} onChange={handleEditChange} placeholder="e.g. Engineering" />
                        <Input id="manager" label="Manager Name" value={editForm.manager || ''} onChange={handleEditChange} placeholder="Manager Name" />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">About</label>
                            <textarea
                                id="about"
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 min-h-[100px]"
                                value={editForm.about || ''}
                                onChange={handleEditChange}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                )}

                {modalMode === 'SKILLS' && (
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm mb-2">
                            Tip: Add skills to highlight your expertise.
                        </div>
                        <Input
                            id="skills"
                            label="Add Skills (comma separated)"
                            value={editForm.skills ? (Array.isArray(editForm.skills) ? editForm.skills.join(', ') : editForm.skills) : ''}
                            onChange={handleEditChange}
                            placeholder="e.g. React, Project Management, Public Speaking"
                        />
                        <div className="flex gap-3 justify-end mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Skills</Button>
                        </div>
                    </form>
                )}

                {modalMode === 'CERTIFICATIONS' && (
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!editForm.certName || !editForm.certIssuer) {
                            alert("Please fill in Name and Issuer");
                            return;
                        }
                        // Handle adding a single certification to the list
                        const newCert = {
                            name: editForm.certName,
                            issuer: editForm.certIssuer,
                            date: editForm.certDate || new Date()
                        };
                        // Create a temporary profile object with the new cert appended
                        const updatedCerts = [...(profile.certifications || []), newCert];

                        try {
                            // Directly trigger save with the updated array
                            const res = await api.post('/profile', { ...profile, certifications: updatedCerts });
                            setProfile(res.data);
                            setEditForm(res.data);
                            setIsEditOpen(false);
                            // Clear temporary cert fields
                            setEditForm(prev => ({ ...prev, certName: '', certIssuer: '', certDate: '' }));
                        } catch (err) {
                            console.error("Error adding certification", err);
                            alert("Failed to add certification");
                        }
                    }} className="flex flex-col gap-4">
                        <Input
                            id="certName"
                            value={editForm.certName || ''}
                            onChange={handleEditChange}
                            label="Name"
                            placeholder="Ex: Microsoft Certified Network Associate Security"
                            required
                        />
                        <Input
                            id="certIssuer"
                            value={editForm.certIssuer || ''}
                            onChange={handleEditChange}
                            label="Issuing Organization"
                            placeholder="Ex: Microsoft"
                            required
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Issue Date</label>
                            <input
                                type="date"
                                id="certDate"
                                value={editForm.certDate || ''}
                                onChange={handleEditChange}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-3 justify-end mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit">Add Certification</Button>
                        </div>
                    </form>
                )}

                {modalMode === 'INTERESTS' && (
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Job Interests</label>
                            <textarea
                                id="jobInterests"
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 min-h-[100px]"
                                value={editForm.jobInterests || ''}
                                onChange={handleEditChange}
                                placeholder="What kind of roles are you looking for?"
                            />
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Profile;
