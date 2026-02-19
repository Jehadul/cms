import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createIncomingCheque, updateIncomingCheque } from '../../api/incomingChequeApi';
import { getCustomersByCompany } from '../../api/customerApi'; // Assuming this exists

const IncomingChequeForm = () => {
    const { id } = useParams(); // If editing (not implemented fully for fetch yet but structure ready)
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);

    // Form fields matching IncomingChequeDTO
    const [formData, setFormData] = useState({
        customerId: '',
        chequeNumber: '',
        chequeDate: '',
        receivedDate: new Date().toISOString().split('T')[0],
        bankName: '',
        branchName: '',
        amount: '',
        remarks: '',
        status: 'PENDING'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCustomers();
        // If ID exists, fetch existing data (skipping specific fetch logic here for brevity, assume create mode primarily)
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomersByCompany(1); // Hardcoded companyId for demo
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Helper for file preview
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare DTO only fields
            const payload = {
                customerId: formData.customerId,
                chequeNumber: formData.chequeNumber,
                chequeDate: formData.chequeDate,
                receivedDate: formData.receivedDate,
                bankName: formData.bankName,
                branchName: formData.branchName,
                amount: parseFloat(formData.amount),
                remarks: formData.remarks,
                status: formData.status
            };

            if (id) {
                await updateIncomingCheque(id, payload, file);
            } else {
                await createIncomingCheque(payload, file);
            }
            alert("Incoming Cheque Saved Successfully!");
            navigate('/incoming-cheques');
        } catch (error) {
            console.error("Failed to save incoming cheque", error);
            alert("Failed to save cheque. Ensure all fields are valid.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/incoming-cheques" style={{ marginRight: '1rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text)', lineHeight: '1.2' }}>
                        {id ? 'Edit Incoming Cheque' : 'Receive New Cheque'}
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Record details of a new incoming cheque payment.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Customer & Amount Section - High Priority */}
                    <div className="card" style={{ padding: '2rem', borderRadius: '1rem', borderTop: '4px solid var(--color-primary)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>👤</span> Payer Details
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Customer / Payer <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                <select
                                    name="customerId"
                                    className="form-input"
                                    style={{ height: '3rem', fontSize: '1rem' }}
                                    value={formData.customerId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Amount <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontWeight: '500' }}>$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="amount"
                                            className="form-input"
                                            style={{ paddingLeft: '2.5rem', fontSize: '1.125rem', fontWeight: '600' }}
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Received Date <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                    <input type="date" name="receivedDate" className="form-input" value={formData.receivedDate} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank & Cheque Details */}
                    <div className="card" style={{ padding: '2rem', borderRadius: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.25rem' }}>🏦</span> Bank Information
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Cheque Number <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                    <input
                                        type="text"
                                        name="chequeNumber"
                                        className="form-input"
                                        style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
                                        value={formData.chequeNumber}
                                        onChange={handleChange}
                                        placeholder="######"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cheque Date <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                    <input type="date" name="chequeDate" className="form-input" value={formData.chequeDate} onChange={handleChange} required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Bank Name <span style={{ color: 'var(--color-error)' }}>*</span></label>
                                    <input type="text" name="bankName" className="form-input" value={formData.bankName} onChange={handleChange} placeholder="e.g. Chase Bank" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Branch Name</label>
                                    <input type="text" name="branchName" className="form-input" value={formData.branchName} onChange={handleChange} placeholder="Optional" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => navigate('/incoming-cheques')}
                            style={{ backgroundColor: 'white', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ minWidth: '180px', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" style={{ marginRight: '0.5rem' }}></span> Processing...
                                </>
                            ) : (
                                <>Save & Generate Receipt</>
                            )}
                        </button>
                    </div>

                </div>

                {/* Sidebar: Upload & Remarks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', borderRadius: '1rem', height: 'fit-content' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>📷 Scan / Image</h3>

                        <div
                            className="upload-area"
                            style={{
                                border: '2px dashed var(--color-border)',
                                borderRadius: '0.75rem',
                                padding: '2rem 1rem',
                                textAlign: 'center',
                                backgroundColor: 'var(--color-background)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => document.getElementById('file-upload').click()}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                                style={{ display: 'none' }}
                            />

                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '0.5rem', boxShadow: 'var(--shadow-md)' }} />
                            ) : file ? (
                                <div style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                                    📄 {file.name}
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☁️</div>
                                    <p style={{ fontWeight: '500', color: 'var(--color-text)' }}>Click to Upload</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>JPG, PNG or PDF</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', borderRadius: '1rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>📝 Additional Notes</h3>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'none' }}>Remarks</label>
                            <textarea
                                name="remarks"
                                className="form-input"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Add any notes about this transaction..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spinner {
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid #ffffff;
                    border-top-color: transparent;
                    border-radius: 50%;
                    display: inline-block;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default IncomingChequeForm;
