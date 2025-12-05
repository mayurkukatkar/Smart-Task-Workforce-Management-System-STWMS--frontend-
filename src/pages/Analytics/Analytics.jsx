import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, AlertCircle, List } from 'lucide-react';

const Analytics = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        highPriority: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksResponse, statsResponse] = await Promise.all([
                api.get('/api/tasks'),
                api.get('/api/analytics/dashboard')
            ]);

            setTasks(tasksResponse.data);

            // Use stats from backend
            const backendStats = statsResponse.data;
            setStats({
                total: backendStats.totalTasks,
                completed: backendStats.completedTasks,
                pending: backendStats.pendingTasks,
                inProgress: backendStats.totalTasks - backendStats.completedTasks - backendStats.pendingTasks, // Derived if needed or add to backend
                highPriority: tasksResponse.data.filter(t => t.priority === 'HIGH').length // Keep client side for now or add to backend
            });

        } catch (error) {
            console.error("Failed to fetch analytics data", error);
        } finally {
            setLoading(false);
        }
    };

    const data = [
        { name: 'Completed', value: stats.completed, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    ];

    const COLORS = ['#10b981', '#f59e0b'];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
                <p className="text-slate-500 text-sm">Overview of task performance and status</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6 flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                        <List size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Completed</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Pending</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                    </div>
                </div>
                <div className="card p-6 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">High Priority</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.highPriority}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-6">Task Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-6">Task Priority Breakdown</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'High', value: tasks.filter(t => t.priority === 'HIGH').length },
                                    { name: 'Medium', value: tasks.filter(t => t.priority === 'MEDIUM').length },
                                    { name: 'Low', value: tasks.filter(t => t.priority === 'LOW').length },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
