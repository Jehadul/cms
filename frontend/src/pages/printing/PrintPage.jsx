import React, { useEffect, useState } from 'react';
import { getAllTemplates } from '../../api/templateApi';
import { useSearchParams } from 'react-router-dom';
import { getChequePdf } from '../../api/printingApi';

const PrintPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [chequeId, setChequeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadTemplates();
        const cid = searchParams.get('chequeId');
        if (cid) setChequeId(cid);
    }, [searchParams]);

    const loadTemplates = async () => {
        try {
            const data = await getAllTemplates();
            setTemplates(data);
            if (data.length > 0) setSelectedTemplate(data[0].id);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePrint = async () => {
        if (!selectedTemplate || !chequeId) {
            alert("Select Template and Cheque ID");
            return;
        }
        setLoading(true);
        try {
            const blob = await getChequePdf(chequeId, selectedTemplate);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `cheque_${chequeId}.pdf`); // or any other extension
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Print failed", error);
            alert("Failed to generate PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Cheque Printing Engine</h2>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div>
                    <label>Cheque ID:</label>
                    <input
                        type="text"
                        value={chequeId}
                        onChange={(e) => setChequeId(e.target.value)}
                        className="form-control"
                        placeholder="Enter Cheque ID"
                    />
                </div>

                <div>
                    <label>Select Template:</label>
                    <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="form-control"
                    >
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handlePrint}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Print Preview (PDF)'}
                </button>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h4>Capabilities:</h4>
                <ul>
                    <li>Dynamic Template Selection</li>
                    <li>PDF Generation (A4)</li>
                    <li>Pre-printed Cheque Support (Configurable Layout)</li>
                    <li>Amount in Words Conversion</li>
                </ul>
            </div>
        </div>
    );
};

export default PrintPage;
