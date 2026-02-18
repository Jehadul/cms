import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBranch, getBranchById, updateBranch, getBankById } from '../../api/bankApi';

const BranchForm = () => {
    const { bankId, id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        ifscCode: '',
        routingCode: '',
        active: true,
        bankId: bankId
    });

    const [bankName, setBankName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBankInfo();
        if (isEditMode) {
            loadBranch();
        }
    }, [bankId, id]);

    const loadBankInfo = async () => {
        try {
            const bank = await getBankById(bankId);
            setBankName(bank.name);
        } catch (error) {
            console.error("Failed to load bank info", error);
        }
    };

    const loadBranch = async () => {
        try {
            const data = await getBranchById(id);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch branch", error);
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

        const dataToSubmit = { ...formData, bankId: Number(bankId) };

        try {
            if (isEditMode) {
                await updateBranch(id, dataToSubmit);
            } else {
                await createBranch(dataToSubmit);
            }
            navigate(`/banks/${bankId}/branches`);
        } catch (error) {
            console.error("Failed to save branch", error);
            alert("Failed to save branch");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1rem' }}>
                <Link to={`/banks/${bankId}/branches`} style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>&larr; Back to Branches</Link>
            </div>
            <h2>{isEditMode ? 'Edit Branch' : 'Add New Branch'} - {bankName}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Branch Name</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-input" value={formData.address} onChange={handleChange} rows="3" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">IFSC Code</label>
                        <input type="text" name="ifscCode" className="form-input" value={formData.ifscCode} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Routing Code</label>
                        <input type="text" name="routingCode" className="form-input" value={formData.routingCode} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Branch'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate(`/banks/${bankId}/branches`)} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BranchForm;
