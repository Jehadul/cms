import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTemplates, deleteTemplate } from '../../api/templateApi';

const ChequeTemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const data = await getAllTemplates();
            setTemplates(data);
        } catch (error) {
            console.error("Failed to load templates", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            try {
                await deleteTemplate(id);
                loadTemplates();
            } catch (error) {
                console.error("Failed to delete template", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Cheque Templates</h2>
                <Link to="/templates/add" className="btn btn-primary">Create New Template</Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Description</th>
                            <th style={{ padding: '0.75rem' }}>Active</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map(template => (
                            <tr key={template.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '0.75rem' }}>{template.name}</td>
                                <td style={{ padding: '0.75rem' }}>{template.description}</td>
                                <td style={{ padding: '0.75rem' }}>{template.active ? 'Yes' : 'No'}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link to={`/templates/edit/${template.id}`} className="btn btn-sm" style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }}>Edit</Link>
                                    <button onClick={() => handleDelete(template.id)} className="btn btn-sm" style={{ color: 'var(--color-error)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {templates.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No templates found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChequeTemplateList;
