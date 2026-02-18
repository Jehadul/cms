import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVendorsByCompany, deleteVendor } from '../../api/vendorApi';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    // TODO: Get actual company ID from context/user
    const companyId = 1;

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const data = await getVendorsByCompany(companyId);
            setVendors(data);
        } catch (error) {
            console.error("Failed to load vendors", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vendor?")) {
            try {
                await deleteVendor(id);
                loadVendors();
            } catch (error) {
                console.error("Failed to delete vendor", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Vendor Master</h2>
                <Link to="/vendors/add" className="btn btn-primary">Add New Vendor</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Code</th>
                            <th style={{ padding: '0.75rem' }}>Contact Person</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map(vendor => (
                            <tr key={vendor.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{vendor.name}</td>
                                <td style={{ padding: '0.75rem' }}>{vendor.code}</td>
                                <td style={{ padding: '0.75rem' }}>{vendor.contactPerson}</td>
                                <td style={{ padding: '0.75rem' }}>{vendor.phone}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/vendors/edit/${vendor.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <button onClick={() => handleDelete(vendor.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {vendors.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>No vendors found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorList;
