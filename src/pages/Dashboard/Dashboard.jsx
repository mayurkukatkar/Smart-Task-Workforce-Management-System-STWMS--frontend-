import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/analytics/dashboard');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Total Tasks</h3>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalTasks}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Pending</h3>
                    <p className="text-3xl font-bold text-amber-500">{stats.pendingTasks}</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Completed</h3>
                    <p className="text-3xl font-bold text-emerald-500">{stats.completedTasks}</p>
                </div>
            </div>

            <div className="card p-6">
                <h2 className="text-lg font-semibold mb-4">Welcome back, {user.username}</h2>
                <p className="text-slate-600">You are logged in as: <span className="font-medium text-blue-600">{user.roles.join(', ')}</span></p>
            </div>
        </div>
    );
};

export default Dashboard;
