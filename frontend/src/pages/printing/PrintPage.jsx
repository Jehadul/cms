import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllTemplates } from '../../api/templateApi';
import { getChequePdf, getBatchChequePdf } from '../../api/printingApi';
import { getOutgoingExposureDetails } from '../../api/pdcApi';
import { Printer, Layers, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const PrintPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [printMode, setPrintMode] = useState('single'); // 'single' or 'batch'

    // Single Mode State
    const [chequeId, setChequeId] = useState('');

    // Batch Mode State
    const [batchIds, setBatchIds] = useState('');

    // Data State
    const [pendingCheques, setPendingCheques] = useState([]);

    // Status State
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadTemplates();
        loadPendingCheques();
        const cid = searchParams.get('chequeId');
        if (cid) setChequeId(cid);
    }, [searchParams]);

    const loadPendingCheques = async () => {
        try {
            const data = await getOutgoingExposureDetails();
            // Filter only 'ISSUED' (and maybe 'DUE' depending on workflow) cheques that need printing
            // Typically 'ISSUED' means generated but not printed/sent.
            const printable = data.filter(c => c.status === 'ISSUED' || c.status === 'DUE');
            setPendingCheques(printable);
        } catch (error) {
            console.error("Failed to load active cheques", error);
        }
    };

    const loadTemplates = async () => {
        try {
            const data = await getAllTemplates();
            setTemplates(data);
            if (data.length > 0) setSelectedTemplate(data[0].id);
        } catch (error) {
            console.error(error);
            setError("Failed to load templates.");
        }
    };

    const handleGenerate = async () => {
        setError(null);
        setSuccessMsg(null);
        setPreviewUrl(null);
        setLoading(true);

        try {
            if (!selectedTemplate) throw new Error("Please select a template.");

            let blob;
            if (printMode === 'single') {
                if (!chequeId) throw new Error("Please select a Cheque.");
                blob = await getChequePdf(chequeId, selectedTemplate);
            } else {
                if (!batchIds) throw new Error("Please enter Cheque IDs.");
                const ids = batchIds.split(',').map(id => id.trim()).filter(id => id);
                if (ids.length === 0) throw new Error("Invalid Cheque IDs.");
                blob = await getBatchChequePdf(ids, selectedTemplate);
            }

            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            setPreviewUrl(url);
            setSuccessMsg("PDF Generated Successfully. Ready to Print.");
        } catch (err) {
            console.error("Print generation failed", err);
            setError(err.message || "Failed to generate PDF. check inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary)', borderRadius: '1rem', color: 'white' }}>
                    <Printer size={32} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Cheque Printing Engine</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Generate and print professional cheques with custom templates.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
                {/* Controls Section */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Layers size={20} /> Configuration
                        </h3>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'var(--color-background)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                            <button
                                onClick={() => setPrintMode('single')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '0.25rem',
                                    fontWeight: '600',
                                    backgroundColor: printMode === 'single' ? 'white' : 'transparent',
                                    boxShadow: printMode === 'single' ? 'var(--shadow-sm)' : 'none',
                                    color: printMode === 'single' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                }}
                            >
                                Single Print
                            </button>
                            <button
                                onClick={() => setPrintMode('batch')}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '0.25rem',
                                    fontWeight: '600',
                                    backgroundColor: printMode === 'batch' ? 'white' : 'transparent',
                                    boxShadow: printMode === 'batch' ? 'var(--shadow-sm)' : 'none',
                                    color: printMode === 'batch' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                }}
                            >
                                Batch Print
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="form-input"
                                style={{ borderColor: !selectedTemplate ? 'var(--color-border)' : 'var(--color-primary)' }}
                            >
                                <option value="" disabled>-- Choose a Template --</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {templates.length === 0 && <small className="text-muted">No templates found.</small>}
                        </div>

                        {printMode === 'single' ? (
                            <div className="form-group">
                                <label className="form-label">Select Cheque to Print</label>
                                <select
                                    value={chequeId}
                                    onChange={(e) => setChequeId(e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">-- Select Cheque --</option>
                                    {pendingCheques.map(cheque => (
                                        <option key={cheque.id} value={cheque.id}>
                                            #{cheque.chequeNumber} - {cheque.payeeName || cheque.vendor?.name || 'Unknown'} ({cheque.amount?.toLocaleString()})
                                        </option>
                                    ))}
                                </select>
                                <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                                    Showing {pendingCheques.length} active (Issued/Due) cheques.
                                </small>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Cheque IDs (Batch)</label>
                                <textarea
                                    value={batchIds}
                                    onChange={(e) => setBatchIds(e.target.value)}
                                    className="form-input"
                                    rows="5"
                                    placeholder="e.g. 101, 102, 103"
                                    style={{ fontFamily: 'monospace' }}
                                />
                                <small style={{ color: 'var(--color-text-muted)', display: 'block', marginTop: '0.5rem' }}>
                                    Enter multiple system IDs separated by commas.
                                </small>
                            </div>
                        )}

                        {error && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fee2e2',
                                borderRadius: '0.5rem',
                                color: 'var(--color-error)',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #dcfce7',
                                borderRadius: '0.5rem',
                                color: 'var(--color-success)',
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <CheckCircle size={18} />
                                {successMsg}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            className="btn btn-primary"
                            disabled={loading || !selectedTemplate}
                            style={{ width: '100%', marginTop: '0.5rem' }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Generating PDF...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Printer size={18} /> Generate PDF
                                </span>
                            )}
                        </button>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>Capabilities</h4>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            <li>Standard A4 & Custom Sizes</li>
                            <li>Automatic "Amount in Words"</li>
                            <li>Batch Processing</li>
                            <li>High-DPI Vector Output</li>
                        </ul>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '80vh', padding: 0, overflow: 'hidden' }}>
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f8fafc'
                    }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                            <FileText size={18} /> Print Preview
                        </h3>
                        {previewUrl && (
                            <a
                                href={previewUrl}
                                download={printMode === 'single' ? `cheque_${chequeId}.pdf` : "batch_cheques.pdf"}
                                className="btn"
                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid var(--color-border)', backgroundColor: 'white' }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Download PDF
                            </a>
                        )}
                    </div>

                    <div style={{ flex: 1, backgroundColor: '#525659', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="Cheque PDF Preview"
                            />
                        ) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                <Printer size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p>Select a template and cheque to generate a preview.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintPage;
