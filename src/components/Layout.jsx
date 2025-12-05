import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            {user && (
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header */}
                <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
