import React, { useEffect, useState } from 'react';
import { getPdcExposure, runPdcCheck, getOutgoingExposureDetails, getIncomingExposureDetails } from '../../api/pdcApi';

const PdcDashboard = () => {
    const [exposure, setExposure] = useState([]);
    const [loading, setLoading] = useState(true);

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsType, setDetailsType] = useState(null); // 'INCOMING' or 'OUTGOING'
    const [detailsData, setDetailsData] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

    const handleViewDetails = async (type) => {
        setDetailsType(type);
        setShowDetailsModal(true);
        setLoadingDetails(true);
        try {
            let data = [];
            if (type === 'OUTGOING') {
                data = await getOutgoingExposureDetails();
            } else {
                data = await getIncomingExposureDetails();
            }
            setDetailsData(data);
        } catch (error) {
            console.error(`Failed to load ${type} details`, error);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Calculate totals
    const incomingTotal = exposure
        .filter(item => item.type === 'Incoming' && !['SETTLED', 'BOUNCED', 'RETURNED', 'CLEARED'].includes(item.status))
        .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    const outgoingTotal = exposure
        .filter(item => item.type === 'Outgoing' && !['SETTLED', 'BOUNCED', 'CANCELLED', 'VOID', 'CLEARED'].includes(item.status))
        .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>PDC Management & Exposure</h2>
                <button onClick={handleRunCheck} className="btn btn-secondary">Run PDC Check Now</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {/* Incoming Card */}
                <div className="card" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h3>Incoming Receivables Exposure</h3>
                        <button
                            className="btn btn-sm"
                            onClick={() => handleViewDetails('INCOMING')}
                            style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                        >
                            View Details
                        </button>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                        {incomingTotal.toLocaleString()}
                    </p>
                    <p className="text-muted">Net Pending/Due/Deposited</p>
                </div>

                {/* Outgoing Card */}
                <div className="card" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h3>Outgoing Payables Exposure</h3>
                        <button
                            className="btn btn-sm"
                            onClick={() => handleViewDetails('OUTGOING')}
                            style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                        >
                            View Details
                        </button>
                    </div>
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

            {/* Details Modal (Shared) */}
            {showDetailsModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '80%', maxWidth: '900px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '0', borderRadius: '1rem', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>
                                {detailsType === 'INCOMING' ? 'Incoming Receivables Details' : 'Outgoing Payables Details'}
                            </h3>
                            <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                            {loadingDetails ? (
                                <div>Loading details...</div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                                            <th style={{ padding: '0.75rem' }}>Cheque #</th>
                                            <th style={{ padding: '0.75rem' }}>{detailsType === 'INCOMING' ? 'Payer / Customer' : 'Payee'}</th>
                                            <th style={{ padding: '0.75rem' }}>Bank</th>
                                            <th style={{ padding: '0.75rem' }}>Amount</th>
                                            <th style={{ padding: '0.75rem' }}>Cheque Date</th>
                                            <th style={{ padding: '0.75rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailsData.map(cheque => (
                                            <tr key={cheque.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{cheque.chequeNumber}</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    {detailsType === 'INCOMING'
                                                        ? (cheque.customer ? cheque.customer.name : 'Unknown')
                                                        : (cheque.displayPayee || cheque.payeeName || 'Unknown')
                                                    }
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>{cheque.bankName || '-'}</td>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{cheque.amount?.toLocaleString()}</td>
                                                <td style={{ padding: '0.75rem' }}>{cheque.chequeDate}</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8rem',
                                                        backgroundColor: cheque.status === 'DUE' ? 'var(--color-warning)' : 'var(--color-background)',
                                                        border: '1px solid var(--color-border)'
                                                    }}>
                                                        {cheque.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                No active exposure found for {detailsType ? detailsType.toLowerCase() : ''}.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'right', backgroundColor: 'var(--color-surface)' }}>
                            <button className="btn" onClick={() => setShowDetailsModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdcDashboard;
