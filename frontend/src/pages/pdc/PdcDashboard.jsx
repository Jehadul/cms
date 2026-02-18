import React, { useEffect, useState } from 'react';
import { getPdcExposure, runPdcCheck } from '../../api/pdcApi';

const PdcDashboard = () => {
    const [exposure, setExposure] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getPdcExposure();
            setExposure(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRunCheck = async () => {
        setLoading(true);
        try {
            await runPdcCheck();
            await loadData();
            alert("PDC Check Completed");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals
    const incomingTotal = exposure
        .filter(item => item.type === 'Incoming' && item.status !== 'SETTLED' && item.status !== 'BOUNCED' && item.status !== 'RETURNED')
        .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    const outgoingTotal = exposure
        .filter(item => item.type === 'Outgoing' && item.status !== 'CLEARED' && item.status !== 'BOUNCED' && item.status !== 'CANCELLED' && item.status !== 'VOID')
        .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>PDC Management & Exposure</h2>
                <button onClick={handleRunCheck} className="btn btn-secondary">Run PDC Check Now</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3>Incoming Receivables Exposure</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                        {incomingTotal.toLocaleString()}
                    </p>
                    <p className="text-muted">Net Pending/Due/Deposited</p>
                </div>
                <div className="card">
                    <h3>Outgoing Payables Exposure</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-error)' }}>
                        {outgoingTotal.toLocaleString()}
                    </p>
                    <p className="text-muted">Net Issued/Due/Presented</p>
                </div>
            </div>

            <div className="card">
                <h3>Detailed Status Breakdown</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.5rem' }}>Type</th>
                            <th style={{ padding: '0.5rem' }}>Status</th>
                            <th style={{ padding: '0.5rem' }}>Count</th>
                            <th style={{ padding: '0.5rem' }}>Total Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exposure.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: item.type === 'Incoming' ? 'var(--color-success)' : 'var(--color-error)'
                                    }}>
                                        {item.type}
                                    </span>
                                </td>
                                <td style={{ padding: '0.5rem' }}>{item.status}</td>
                                <td style={{ padding: '0.5rem' }}>{item.count}</td>
                                <td style={{ padding: '0.5rem' }}>{(item.totalAmount || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Future: Add Tabs for "Overdue List", "Aging Report" using separate API calls */}
        </div>
    );
};

export default PdcDashboard;
