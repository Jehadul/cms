import React, { useState, useEffect } from 'react';
import { getAuditLogs, getAuditLogExportUrl } from '../../api/auditApi';
import { Shield, Download, RefreshCw, Search } from 'lucide-react';
import axios from 'axios';

const AuditLogList = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error('Failed to load audit logs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(getAuditLogExportUrl(), {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'audit_logs.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to export logs", error);
            alert("Error exporting logs");
        }
    };

    const filteredLogs = logs.filter(log =>
        (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.entityType && log.entityType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.username && log.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1" style={{ fontWeight: 800, color: '#0f172a' }}>
                        <Shield className="me-2 text-primary" size={28} />
                        Audit & Compliance
                    </h2>
                    <p className="text-muted mb-0">Immutable tracking of system activities.</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={loadLogs} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <button onClick={handleExport} className="btn btn-primary d-flex align-items-center gap-2">
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="position-relative" style={{ width: '300px' }}>
                            <Search className="position-absolute text-muted" size={18} style={{ left: '12px', top: '10px' }} />
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Entity Type</th>
                                        <th>Details (Old &rarr; New)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.length > 0 ? (
                                        filteredLogs.map(log => (
                                            <tr key={log.id}>
                                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                                <td>
                                                    <div className="fw-semibold">{log.username || 'System'}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${log.action.includes('CREATE') ? 'bg-success' :
                                                            log.action.includes('UPDATE') || log.action.includes('EDIT') ? 'bg-warning text-dark' :
                                                                log.action.includes('DELETE') || log.action.includes('CANCEL') || log.action.includes('BOUNCE') ? 'bg-danger' :
                                                                    log.action.includes('PRINT') ? 'bg-info text-dark' :
                                                                        'bg-secondary'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td>{log.entityType} (ID: {log.entityId})</td>
                                                <td className="text-muted small" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {log.oldValue && log.newValue ? (
                                                        <span>{log.oldValue} &rarr; {log.newValue}</span>
                                                    ) : (
                                                        <span>
                                                            {log.oldValue && `Old: ${log.oldValue} `}
                                                            {log.newValue && `New: ${log.newValue}`}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted">
                                                No audit logs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLogList;
