import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log('Attempting login with:', formData.email);
        try {
            await login(formData.email, formData.password);
            console.log('Login successful, navigating to dashboard...');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-500/30">
                        D
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-secondary mt-2">Sign in to your Dayflow account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-secondary cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                            Remember me
                        </label>
                        <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full justify-center">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <p className="text-center text-sm text-secondary mt-2">
                        Don't have an account? <a href="/register" className="text-primary font-medium hover:underline">Sign up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
