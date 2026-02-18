import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createTemplate, updateTemplate, getTemplateById } from '../../api/templateApi';

const ChequeTemplateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        backgroundPath: '',
        canvasConfig: JSON.stringify({
            payee: { x: 100, y: 750, fontSize: 12 },
            date: { x: 450, y: 780, fontSize: 12 },
            amountNumeric: { x: 450, y: 700, fontSize: 12 },
            amountWords: { x: 100, y: 680, fontSize: 12 }
        }, null, 2),
        active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const data = await getTemplateById(id);
                // Ensure canvasConfig is string
                if (typeof data.canvasConfig === 'object') {
                    data.canvasConfig = JSON.stringify(data.canvasConfig, null, 2);
                }
                setFormData(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            loadTemplate();
        }
    }, [id]);

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
        try {
            // Validate JSON
            try {
                JSON.parse(formData.canvasConfig);
            } catch (error) {
                console.error("JSON parse error", error);
                alert("Invalid JSON in Canvas Config");
                setLoading(false);
                return;
            }

            if (id) {
                await updateTemplate(id, formData);
            } else {
                await createTemplate(formData);
            }
            navigate('/templates');
        } catch (error) {
            console.error("Failed to save template", error);
            alert("Failed to save template");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>{id ? 'Edit Cheque Template' : 'Create Cheque Template'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Template Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Canvas Configuration (JSON)</label>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        Define coordinates (x, y) and font sizes for fields: payee, date, amountNumeric, amountWords.
                        Coordinates are relative to bottom-left (standard PDF). A4 size is roughly 595 x 842 points.
                    </p>
                    <textarea
                        name="canvasConfig"
                        className="form-control"
                        rows="10"
                        style={{ fontFamily: 'monospace' }}
                        value={formData.canvasConfig}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        style={{ width: 'auto', marginRight: '0.5rem' }}
                    />
                    <label style={{ marginBottom: 0 }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Template'}
                    </button>
                    <Link to="/templates" className="btn btn-secondary">Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default ChequeTemplateForm;
