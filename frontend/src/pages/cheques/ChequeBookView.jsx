import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChequeBookById, getChequesByBook, updateChequeStatus, createOutgoingCheque } from '../../api/chequeApi';

const ChequeBookView = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(true);

    // Issue Cheque State
    const [issuingCheque, setIssuingCheque] = useState(null);
    const [issueFormData, setIssueFormData] = useState({
        payeeName: '',
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
            amount: '',
            chequeDate: new Date().toISOString().split('T')[0],
            remarks: ''
        });
    };

    const submitIssue = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: issuingCheque.id,
                payeeName: issueFormData.payeeName,
                amount: parseFloat(issueFormData.amount),
                chequeDate: issueFormData.chequeDate,
                remarks: issueFormData.remarks,
                status: 'ISSUED' // Logic in backend will handle transitions, but we can be explicit
            };

            await createOutgoingCheque(payload);
            setIssuingCheque(null);
            loadData();
            alert("Cheque Issued Successfully!");
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
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Payee</th>
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
                                    {cheque.amount ? `$${cheque.amount.toLocaleString()}` : '-'}
                                </td>
                                <td style={{ padding: '1rem' }}>{cheque.payeeName || '-'}</td>
                                <td style={{ padding: '1rem' }}>{cheque.chequeDate || '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {cheque.status === 'UNUSED' && (
                                            <>
                                                <button
                                                    onClick={() => handleIssueClick(cheque)}
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: 'var(--color-primary)',
                                                        color: 'white',
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Issue
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(cheque.id, 'VOID')}
                                                    className="btn btn-sm"
                                                    style={{
                                                        color: 'var(--color-text-muted)',
                                                        border: '1px solid var(--color-border)',
                                                        padding: '0.4rem 0.8rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Void
                                                </button>
                                            </>
                                        )}
                                        {['ISSUED', 'PRINTED'].includes(cheque.status) && (
                                            <Link
                                                to={`/cheque-printing?chequeId=${cheque.id}`}
                                                className="btn btn-sm"
                                                style={{
                                                    color: 'var(--color-primary)',
                                                    border: '1px solid var(--color-primary)',
                                                    padding: '0.4rem 0.8rem',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Print
                                            </Link>
                                        )}
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
                                <label className="form-label">Payee Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={issueFormData.payeeName}
                                    onChange={e => setIssueFormData({ ...issueFormData, payeeName: e.target.value })}
                                    required
                                    autoFocus
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
