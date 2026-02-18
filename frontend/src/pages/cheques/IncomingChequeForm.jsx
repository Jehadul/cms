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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

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

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>{id ? 'Edit Incoming Cheque' : 'Receive New Cheque'}</h2>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Customer (Payer)</label>
                    <select
                        name="customerId"
                        className="form-control"
                        value={formData.customerId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Cheque Number</label>
                        <input type="text" name="chequeNumber" className="form-control" value={formData.chequeNumber} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Amount</label>
                        <input type="number" step="0.01" name="amount" className="form-control" value={formData.amount} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Bank Name</label>
                        <input type="text" name="bankName" className="form-control" value={formData.bankName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Branch Name</label>
                        <input type="text" name="branchName" className="form-control" value={formData.branchName} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Cheque Date</label>
                        <input type="date" name="chequeDate" className="form-control" value={formData.chequeDate} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Received Date</label>
                        <input type="date" name="receivedDate" className="form-control" value={formData.receivedDate} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Remarks</label>
                    <textarea name="remarks" className="form-control" value={formData.remarks} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Scanned Cheque Image (Optional)</label>
                    <input type="file" className="form-control" onChange={handleFileChange} accept="image/*,.pdf" />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Processing...' : 'Save & Generate Receipt'}
                </button>
            </form>
        </div>
    );
};

export default IncomingChequeForm;
