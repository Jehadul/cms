import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomersByCompany, deleteCustomer } from '../../api/customerApi';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    // TODO: Get actual company ID from context/user
    const companyId = 1;

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomersByCompany(companyId);
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(id);
                loadCustomers();
            } catch (error) {
                console.error("Failed to delete customer", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Customer Master</h2>
                <Link to="/customers/add" className="btn btn-primary">Add New Customer</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Code</th>
                            <th style={{ padding: '0.75rem' }}>Contact Person</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>Credit Limit</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{customer.name}</td>
                                <td style={{ padding: '0.75rem' }}>{customer.code}</td>
                                <td style={{ padding: '0.75rem' }}>{customer.contactPerson}</td>
                                <td style={{ padding: '0.75rem' }}>{customer.phone}</td>
                                <td style={{ padding: '0.75rem' }}>{customer.creditLimit}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/customers/edit/${customer.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <button onClick={() => handleDelete(customer.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No customers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerList;
