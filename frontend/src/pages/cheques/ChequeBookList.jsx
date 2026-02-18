import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getChequeBooksByAccount } from '../../api/chequeApi';
import { getAccountById } from '../../api/bankAccountApi';

const ChequeBookList = () => {
    // Actually typically we view cheque books for a specific account, 
    // or we list all accounts and then their books. 
    // Let's assume we pass accountId in query or params? 
    // For simplicity, let's list all cheque books if no accountId or have a selector.
    // The user might want to see "Cheque Book Register" as a main menu item.
    // In that case, we should probably select an account first.
    // Let's implement a wrapper that selects account.

    // For now, let's rely on account context or selection.
    // Let's assume we came here with ?accountId=
    const queryParams = new URLSearchParams(window.location.search);
    const accountId = queryParams.get('accountId');

    const [chequeBooks, setChequeBooks] = useState([]);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(!!accountId);

    useEffect(() => {
        if (accountId) {
            loadData();
        }
    }, [accountId]);

    const loadData = async () => {
        try {
            const acc = await getAccountById(accountId);
            setAccount(acc);
            const books = await getChequeBooksByAccount(accountId);
            setChequeBooks(books);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!accountId) {
        return (
            <div className="card">
                <h2>Cheque Book Register</h2>
                <p>Please select a Bank Account to view its cheque books.</p>
                <Link to="/accounts" className="btn btn-primary">Go to Accounts</Link>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <Link to="/accounts" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', marginRight: '0.5rem' }}>Accounts /</Link>
                    <h2 style={{ display: 'inline' }}>{account?.bankName} - {account?.accountNumber}</h2>
                </div>
                <Link to={`/cheque-books/add?accountId=${accountId}`} className="btn btn-primary">Create Cheque Book</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Series</th>
                            <th style={{ padding: '0.75rem' }}>Start No</th>
                            <th style={{ padding: '0.75rem' }}>End No</th>
                            <th style={{ padding: '0.75rem' }}>Total Leaves</th>
                            <th style={{ padding: '0.75rem' }}>Issued Date</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chequeBooks.map(book => (
                            <tr key={book.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{book.seriesIdentifier || '-'}</td>
                                <td style={{ padding: '0.75rem' }}>{book.startNumber}</td>
                                <td style={{ padding: '0.75rem' }}>{book.endNumber}</td>
                                <td style={{ padding: '0.75rem' }}>{book.totalLeaves}</td>
                                <td style={{ padding: '0.75rem' }}>{book.issuedDate}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/cheque-books/${book.id}/view`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>View Cheques</Link>
                                </td>
                            </tr>
                        ))}
                        {chequeBooks.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No cheque books found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChequeBookList;
