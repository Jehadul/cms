import React, { useEffect, useState } from 'react';
import { getPendingApprovals, approveRequest, rejectRequest } from '../../api/workflowApi';

const ApprovalDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getPendingApprovals();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load approvals", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm("Are you sure you want to Approve this request?")) {
            try {
                await approveRequest(id);
                loadData();
            } catch (error) {
                console.error("Failed to approve", error);
                alert("Action failed");
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to REJECT this request?")) {
            try {
                await rejectRequest(id);
                loadData();
            } catch (error) {
                console.error("Failed to reject", error);
                alert("Action failed");
            }
        }
    };

    if (loading) return <div>Loading Approvals...</div>;

    return (
        <div className="card">
            <h2>Approval Workflow Dashboard</h2>
            {requests.length === 0 ? (
                <p>No pending approvals. All caught up!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.5rem' }}>Type</th>
                            <th style={{ padding: '0.5rem' }}>Action</th>
                            <th style={{ padding: '0.5rem' }}>Requested By</th>
                            <th style={{ padding: '0.5rem' }}>Date</th>
                            <th style={{ padding: '0.5rem' }}>Details</th>
                            <th style={{ padding: '0.5rem' }}>Decision</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.5rem' }}>{req.entityType} #{req.entityId}</td>
                                <td style={{ padding: '0.5rem' }}>{req.actionType}</td>
                                <td style={{ padding: '0.5rem' }}>User {req.requestedBy}</td>
                                <td style={{ padding: '0.5rem' }}>{new Date(req.requestedAt).toLocaleString()}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <small>{req.payload ? (req.payload.length > 50 ? req.payload.substring(0, 50) + '...' : req.payload) : '-'}</small>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <button onClick={() => handleApprove(req.id)} className="btn btn-sm" style={{ backgroundColor: 'var(--color-success)', color: 'white', marginRight: '0.5rem' }}>Approve</button>
                                    <button onClick={() => handleReject(req.id)} className="btn btn-sm" style={{ backgroundColor: 'var(--color-error)', color: 'white' }}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ApprovalDashboard;
