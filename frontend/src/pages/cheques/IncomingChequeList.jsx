import React, { useEffect, useState } from 'react';
import { getAllIncomingCheques } from '../../api/incomingChequeApi';
import { downloadReceipt, emailReceipt } from '../../api/receiptApi';

const IncomingChequeList = () => {
    const [cheques, setCheques] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCheques();
    }, []);

    const loadCheques = async () => {
        try {
            // Passing companyId=1 for demo purposes as user context might be loose
            const data = await getAllIncomingCheques(1);
            setCheques(data);
        } catch (error) {
            console.error("Failed to load incoming cheques", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = async (cheque) => {
        try {
            const blob = await downloadReceipt(cheque.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt_${cheque.chequeNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Failed to download receipt", error);
            alert("Failed to download receipt");
        }
    };

    const handleEmailReceipt = async (cheque) => {
        const email = prompt("Enter recipient email:", cheque.customerEmail || ""); // Assuming customerEmail might be available
        if (email) {
            try {
                await emailReceipt(cheque.id, email);
                alert("Email sent successfully!");
            } catch (error) {
                console.error("Failed to send email", error);
                alert("Failed to send email");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Incoming Cheques & Receipts</h2>
                <a href="/incoming-cheques/add" className="btn btn-primary">Receive New Cheque</a>
            </div>
            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.5rem' }}>Customer</th>
                            <th style={{ padding: '0.5rem' }}>Cheque No.</th>
                            <th style={{ padding: '0.5rem' }}>Bank</th>
                            <th style={{ padding: '0.5rem' }}>Amount</th>
                            <th style={{ padding: '0.5rem' }}>Date</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cheques.map(cheque => (
                            <tr key={cheque.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.5rem' }}>{cheque.customerName}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.chequeNumber}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.bankName}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.amount}</td>
                                <td style={{ padding: '0.5rem' }}>{cheque.chequeDate}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <button
                                        onClick={() => handleDownloadReceipt(cheque)}
                                        className="btn btn-sm"
                                        style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}
                                    >
                                        Receipt PDF
                                    </button>
                                    <button
                                        onClick={() => handleEmailReceipt(cheque)}
                                        className="btn btn-sm"
                                        style={{ color: 'var(--color-secondary)' }}
                                    >
                                        Email Receipt
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cheques.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No incoming cheques found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncomingChequeList;
