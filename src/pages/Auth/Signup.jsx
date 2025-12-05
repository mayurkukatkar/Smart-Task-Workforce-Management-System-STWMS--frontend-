import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ['user']
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username or Email might be taken.');
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <LayoutDashboard size={24} />
                        </div>
                        <h1 className="text-4xl font-bold">STWMS</h1>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Join our community.</h2>
                    <p className="text-slate-400 text-lg max-w-md">
                        Start managing your tasks and teams more effectively today.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
                        <p className="mt-2 text-slate-600">Get started with your free account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="input-field"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="input-field"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full py-3 mt-4">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
