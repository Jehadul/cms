import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCompanies, deleteCompany } from '../../api/companyApi';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            const data = await getAllCompanies();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to load companies", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await deleteCompany(id);
                loadCompanies();
            } catch (error) {
                console.error("Failed to delete company", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Company Master</h2>
                <Link to="/companies/add" className="btn btn-primary">Add New Company</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Logo</th>
                            <th style={{ padding: '0.75rem' }}>Code</th>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Active</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>
                                    {company.logoPath ? (
                                        <img src={`http://localhost:8081/uploads/${company.logoPath}`} alt="logo" style={{ height: '30px' }} />
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '0.75rem' }}>{company.code}</td>
                                <td style={{ padding: '0.75rem' }}>{company.name}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        backgroundColor: company.active ? 'var(--color-success)' : 'var(--color-error)',
                                        color: 'white',
                                        fontSize: '0.8rem'
                                    }}>
                                        {company.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/companies/edit/${company.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <button onClick={() => handleDelete(company.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {companies.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No companies found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyList;
