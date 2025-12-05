import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, Users, BarChart3, Settings, FileText, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const isAdmin = user.roles.includes('ROLE_ADMIN');
    const isManager = user.roles.includes('ROLE_MANAGER') || isAdmin;

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
          ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
            >
                <Icon size={20} />
                {label}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">S</div>
                        STWMS
                    </h1>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 px-4 py-6 overflow-y-auto">
                    <div className="mb-6">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
                        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/tasks" icon={CheckSquare} label="My Tasks" />
                    </div>

                    {isManager && (
                        <div className="mb-6">
                            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</p>
                            <NavItem to="/tasks/manage" icon={Settings} label="Manage Tasks" />
                            <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
                        </div>
                    )}

                    {isAdmin && (
                        <div className="mb-6">
                            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin</p>
                            <NavItem to="/admin/users" icon={Users} label="Users & Teams" />
                            <NavItem to="/admin/audit" icon={FileText} label="Audit Logs" />
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.username}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
