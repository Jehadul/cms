import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createVendor, getVendorById, updateVendor } from '../../api/vendorApi';

const VendorForm = () => {
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
        bankName: '',
        bankBranch: '',
        accountNumber: '',
        ifscCode: '',
        paymentPreference: 'CHEQUE',
        paymentTermsDays: 30,
        active: true,
        companyId: companyId
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadVendor();
        }
    }, [id]);

    const loadVendor = async () => {
        try {
            const data = await getVendorById(id);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch vendor", error);
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
                await updateVendor(id, formData);
            } else {
                await createVendor(formData);
            }
            navigate('/vendors');
        } catch (error) {
            console.error("Failed to save vendor", error);
            alert("Failed to save vendor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{isEditMode ? 'Edit Vendor' : 'Add New Vendor'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Vendor Name</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Vendor Code</label>
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
                <h3>Bank Details</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Bank Name</label>
                        <input type="text" name="bankName" className="form-input" value={formData.bankName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Branch</label>
                        <input type="text" name="bankBranch" className="form-input" value={formData.bankBranch} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Account Number</label>
                        <input type="text" name="accountNumber" className="form-input" value={formData.accountNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">IFSC Code</label>
                        <input type="text" name="ifscCode" className="form-input" value={formData.ifscCode} onChange={handleChange} />
                    </div>
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border)' }} />
                <h3>Payment Preferences</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Payment Method</label>
                        <select name="paymentPreference" className="form-input" value={formData.paymentPreference} onChange={handleChange}>
                            <option value="CHEQUE">Cheque</option>
                            <option value="NEFT_RTGS">NEFT/RTGS</option>
                            <option value="CASH">Cash</option>
                            <option value="DD">Demand Draft</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Payment Terms (Days)</label>
                        <input type="number" name="paymentTermsDays" className="form-input" value={formData.paymentTermsDays} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Vendor'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/vendors')} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorForm;
