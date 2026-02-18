import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCompany, getCompanyById, updateCompany } from '../../api/companyApi';

const CompanyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        financialYearStart: '',
        financialYearEnd: '',
        timezone: '',
        currency: '',
        active: true,
        makerCheckerEnabled: true,
        defaultApprovalLevels: 1
    });

    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            loadCompany();
        }
    }, [id]);

    const loadCompany = async () => {
        try {
            const data = await getCompanyById(id);
            setFormData({
                name: data.name,
                code: data.code,
                address: data.address || '',
                financialYearStart: data.financialYearStart || '',
                financialYearEnd: data.financialYearEnd || '',
                timezone: data.timezone || '',
                currency: data.currency || '',
                active: data.active,
                makerCheckerEnabled: data.makerCheckerEnabled,
                defaultApprovalLevels: data.defaultApprovalLevels
            });
        } catch (error) {
            console.error("Failed to fetch company", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (logoFile) {
            data.append('logoFile', logoFile);
        }

        try {
            if (isEditMode) {
                await updateCompany(id, data);
            } else {
                await createCompany(data);
            }
            navigate('/companies');
        } catch (error) {
            console.error("Failed to save company", error);
            alert("Failed to save company");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{isEditMode ? 'Edit Company' : 'Add New Company'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Company Code</label>
                        <input type="text" name="code" className="form-input" value={formData.code} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea name="address" className="form-input" value={formData.address} onChange={handleChange} rows="3" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Fin. Year Start (MM-DD)</label>
                        <input type="text" name="financialYearStart" placeholder="04-01" className="form-input" value={formData.financialYearStart} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Fin. Year End (MM-DD)</label>
                        <input type="text" name="financialYearEnd" placeholder="03-31" className="form-input" value={formData.financialYearEnd} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Timezone</label>
                        <input type="text" name="timezone" placeholder="Asia/Kolkata" className="form-input" value={formData.timezone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Currency</label>
                        <input type="text" name="currency" placeholder="INR" className="form-input" value={formData.currency} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Company Logo</label>
                    <input type="file" onChange={handleFileChange} className="form-input" accept="image/*" />
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-border)' }} />
                <h3>Workflow Configuration</h3>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input type="checkbox" name="makerCheckerEnabled" id="makerChecker" checked={formData.makerCheckerEnabled} onChange={handleChange} />
                    <label htmlFor="makerChecker" style={{ cursor: 'pointer' }}>Enable Maker-Checker Workflow</label>
                </div>

                <div className="form-group">
                    <label className="form-label">Default Approval Levels</label>
                    <input type="number" name="defaultApprovalLevels" min="1" max="5" className="form-input" value={formData.defaultApprovalLevels} onChange={handleChange} />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Company'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/companies')} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;
