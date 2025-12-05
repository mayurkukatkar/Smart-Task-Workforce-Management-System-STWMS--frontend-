import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Plus, Calendar, Flag, LayoutGrid, List, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TaskBoard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
            case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            case 'IN_PROGRESS': return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'ASSIGNED': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
            case 'OPEN': return 'text-slate-700 bg-slate-50 border-slate-200';
            default: return 'text-slate-700 bg-slate-50 border-slate-200';
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
                    <p className="text-slate-500 text-sm">Manage and track your team's tasks</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                            <List size={18} />
                        </button>
                    </div>

                    {(user?.roles.includes('ROLE_MANAGER') || user?.roles.includes('ROLE_ADMIN')) && (
                        <button onClick={() => navigate('/tasks/new')} className="btn btn-primary flex items-center gap-2">
                            <Plus size={18} /> New Task
                        </button>
                    )}
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="text-slate-400" />
                    </div>
                    <h3 className="text-slate-900 font-medium">No tasks found</h3>
                    <p className="text-slate-500 text-sm mt-1">Get started by creating a new task.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="card p-5 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>
                            <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600">{task.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{task.description}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                <Calendar size={14} />
                                <span>Due: {task.dueDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-slate-500">Task</th>
                                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                                <th className="px-6 py-3 font-medium text-slate-500">Priority</th>
                                <th className="px-6 py-3 font-medium text-slate-500">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tasks.map(task => (
                                <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="hover:bg-slate-50 cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-slate-900">{task.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{task.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TaskBoard;
