import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBank, getBankById, updateBank } from '../../api/bankApi';

const BankForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        branchCode: '',
        routingNumber: '',
        swiftCode: '',
        active: true
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadBank();
        }
    }, [id]);

    const loadBank = async () => {
        try {
            const data = await getBankById(id);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch bank", error);
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
                await updateBank(id, formData);
            } else {
                await createBank(formData);
            }
            navigate('/banks');
        } catch (error) {
            console.error("Failed to save bank", error);
            alert("Failed to save bank");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{isEditMode ? 'Edit Bank' : 'Add New Bank'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Bank Name</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Bank Code</label>
                        <input type="text" name="code" className="form-input" value={formData.code} onChange={handleChange} required />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Branch Code (Generic)</label>
                        <input type="text" name="branchCode" className="form-input" value={formData.branchCode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Routing Number</label>
                        <input type="text" name="routingNumber" className="form-input" value={formData.routingNumber} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">SWIFT Code</label>
                    <input type="text" name="swiftCode" className="form-input" value={formData.swiftCode} onChange={handleChange} />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Bank'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/banks')} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BankForm;
