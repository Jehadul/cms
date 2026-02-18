import React, { useState } from 'react';
import { getReportData, exportReport } from '../api/reportApi';

const ReportDashboard = () => {
    const [filters, setFilters] = useState({
        companyId: '',
        status: '',
        startDate: '',
        endDate: '',
        reportType: 'REGISTER'
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await getReportData({ ...filters, companyId: filters.companyId ? parseInt(filters.companyId) : null });
            setData(result);
        } catch (error) {
            console.error("Failed to load report", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const blob = await exportReport({ ...filters, companyId: filters.companyId ? parseInt(filters.companyId) : null }, type);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${filters.reportType}.${type === 'excel' ? 'xlsx' : type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed");
        }
    };

    return (
        <div className="report-dashboard">
            <h2 style={{ marginBottom: '1.5rem' }}>Reports & Inquiry</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Filters</h3>
                <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>

                    <div className="form-group">
                        <label>Report Type</label>
                        <select name="reportType" className="form-control" value={filters.reportType} onChange={handleChange}>
                            <option value="REGISTER">Cheque Register</option>
                            <option value="PDC">PDC Aging</option>
                            <option value="BOUNCED">Bounced Cheques</option>
                            <option value="PENDING">Pending Cheques</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" className="form-control" value={filters.status} onChange={handleChange}>
                            <option value="">All Statuses</option>
                            <option value="ISSUED">Issued</option>
                            <option value="PRINTED">Printed</option>
                            <option value="CLEARED">Cleared</option>
                            <option value="BOUNCED">Bounced</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleChange} />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>View Report</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Results ({data.length})</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleExport('pdf')} className="btn btn-sm" style={{ backgroundColor: '#e74c3c', color: 'white' }}>PDF</button>
                        <button onClick={() => handleExport('excel')} className="btn btn-sm" style={{ backgroundColor: '#27ae60', color: 'white' }}>Excel</button>
                        <button onClick={() => handleExport('csv')} className="btn btn-sm" style={{ backgroundColor: '#f39c12', color: 'white' }}>CSV</button>
                    </div>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: '0.5rem' }}>Cheque No</th>
                                    <th style={{ padding: '0.5rem' }}>Payee</th>
                                    <th style={{ padding: '0.5rem' }}>Amount</th>
                                    <th style={{ padding: '0.5rem' }}>Date</th>
                                    <th style={{ padding: '0.5rem' }}>Status</th>
                                    <th style={{ padding: '0.5rem' }}>Bank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(cheque => (
                                    <tr key={cheque.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.5rem' }}>{cheque.chequeNumber}</td>
                                        <td style={{ padding: '0.5rem' }}>{cheque.payeeName}</td>
                                        <td style={{ padding: '0.5rem' }}>{cheque.amount}</td>
                                        <td style={{ padding: '0.5rem' }}>{cheque.chequeDate}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <span className={`status-badge status-${cheque.status.toLowerCase()}`}>
                                                {cheque.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>{cheque.accountNumber}</td> {/* Mapping might differ in UI vs Export */}
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <style>{`
                .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: white; display: inline-block; }
                .status-issued { background-color: var(--color-primary); }
                .status-printed { background-color: var(--color-secondary); }
                .status-cleared { background-color: var(--color-success); }
                .status-bounced { background-color: var(--color-error); }
                .status-cancelled { background-color: #666; }
                .status-pending { background-color: #f39c12; }
            `}</style>
        </div>
    );
};

export default ReportDashboard;
