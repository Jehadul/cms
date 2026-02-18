import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, getCustomerById, updateCustomer } from '../../api/customerApi';

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    // TODO: Get actual company ID from context
    const companyId = 1;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        contactPerson: '',
        email: '',
        phone: '',
        creditLimit: '',
        creditDays: 30,
        active: true,
        companyId: companyId
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadCustomer();
        }
    }, [id]);

    const loadCustomer = async () => {
        try {
            const data = await getCustomerById(id);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch customer", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await updateCustomer(id, formData);
            } else {
                await createCustomer(formData);
            }
            navigate('/customers');
        } catch (error) {
            console.error("Failed to save customer", error);
            alert("Failed to save customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Customer Name</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Customer Code</label>
                        <input type="text" name="code" className="form-input" value={formData.code} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-input" value={formData.address} onChange={handleChange} rows="3" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Contact Person</label>
                        <input type="text" name="contactPerson" className="form-input" value={formData.contactPerson} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border)' }} />
                <h3>Credit Terms</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Credit Limit</label>
                        <input type="number" name="creditLimit" className="form-input" value={formData.creditLimit} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Credit Days</label>
                        <input type="number" name="creditDays" className="form-input" value={formData.creditDays} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Customer'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/customers')} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
