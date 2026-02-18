import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getBranchesByBank, deleteBranch, getBankById } from '../../api/bankApi';

const BranchList = () => {
    const { bankId } = useParams();
    const [branches, setBranches] = useState([]);
    const [bankName, setBankName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [bankId]);

    const loadData = async () => {
        try {
            if (bankId) {
                const bank = await getBankById(bankId);
                setBankName(bank.name);
                const data = await getBranchesByBank(bankId);
                setBranches(data);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this branch?")) {
            try {
                await deleteBranch(id);
                loadData();
            } catch (error) {
                console.error("Failed to delete branch", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <Link to="/banks" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', marginRight: '0.5rem' }}>Banks /</Link>
                    <h2 style={{ display: 'inline' }}>{bankName} Branches</h2>
                </div>
                <Link to={`/banks/${bankId}/branches/add`} className="btn btn-primary">Add New Branch</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>IFSC</th>
                            <th style={{ padding: '0.75rem' }}>Routing Code</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map(branch => (
                            <tr key={branch.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{branch.name}</td>
                                <td style={{ padding: '0.75rem' }}>{branch.ifscCode}</td>
                                <td style={{ padding: '0.75rem' }}>{branch.routingCode}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/banks/${bankId}/branches/edit/${branch.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <button onClick={() => handleDelete(branch.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {branches.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No branches found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BranchList;
