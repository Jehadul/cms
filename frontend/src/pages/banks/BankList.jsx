import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBanks, deleteBank } from '../../api/bankApi';

const BankList = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBanks();
    }, []);

    const loadBanks = async () => {
        try {
            const data = await getAllBanks();
            setBanks(data);
        } catch (error) {
            console.error("Failed to load banks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this bank?")) {
            try {
                await deleteBank(id);
                loadBanks();
            } catch (error) {
                console.error("Failed to delete bank", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Bank Master</h2>
                <Link to="/banks/add" className="btn btn-primary">Add New Bank</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Code</th>
                            <th style={{ padding: '0.75rem' }}>SWIFT</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banks.map(bank => (
                            <tr key={bank.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{bank.name}</td>
                                <td style={{ padding: '0.75rem' }}>{bank.code}</td>
                                <td style={{ padding: '0.75rem' }}>{bank.swiftCode}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/banks/edit/${bank.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <Link to={`/banks/${bank.id}/branches`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-secondary)' }}>Branches</Link>
                                    <button onClick={() => handleDelete(bank.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {banks.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No banks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BankList;
