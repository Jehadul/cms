import React, { useState } from 'react';
import { getReportData, exportReport } from '../api/reportApi';
import {
    FileText, Calendar, Filter, Download,
    Search, PieChart, AlertTriangle, CheckCircle, Clock, XCircle
} from 'lucide-react';

const ReportDashboard = () => {
    const [activeReport, setActiveReport] = useState('REGISTER');
    const [filters, setFilters] = useState({
        companyId: '', // Default to context company in real app
        status: '',
        startDate: new Date().toISOString().split('T')[0], // Default Today
        endDate: new Date().toISOString().split('T')[0],
        bankId: ''
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ count: 0, totalAmount: 0 });

    const REPORT_TYPES = [
        { id: 'REGISTER', label: 'Cheque Register', icon: <FileText size={18} />, description: 'Complete list of all cheque transactions.' },
        { id: 'PDC', label: 'PDC Management', icon: <Clock size={18} />, description: 'Post-Dated Cheques pending clearance.' },
        { id: 'BOUNCED', label: 'Bounced / Returned', icon: <XCircle size={18} />, description: 'Cheques returned unpaid by the bank.' },
        { id: 'CLEARED', label: 'Cleared Cheques', icon: <CheckCircle size={18} />, description: 'Successfully processed payments.' },
        { id: 'PENDING', label: 'Pending Issuance', icon: <AlertTriangle size={18} />, description: 'Cheques generated but not yet issued.' }
    ];

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...filters,
                reportType: activeReport,
                companyId: filters.companyId ? parseInt(filters.companyId) : 1 // Mock ID
            };
            const result = await getReportData(payload);
            setData(result);

            // Calculate summary
            const total = result.reduce((sum, item) => sum + (item.amount || 0), 0);
            setSummary({ count: result.length, totalAmount: total });

        } catch (error) {
            console.error("Failed to load report", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const payload = {
                ...filters,
                reportType: activeReport,
                companyId: filters.companyId ? parseInt(filters.companyId) : 1
            };
            const blob = await exportReport(payload, type);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${activeReport}_Report_${new Date().toISOString().slice(0, 10)}.${type === 'excel' ? 'xlsx' : type}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed");
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem', height: 'calc(100vh - 80px)', display: 'flex', gap: '1.5rem' }}>

            {/* Sidebar Navigation */}
            <div className="card" style={{ width: '280px', padding: 0, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PieChart size={24} color="var(--color-primary)" /> Reports
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0' }}>Select a report to view</p>
                </div>
                <div style={{ padding: '1rem', flex: 1 }}>
                    {REPORT_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => { setActiveReport(type.id); setData([]); setSummary({ count: 0, totalAmount: 0 }); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: activeReport === type.id ? 'var(--color-primary)' : 'transparent',
                                color: activeReport === type.id ? 'white' : 'var(--color-text)',
                                textAlign: 'left',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {type.icon}
                            <div>
                                <div style={{ fontWeight: 500 }}>{type.label}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{type.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Filters Header */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                                {REPORT_TYPES.find(r => r.id === activeReport)?.label}
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Configure filters and generate your report.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleExport('pdf')} className="btn btn-outline" disabled={data.length === 0} title="Export PDF"><Download size={18} /> PDF</button>
                            <button onClick={() => handleExport('excel')} className="btn btn-outline" disabled={data.length === 0} title="Export Excel"><Download size={18} /> Excel</button>
                            <button onClick={() => handleExport('csv')} className="btn btn-outline" disabled={data.length === 0} title="Export CSV"><Download size={18} /> CSV</button>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '1rem', alignItems: 'end' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Start Date</label>
                            <input type="date" name="startDate" className="form-control" value={filters.startDate} onChange={handleFilterChange} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>End Date</label>
                            <input type="date" name="endDate" className="form-control" value={filters.endDate} onChange={handleFilterChange} />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status</label>
                            <select name="status" className="form-control" value={filters.status} onChange={handleFilterChange}>
                                <option value="">All Statuses</option>
                                <option value="ISSUED">Issued</option>
                                <option value="PRINTED">Printed</option>
                                <option value="CLEARED">Cleared</option>
                                <option value="BOUNCED">Bounced</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Bank</label>
                            <select name="bankId" className="form-control" value={filters.bankId} onChange={handleFilterChange}>
                                <option value="">All Banks</option>
                                {/* Map banks here if available */}
                                <option value="1">Mock Bank A</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={18} /> Generate
                        </button>
                    </form>
                </div>

                {/* Results Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>

                    {/* Summary Cards */}
                    {data.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '50%', color: '#2563eb' }}><FileText size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 600 }}>Total Transactions</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a' }}>{summary.count}</div>
                                </div>
                            </div>
                            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '50%', color: '#16a34a' }}><PieChart size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Total Volume</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d' }}>{summary.totalAmount.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Table */}
                    <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                            Report Data
                        </div>
                        <div style={{ flex: 1, overflow: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Cheque No</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Payee</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Amount</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Cheque Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center' }}>
                                                <div className="spinner-border text-primary" role="status"></div>
                                                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Generating report...</p>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                                <div style={{ marginBottom: '1rem', opacity: 0.5 }}><Search size={48} /></div>
                                                No data found for the selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((row, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover-row">
                                                <td style={{ padding: '1rem', fontWeight: 500 }}>{row.chequeNumber}</td>
                                                <td style={{ padding: '1rem' }}>{row.payeeName}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                                                    {row.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td style={{ padding: '1rem' }}>{row.chequeDate}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span className={`status-badge status-${row.status?.toLowerCase()}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                    {row.bank?.name || row.accountNumber}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .status-badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; }
                .status-issued { background-color: #dbeafe; color: #1e40af; }
                .status-printed { background-color: #f3e8ff; color: #6b21a8; }
                .status-cleared { background-color: #d1fae5; color: #065f46; }
                .status-bounced { background-color: #fee2e2; color: #991b1b; }
                .status-pending { background-color: #ffedd5; color: #9a3412; }
                .status-cancelled { background-color: #f1f5f9; color: #475569; }
                .hover-row:hover { background-color: #f8fafc; }
                .btn-outline { border: 1px solid var(--color-border); background: white; color: var(--color-text); display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; }
                .btn-outline:hover:not(:disabled) { background-color: #f1f5f9; border-color: #cbd5e1; }
                .btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default ReportDashboard;
