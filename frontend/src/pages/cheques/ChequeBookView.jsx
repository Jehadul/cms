import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChequeBookById, getChequesByBook, updateChequeStatus, createOutgoingCheque } from '../../api/chequeApi';
import { getVendorsByCompany } from '../../api/vendorApi';
import { createApprovalRequest } from '../../api/workflowApi';

const ChequeBookView = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [cheques, setCheques] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Issue Cheque State
    const [issuingCheque, setIssuingCheque] = useState(null);
    const [issueFormData, setIssueFormData] = useState({
        payeeName: '',
        vendorId: '',
        amount: '',
        chequeDate: new Date().toISOString().split('T')[0],
        remarks: ''
    });

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const bookData = await getChequeBookById(id);
            setBook(bookData);

            if (bookData && bookData.companyId) { // Assuming companyId might be available on book or we fetch it somehow.
                // Actually ChequeBook doesn't directly have companyId, usually we get it from local storage or context. 
                // For now, let's fetch all vendors for company 1 if context isn't available easily, or use a default.
                const vendorsData = await getVendorsByCompany(1); // MOCK: using hardcoded 1 for demo.
                setVendors(vendorsData);
            } else {
                const vendorsData = await getVendorsByCompany(1); // MOCK
                setVendors(vendorsData);
            }

            const chequesData = await getChequesByBook(id);
            setCheques(chequesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (chequeId, newStatus) => {
        const remarks = prompt(`Enter remarks for marking as ${newStatus}:`);
        if (remarks !== null) { // User didn't cancel
            try {
                await updateChequeStatus(chequeId, newStatus, remarks);
                loadData(); // Reload to refresh
            } catch (error) {
                console.error("Failed to update status", error);
                alert("Failed to update status");
            }
        }
    };

    const handleIssueClick = (cheque) => {
        setIssuingCheque(cheque);
        setIssueFormData({
            payeeName: '',
            vendorId: '',
            amount: '',
            chequeDate: new Date().toISOString().split('T')[0],
            remarks: ''
        });
    };

    const handleVendorChange = (e) => {
        const vId = e.target.value;
        const selectedVendor = vendors.find(v => v.id == vId);
        setIssueFormData({
            ...issueFormData,
            vendorId: vId,
            payeeName: selectedVendor ? selectedVendor.name : issueFormData.payeeName
        });
    };

    const submitIssue = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: issuingCheque.id,
                payeeName: issueFormData.payeeName,
                vendorId: issueFormData.vendorId ? parseInt(issueFormData.vendorId) : null,
                amount: parseFloat(issueFormData.amount),
                chequeDate: issueFormData.chequeDate,
                remarks: issueFormData.remarks,
                status: 'ISSUED'
            };

            // 1. First, save it as in DRAFT State
            const savedCheque = await createOutgoingCheque(payload);

            // 2. Submit for Approval Workflow
            const approvalPayload = {
                entityType: 'Cheque',
                entityId: savedCheque.id, // Assuming it returns the updated ID
                actionType: 'ISSUE',
                payload: JSON.stringify(payload),
                amount: payload.amount // Pass the amount for value-based routing
            };

            await createApprovalRequest(approvalPayload);

            setIssuingCheque(null);
            loadData();
            alert("Cheque Submitted for Approval Successfully!");
        } catch (error) {
            console.error("Failed to issue cheque", error);
            alert("Failed to issue cheque");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <Link to={`/cheque-books?accountId=${book.accountId}`} style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to Register
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Cheque Book Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Bank</span>
                        <span style={{ fontWeight: '600' }}>{book.bankName}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Account</span>
                        <span style={{ fontWeight: '600' }}>{book.accountNumber}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Range</span>
                        <span style={{ fontWeight: '600' }}>{book.startNumber} - {book.endNumber}</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Status</span>
                        <span style={{ fontWeight: '600' }}>{book.totalLeaves} Leaves</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Cheque Leaves</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--color-background)' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Number</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Amount</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Payee / Vendor</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cheques.map(cheque => (
                            <tr key={cheque.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{cheque.chequeNumber}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`status-badge status-${cheque.status.toLowerCase()}`}>
                                        {cheque.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: cheque.amount ? '600' : 'normal' }}>
                                    {cheque.workflowStatus === 'PENDING_APPROVAL' ? (
                                        <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Draft...</span>
                                    ) : (
                                        cheque.amount ? `$${cheque.amount.toLocaleString()}` : '-'
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {cheque.workflowStatus === 'PENDING_APPROVAL' ? (
                                        <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Draft...</span>
                                    ) : (
                                        cheque.vendorName ? `Vendor: ${cheque.vendorName}` : (cheque.payeeName || '-')
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>{cheque.workflowStatus === 'PENDING_APPROVAL' ? '-' : (cheque.chequeDate || '-')}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {cheque.workflowStatus === 'PENDING_APPROVAL' ? (
                                            <span style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                Pending Approval
                                            </span>
                                        ) : cheque.status === 'UNUSED' ? (
                                            <>
                                                <button
                                                    onClick={() => handleIssueClick(cheque)}
                                                    className="btn btn-sm"
                                                    style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                                                >
                                                    Issue
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(cheque.id, 'VOID')}
                                                    className="btn btn-sm"
                                                    style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                                                >
                                                    Void
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(cheque.id, 'MISSING')}
                                                    className="btn btn-sm"
                                                    style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                                                >
                                                    Missing
                                                </button>
                                            </>
                                        ) : ['ISSUED', 'PRINTED', 'DUE'].includes(cheque.status) ? (
                                            <>
                                                <Link
                                                    to={`/cheque-printing?chequeId=${cheque.id}`}
                                                    className="btn btn-sm"
                                                    style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.4rem 0.8rem', textDecoration: 'none', fontSize: '0.875rem' }}
                                                >
                                                    Print
                                                </Link>
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value) handleStatusChange(cheque.id, e.target.value);
                                                        e.target.value = ''; // reset select
                                                    }}
                                                    className="form-input"
                                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.875rem', height: 'auto', width: 'auto', display: 'inline-block' }}
                                                >
                                                    <option value="">Update Status...</option>
                                                    <option value="CLEARED">Mark Cleared</option>
                                                    <option value="BOUNCED">Mark Bounced</option>
                                                    <option value="CANCELLED">Cancel Cheque</option>
                                                    <option value="SETTLED">Settle</option>
                                                </select>
                                            </>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Issue Cheque Modal */}
            {issuingCheque && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', padding: '2rem', borderRadius: '1rem', animation: 'scaleIn 0.2s ease-out' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Issue Cheque #{issuingCheque.chequeNumber}</h3>
                        <form onSubmit={submitIssue}>
                            <div className="form-group">
                                <label className="form-label">Link Vendor (Optional)</label>
                                <select
                                    className="form-input"
                                    value={issueFormData.vendorId}
                                    onChange={handleVendorChange}
                                >
                                    <option value="">-- No Vendor / Manual Payee --</option>
                                    {vendors.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Payee Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={issueFormData.payeeName}
                                    onChange={e => setIssueFormData({ ...issueFormData, payeeName: e.target.value })}
                                    required
                                    autoFocus
                                    placeholder={issueFormData.vendorId ? "Auto-filled from vendor" : "Enter payee name"}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-input"
                                    value={issueFormData.amount}
                                    onChange={e => setIssueFormData({ ...issueFormData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cheque Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={issueFormData.chequeDate}
                                    onChange={e => setIssueFormData({ ...issueFormData, chequeDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Remarks</label>
                                <textarea
                                    className="form-input"
                                    value={issueFormData.remarks}
                                    onChange={e => setIssueFormData({ ...issueFormData, remarks: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIssuingCheque(null)}
                                    style={{ border: '1px solid var(--color-border)' }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Confirm Issue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .status-badge { padding: 0.25rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
                .status-unused { background-color: #f1f5f9; color: #64748b; }
                .status-issued { background-color: #dbeafe; color: #2563eb; }
                .status-printed { background-color: #dcfce7; color: #16a34a; }
                .status-due { background-color: #fef3c7; color: #d97706; }
                .status-cleared { background-color: #d1fae5; color: #059669; }
                .status-settled { background-color: #e0e7ff; color: #4338ca; }
                .status-bounced { background-color: #fee2e2; color: #ef4444; }
                .status-cancelled { background-color: #f3f4f6; color: #9ca3af; }
                .status-void { background-color: #fce7f3; color: #db2777; }
                .status-missing { background-color: #fee2e2; color: #dc2626; }
                
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ChequeBookView;
