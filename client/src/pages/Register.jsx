import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-secondary mt-2">Get started with Dayflow</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                        id="name"
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" disabled={loading} className="w-full justify-center">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <p className="text-center text-sm text-secondary mt-2">
                        Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
