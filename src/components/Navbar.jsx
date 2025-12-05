import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-md w-96">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search tasks, employees..."
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-6 w-px bg-slate-200"></div>

                {user ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                ) : (
                    <div className="flex gap-4">
                        <a href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Login</a>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
