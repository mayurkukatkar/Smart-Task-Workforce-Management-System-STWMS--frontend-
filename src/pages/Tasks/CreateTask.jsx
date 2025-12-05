import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Save, ArrowLeft } from 'lucide-react';

const CreateTask = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        expectedHours: '',
        assigneeId: ''
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isManager = user?.roles.includes('ROLE_MANAGER');

    useEffect(() => {
        if (isManager) {
            fetchTeamMembers();
        }
    }, [isManager]);

    const fetchTeamMembers = async () => {
        try {
            const response = await api.get('/api/tasks/team-members');
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team members", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation: Manager MUST assign task
        if (isManager && !formData.assigneeId) {
            setError("Please assign this task to a team member.");
            setLoading(false);
            return;
        }

        try {
            const payload = { ...formData };
            if (!payload.assigneeId) delete payload.assigneeId;
            if (!payload.expectedHours) delete payload.expectedHours;

            await api.post('/api/tasks', payload);
            navigate('/tasks');
        } catch (error) {
            console.error("Failed to create task", error);
            setError("Failed to create task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate('/tasks')} className="flex items-center text-slate-500 hover:text-slate-900 mb-6">
                <ArrowLeft size={18} className="mr-2" /> Back to Tasks
            </button>

            <div className="card p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Task</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field w-full"
                            placeholder="Enter task description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="input-field w-full"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                required
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="input-field w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Hours</label>
                            <input
                                type="number"
                                name="expectedHours"
                                value={formData.expectedHours}
                                onChange={handleChange}
                                className="input-field w-full"
                                placeholder="e.g. 8"
                            />
                        </div>

                        {isManager && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Assign To <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="assigneeId"
                                    value={formData.assigneeId}
                                    onChange={handleChange}
                                    className={`input-field w-full ${error && !formData.assigneeId ? 'border-red-500' : ''}`}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {teamMembers.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.user.username} ({member.designation})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">Managers must assign tasks to a team member.</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
