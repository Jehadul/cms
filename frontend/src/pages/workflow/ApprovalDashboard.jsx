import React, { useEffect, useState } from 'react';
import { getPendingApprovals, approveRequest, rejectRequest } from '../../api/workflowApi';
import { ClipboardCheck, Check, X, Eye, FileText, ArrowRight } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';

const ApprovalDashboard = () => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadApprovals();
    }, []);

    const loadApprovals = async () => {
        try {
            const data = await getPendingApprovals();
            setApprovals(data);
        } catch (error) {
            console.error("Failed to load approvals", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;

        setProcessing(true);
        try {
            if (action === 'approve') {
                await approveRequest(id);
            } else {
                await rejectRequest(id);
            }
            // Refresh list
            setApprovals(prev => prev.filter(a => a.id !== id));
            setShowModal(false);
        } catch (error) {
            console.error(`Failed to ${action} request`, error);
            alert(`Failed to ${action} request`);
        } finally {
            setProcessing(false);
        }
    };

    const viewDetails = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ClipboardCheck size={28} /> Authorization Dashboard
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Review and approve pending transactions and requests.</p>
                </div>
                <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: '600' }}>
                    {approvals.length} Pending Requests
                </div>
            </div>

            {approvals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--color-background)', borderRadius: '1rem', border: '2px dashed var(--color-border)' }}>
                    <ClipboardCheck size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>All caught up! No pending approvals.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {approvals.map(request => (
                        <div key={request.id} className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
                                        <FileText size={18} color="var(--color-primary)" />
                                    </div>
                                    <div>
                                        <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{request.entityType}</h5>
                                        <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>ID: #{request.entityId}</small>
                                    </div>
                                </div>
                                <span className="badge bg-warning text-dark">PENDING</span>
                            </div>

                            <div style={{ padding: '1.25rem', flex: 1 }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '600' }}>Action Type</label>
                                    <p style={{ fontWeight: '500', color: '#334155' }}>{request.actionType}</p>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '600' }}>Requested By</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                            U
                                        </div>
                                        <span>User #{request.requestedBy}</span>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '600' }}>Requested At</label>
                                    <p style={{ fontSize: '0.9rem' }}>{new Date(request.requestedAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'white', display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={() => viewDetails(request)}
                                    className="btn btn-outline-secondary btn-sm"
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Eye size={16} /> Details
                                </button>
                                <button
                                    onClick={() => handleAction(request.id, 'approve')}
                                    className="btn btn-success btn-sm"
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Check size={16} /> Approve
                                </button>
                                <button
                                    onClick={() => handleAction(request.id, 'reject')}
                                    className="btn btn-danger btn-sm"
                                    style={{ flex: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    title="Reject"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Entity Type:</strong> {selectedRequest.entityType}
                                </div>
                                <div className="col-md-6">
                                    <strong>Entity ID:</strong> {selectedRequest.entityId}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Action:</strong> {selectedRequest.actionType}
                                </div>
                                <div className="col-md-6">
                                    <strong>Requested By:</strong> User #{selectedRequest.requestedBy}
                                </div>
                            </div>

                            <hr />

                            <h5>Payload / Data Changes</h5>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)', maxHeight: '300px', overflowY: 'auto' }}>
                                <pre style={{ margin: 0, fontSize: '0.85rem' }}>
                                    {selectedRequest.payload ? JSON.stringify(JSON.parse(selectedRequest.payload), null, 2) : "No additional data."}
                                </pre>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleAction(selectedRequest.id, 'reject')} disabled={processing}>
                        Reject
                    </Button>
                    <Button variant="success" onClick={() => handleAction(selectedRequest.id, 'approve')} disabled={processing}>
                        {processing ? 'Processing...' : 'Approve Request'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ApprovalDashboard;
