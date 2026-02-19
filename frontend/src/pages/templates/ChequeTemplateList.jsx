import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTemplates, deleteTemplate } from '../../api/templateApi';
import { FileText, Plus, Edit, Trash, CheckCircle, XCircle, Layout } from 'lucide-react';

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
        if (window.confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
            try {
                await deleteTemplate(id);
                loadTemplates();
            } catch (error) {
                console.error("Failed to delete template", error);
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Layout size={28} /> Cheque Templates
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your cheque printing layouts and configurations.</p>
                </div>
                <Link to="/templates/add" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Create Template
                </Link>
            </div>

            {templates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--color-background)', borderRadius: '1rem', border: '2px dashed var(--color-border)' }}>
                    <FileText size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>No templates found. Get started by creating one.</p>
                    <Link to="/templates/add" className="btn btn-primary">Create Your First Template</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {templates.map(template => (
                        <div key={template.id} className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'white', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={20} color="var(--color-primary)" />
                                </div>
                                <div style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    backgroundColor: template.active ? '#dcfce7' : '#f1f5f9',
                                    color: template.active ? '#166534' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}>
                                    {template.active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {template.active ? 'Active' : 'Inactive'}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{template.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                                    {template.description || "No description provided."}
                                </p>
                            </div>

                            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem' }}>
                                <Link to={`/templates/edit/${template.id}`} className="btn btn-sm" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', border: '1px solid var(--color-border)' }}>
                                    <Edit size={16} /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="btn btn-sm"
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', border: '1px solid #fee2e2', color: 'var(--color-error)', backgroundColor: '#fef2f2' }}
                                >
                                    <Trash size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChequeTemplateList;
