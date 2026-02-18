import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChequeBook } from '../../api/chequeApi';
import { getAccountById } from '../../api/bankAccountApi';

const ChequeBookForm = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const accountId = queryParams.get('accountId');
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [formData, setFormData] = useState({
        accountId: accountId,
        seriesIdentifier: '',
        startNumber: '',
        endNumber: '',
        issuedDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (accountId) {
            getAccountById(accountId).then(setAccount).catch(console.error);
        }
    }, [accountId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (Number(formData.endNumber) < Number(formData.startNumber)) {
            alert("End Number must be greater than or equal to Start Number");
            setLoading(false);
            return;
        }

        try {
            await createChequeBook({
                ...formData,
                accountId: Number(accountId),
                startNumber: Number(formData.startNumber),
                endNumber: Number(formData.endNumber)
            });
            navigate(`/cheque-books?accountId=${accountId}`);
        } catch (error) {
            console.error("Failed to create cheque book", error);
            alert("Failed to create cheque book: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!accountId) return <div>Missing Account ID</div>;

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Add Cheque Book</h2>
            {account && <p className="text-muted">For Account: {account.bankName} - {account.accountNumber}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Series (Optional)</label>
                    <input type="text" name="seriesIdentifier" className="form-input" value={formData.seriesIdentifier} onChange={handleChange} placeholder="e.g. A" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Start Number</label>
                        <input type="number" name="startNumber" className="form-input" value={formData.startNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Number</label>
                        <input type="number" name="endNumber" className="form-input" value={formData.endNumber} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Issued Date</label>
                    <input type="date" name="issuedDate" className="form-input" value={formData.issuedDate} onChange={handleChange} required />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Cheque Book'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate(`/cheque-books?accountId=${accountId}`)} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChequeBookForm;
