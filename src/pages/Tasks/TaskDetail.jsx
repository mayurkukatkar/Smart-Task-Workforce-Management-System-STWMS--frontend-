import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ArrowLeft, Calendar, Flag, Clock, User, MessageSquare } from 'lucide-react';

const TaskDetail = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState({
        status: '',
        progressPercent: 0,
        report: ''
    });

    const isManager = user?.roles.includes('ROLE_MANAGER');
    const isAssignedEmployee = task?.assignments?.some(a => a.employee.user.username === user?.username);

    useEffect(() => {
        fetchTask();
        if (isManager) {
            fetchTeamMembers();
        }
    }, [taskId, isManager]);

    const fetchTask = async () => {
        try {
            const response = await api.get('/api/tasks');
            const foundTask = response.data.find(t => t.id === parseInt(taskId));
            setTask(foundTask);
        } catch (error) {
            console.error("Failed to fetch task", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await api.get('/api/tasks/team-members');
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team members", error);
        }
    };

    const handleAssign = async () => {
        try {
            await api.post(`/api/tasks/${taskId}/assign/${selectedEmployee}`);
            setShowAssignModal(false);
            fetchTask(); // Refresh task data
        } catch (error) {
            console.error("Failed to assign task", error);
            alert("Failed to assign task");
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/api/tasks/${taskId}/status`, updateData);
            setShowUpdateModal(false);
            fetchTask(); // Refresh task data
        } catch (error) {
            console.error("Failed to update task status", error);
            alert("Failed to update task status");
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading task details...</div>;
    if (!task) return <div className="p-8 text-center text-slate-500">Task not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/tasks')}
                className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Tasks
            </button>

            <div className="card p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>Due: {task.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Flag size={16} />
                                <span>{task.priority} Priority</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>{task.expectedHours}h est.</span>
                            </div>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {task.status.replace('_', ' ')}
                    </span>
                </div>

                <div className="prose max-w-none text-slate-600 mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                    <p>{task.description}</p>
                </div>

                {/* Assignments Section */}
                <div className="border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Assignment</h3>
                        <div className="flex gap-2">
                            {isManager && task.status === 'OPEN' && (
                                <button
                                    onClick={() => setShowAssignModal(true)}
                                    className="btn btn-primary text-sm py-1.5"
                                >
                                    Assign Task
                                </button>
                            )}
                            {isAssignedEmployee && (
                                <button
                                    onClick={() => {
                                        const myAssignment = task.assignments.find(a => a.employee.user.username === user?.username);
                                        setUpdateData({
                                            status: task.status,
                                            progressPercent: myAssignment?.progressPercent || 0,
                                            report: myAssignment?.report || ''
                                        });
                                        setShowUpdateModal(true);
                                    }}
                                    className="btn btn-primary text-sm py-1.5"
                                >
                                    Update Status
                                </button>
                            )}
                        </div>
                    </div>

                    {task.assignments && task.assignments.length > 0 ? (
                        <div className="space-y-4">
                            {task.assignments.map(assignment => (
                                <div key={assignment.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{assignment.employee.user.username}</p>
                                                <p className="text-xs text-slate-500">{assignment.employee.designation}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-slate-900 mb-1">
                                                {assignment.progressPercent}% Complete
                                            </div>
                                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full"
                                                    style={{ width: `${assignment.progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {assignment.report && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <div className="flex gap-2 text-sm text-slate-600">
                                                <MessageSquare size={16} className="mt-0.5 text-slate-400" />
                                                <p>{assignment.report}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500 text-sm">This task has not been assigned to anyone yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Assign Task</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
                            <select
                                className="input-field w-full"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">Choose a team member...</option>
                                {teamMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.user.username} ({member.designation})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedEmployee}
                                className="btn btn-primary"
                            >
                                Assign Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Update Task Status</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                <select
                                    className="input-field w-full"
                                    value={updateData.status}
                                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                                >
                                    <option value="ASSIGNED">Assigned</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Progress ({updateData.progressPercent}%)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    className="w-full"
                                    value={updateData.progressPercent}
                                    onChange={(e) => setUpdateData({ ...updateData, progressPercent: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Report/Comment</label>
                                <textarea
                                    className="input-field w-full h-24 resize-none"
                                    placeholder="Add a progress report or comment..."
                                    value={updateData.report}
                                    onChange={(e) => setUpdateData({ ...updateData, report: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="btn btn-primary"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetail;
