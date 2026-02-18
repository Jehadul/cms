import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChequeBookById, getChequesByBook, updateChequeStatus } from '../../api/chequeApi';

const ChequeBookView = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading...</div>;
    if (!book) return <div>Book not found</div>;

    return (
        <div>
            <div style={{ marginBottom: '1rem' }}>
                <Link to={`/cheque-books?accountId=${book.accountId}`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>&larr; Back to Register</Link>
            </div>

            <div className="card" style={{ marginBottom: '1rem' }}>
                <h3>Cheque Book Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                    <div><strong>Bank:</strong> {book.bankName}</div>
                    <div><strong>Account:</strong> {book.accountNumber}</div>
                    <div><strong>Range:</strong> {book.startNumber} - {book.endNumber}</div>
                    <div><strong>Leaves:</strong> {book.totalLeaves}</div>
                </div>
            </div>

            <div className="card">
                <h3>Cheque Leaves</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.5rem' }}>Number</th>
                            <th style={{ padding: '0.5rem' }}>Status</th>
                            <th style={{ padding: '0.5rem' }}>Amount</th>
                            <th style={{ padding: '0.5rem' }}>Payee</th>
                            <th style={{ padding: '0.5rem' }}>Date</th>
                            <th style={{ padding: '0.5rem' }}>Remarks</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cheques.map(cheque => (
                            <tr key={cheque.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.5rem' }}>{cheque.chequeNumber}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span className={`status-badge status-${cheque.status.toLowerCase()}`}>
                                        {cheque.status}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem' }}>{cheque.amount || '-'}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.payeeName || '-'}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.chequeDate || '-'}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.remarks || '-'}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    {cheque.status === 'UNUSED' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(cheque.id, 'VOID')}
                                                className="btn btn-sm"
                                                style={{ color: 'var(--color-warning)', marginRight: '0.5rem' }}
                                            >
                                                Void
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(cheque.id, 'MISSING')}
                                                className="btn btn-sm"
                                                style={{ color: 'var(--color-error)' }}
                                            >
                                                Missing
                                            </button>
                                        </>
                                    )}
                                    {(cheque.status === 'ISSUED' || cheque.status === 'PRINTED' || cheque.status === 'DUE') && (
                                        <Link
                                            to={`/cheque-printing?chequeId=${cheque.id}`}
                                            className="btn btn-sm"
                                            style={{ color: 'var(--color-secondary)', textDecoration: 'none', marginRight: '0.5rem', fontWeight: 'bold' }}
                                        >
                                            Print
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>{`
                .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: white; display: inline-block; }
                .status-unused { background-color: var(--color-success); }
                .status-issued { background-color: var(--color-primary); }
                .status-void { background-color: var(--color-text-secondary); }
                .status-missing { background-color: var(--color-error); }
                .status-cancelled { background-color: orange; }
            `}</style>
        </div>
    );
};

export default ChequeBookView;
