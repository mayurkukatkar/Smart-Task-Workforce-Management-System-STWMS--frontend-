import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Clock, User, FileText } from 'lucide-react';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await api.get('/api/admin/audit');
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading audit logs...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                    <p className="text-slate-500 text-sm">System activities and events</p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-slate-500">Timestamp</th>
                            <th className="px-6 py-3 font-medium text-slate-500">Action</th>
                            <th className="px-6 py-3 font-medium text-slate-500">User</th>
                            <th className="px-6 py-3 font-medium text-slate-500">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-900">
                                        <User size={14} className="text-slate-400" />
                                        {log.username || 'System'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-slate-400" />
                                        {log.details}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No audit logs found.</div>
                )}
            </div>
        </div>
    );
};

export default AuditLog;
