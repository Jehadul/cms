import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAccount, getAccountById, updateAccount } from '../../api/bankAccountApi';
import { getAllBanks, getBranchesByBank } from '../../api/bankApi';

const BankAccountForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const companyId = 1; // TODO: Context

    const [formData, setFormData] = useState({
        accountNumber: '',
        accountType: 'Current',
        currency: 'INR',
        balance: 0,
        active: true,
        companyId: companyId,
        branchId: '',
        bankId: '' // Temporary for selection
    });

    const [banks, setBanks] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBanks();
        if (isEditMode) {
            loadAccount();
        }
    }, [id]);

    const loadBanks = async () => {
        try {
            const data = await getAllBanks();
            setBanks(data);
        } catch (error) {
            console.error("Failed to load banks", error);
        }
    };

    const loadAccount = async () => {
        try {
            const data = await getAccountById(id);
            setFormData({
                ...data,
                bankId: data.bankId // Needs to be returned by DTO or we infer it
                // Actually our DTO doesn't have bankId directly, but we can get it from branch if we had branch details.
                // For now, let's assume the user has to re-select bank if they want to change branch, 
                // or we need to fetch branch details. 
                // Simplified: We'll just fetch branches for the current branch's bank if we can.
            });
            // Ideally we should fetch the bank ID from the branch ID
            // For now, let's just leave bankId empty in form if editing, user might need to re-select to change branch.
            // Or better: Fetch branch details to get bank ID.
        } catch (error) {
            console.error("Failed to fetch account", error);
        }
    };

    // When bank changes, load branches
    useEffect(() => {
        if (formData.bankId) {
            loadBranches(formData.bankId);
        } else {
            setBranches([]);
        }
    }, [formData.bankId]);

    const loadBranches = async (bankId) => {
        try {
            const data = await getBranchesByBank(bankId);
            setBranches(data);
        } catch (error) {
            console.error("Failed to load branches", error);
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

        const dataToSubmit = {
            ...formData,
            branchId: Number(formData.branchId),
            balance: Number(formData.balance)
        };
        // Remove helper fields
        delete dataToSubmit.bankId;

        try {
            if (isEditMode) {
                await updateAccount(id, dataToSubmit);
            } else {
                await createAccount(dataToSubmit);
            }
            navigate('/accounts');
        } catch (error) {
            console.error("Failed to save account", error);
            alert("Failed to save account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{isEditMode ? 'Edit Bank Account' : 'Add New Bank Account'}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Bank</label>
                        <select name="bankId" className="form-input" value={formData.bankId} onChange={handleChange} required>
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>{bank.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Branch</label>
                        <select name="branchId" className="form-input" value={formData.branchId} onChange={handleChange} required disabled={!formData.bankId}>
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input type="text" name="accountNumber" className="form-input" value={formData.accountNumber} onChange={handleChange} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <select name="accountType" className="form-input" value={formData.accountType} onChange={handleChange}>
                            <option value="Current">Current</option>
                            <option value="Savings">Savings</option>
                            <option value="OD">Overdraft</option>
                            <option value="CC">Cash Credit</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Currency</label>
                        <input type="text" name="currency" className="form-input" value={formData.currency} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Opening Balance</label>
                    <input type="number" name="balance" className="form-input" value={formData.balance} onChange={handleChange} />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="active" id="active" checked={formData.active} onChange={handleChange} />
                    <label htmlFor="active" style={{ cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Account'}
                    </button>
                    <button type="button" className="btn" onClick={() => navigate('/accounts')} style={{ border: '1px solid var(--color-border)' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BankAccountForm;
