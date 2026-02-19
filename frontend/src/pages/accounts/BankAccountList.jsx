import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccountsByCompany, deleteAccount } from '../../api/bankAccountApi';

const BankAccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    // TODO: Get company ID from context
    const companyId = 1;

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await getAccountsByCompany(companyId);
            setAccounts(data);
        } catch (error) {
            console.error("Failed to load accounts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                await deleteAccount(id);
                loadAccounts();
            } catch (error) {
                console.error("Failed to delete account", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Bank Account Master</h2>
                <Link to="/accounts/add" className="btn btn-primary">Add New Account</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Bank</th>
                            <th style={{ padding: '0.75rem' }}>Branch</th>
                            <th style={{ padding: '0.75rem' }}>Account No</th>
                            <th style={{ padding: '0.75rem' }}>Type</th>
                            <th style={{ padding: '0.75rem' }}>Currency</th>
                            <th style={{ padding: '0.75rem' }}>Balance</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => (
                            <tr key={account.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{account.bankName}</td>
                                <td style={{ padding: '0.75rem' }}>{account.branchName}</td>
                                <td style={{ padding: '0.75rem' }}>{account.accountNumber}</td>
                                <td style={{ padding: '0.75rem' }}>{account.accountType}</td>
                                <td style={{ padding: '0.75rem' }}>{account.currency}</td>
                                <td style={{ padding: '0.75rem' }}>{account.balance}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/accounts/edit/${account.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <Link to={`/cheque-books?accountId=${account.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-secondary)' }}>Cheques</Link>
                                    <button onClick={() => handleDelete(account.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {accounts.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ padding: '1rem', textAlign: 'center' }}>No accounts found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BankAccountList;
