import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createTemplate, updateTemplate, getTemplateById } from '../../api/templateApi';
import { Save, ArrowLeft, Plus, Trash, Move, Type, RotateCw } from 'lucide-react';

const A4_WIDTH = 595;
const A4_HEIGHT = 842;

const FIELD_DEFAULTS = {
    fontSize: 12,
    isBold: false,
    rotation: 0,
    charSpacing: 0
};

const AVAILABLE_FIELDS = [
    { key: 'payee', label: 'Payee Name' },
    { key: 'date', label: 'Date' },
    { key: 'amountNumeric', label: 'Amount (Numeric)' },
    { key: 'amountWords', label: 'Amount (Words)' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'acPayee', label: 'A/C Payee Cross' },
    { key: 'signatureLabel', label: 'Signature Label' },
    { key: 'memo', label: 'Memo / Reference' },
    { key: 'extra1', label: 'Extra Label' }
];

const ChequeTemplateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);

    // Canvas State (the JSON object)
    const [canvasConfig, setCanvasConfig] = useState({
        payee: { x: 100, y: 720, fontSize: 10, isBold: false, rotation: 0, charSpacing: 0 },
        date: { x: 450, y: 780, fontSize: 12, isBold: false, rotation: 0, charSpacing: 10 }, // Added charSpacing
        amountNumeric: { x: 450, y: 680, fontSize: 12, isBold: true, rotation: 0, charSpacing: 0 },
        amountWords: { x: 140, y: 690, fontSize: 10, isBold: false, rotation: 0, charSpacing: 0 },
        bankName: { x: 100, y: 750, fontSize: 10, isBold: false, rotation: 0, charSpacing: 0 },
        companyName: { x: 300, y: 640, fontSize: 11, isBold: true, rotation: 0, charSpacing: 0 },
        acPayee: { x: 50, y: 800, fontSize: 8, isBold: true, rotation: 45, charSpacing: 0 },
        signatureLabel: { x: 420, y: 600, fontSize: 8, isBold: false, rotation: 0, charSpacing: 0 }
    });

    const [selectedField, setSelectedField] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dragging State
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const configStartRef = useRef(null);

    useEffect(() => {
        if (id) {
            loadTemplate();
        }
    }, [id]);

    const loadTemplate = async () => {
        try {
            const data = await getTemplateById(id);
            setName(data.name);
            setDescription(data.description);
            setActive(data.active);

            let config = data.canvasConfig;
            if (typeof config === 'string') {
                try {
                    config = JSON.parse(config);
                } catch (e) {
                    console.error("Failed to parse config", e);
                    config = {};
                }
            }
            // Merge with defaults to ensure all fields have values
            setCanvasConfig(config);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name,
                description,
                active,
                canvasConfig: JSON.stringify(canvasConfig)
            };

            if (id) {
                await updateTemplate(id, payload);
            } else {
                await createTemplate(payload);
            }
            navigate('/templates');
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save template");
        } finally {
            setLoading(false);
        }
    };

    const updateFieldConfig = (key, updates) => {
        setCanvasConfig(prev => ({
            ...prev,
            [key]: { ...prev[key], ...updates }
        }));
    };

    const addField = (fieldKey) => {
        if (canvasConfig[fieldKey]) {
            alert("Field already exists!");
            return;
        }
        setCanvasConfig(prev => ({
            ...prev,
            [fieldKey]: { x: A4_WIDTH / 2, y: A4_HEIGHT / 2, ...FIELD_DEFAULTS }
        }));
        setSelectedField(fieldKey);
    };

    const removeField = (fieldKey) => {
        setCanvasConfig(prev => {
            const next = { ...prev };
            delete next[fieldKey];
            return next;
        });
        if (selectedField === fieldKey) setSelectedField(null);
    };

    // Drag Logic
    const handleMouseDown = (e, fieldKey) => {
        e.stopPropagation(); // Prevent deselecting
        setSelectedField(fieldKey);
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        configStartRef.current = { ...canvasConfig[fieldKey] };
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !selectedField) return;

        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y; // Standard screen Y (down is positive)

        // CSS bottom: y. Increasing Mouse Y (moving down) means decreasing CSS bottom.
        // So dy > 0 (down) -> decrease y.
        // dx > 0 (right) -> increase x.

        const newX = Math.round(configStartRef.current.x + dx);
        const newY = Math.round(configStartRef.current.y - dy); // Inverted Y for PDF coords

        updateFieldConfig(selectedField, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Global mouse up to catch drops outside elements
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/templates" className="btn btn-icon"><ArrowLeft size={20} /></Link>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{id ? 'Edit Template' : 'New Template'}</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/templates')}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> {loading ? 'Saving...' : 'Save Template'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Sidebar Controls */}
                <div style={{ width: '300px', padding: '1rem', borderRight: '1px solid var(--color-border)', backgroundColor: '#f8fafc', overflowY: 'auto' }}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Template Name" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows="2" />
                    </div>

                    <hr style={{ margin: '1rem 0', borderColor: 'var(--color-border)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Fields</h4>
                        <div className="dropdown">
                            {/* Add Field Dropdown */}
                            <select
                                onChange={(e) => { if (e.target.value) { addField(e.target.value); e.target.value = "" } }}
                                className="form-select"
                                style={{ fontSize: '0.8rem', padding: '0.2rem', maxWidth: '120px' }}
                            >
                                <option value="">+ Add Field</option>
                                {AVAILABLE_FIELDS.map(f => (
                                    <option key={f.key} value={f.key} disabled={!!canvasConfig[f.key]}>
                                        {f.label} {canvasConfig[f.key] ? '✓' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedField ? (
                        <div className="card" style={{ padding: '1rem', backgroundColor: 'white', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)' }}>
                                    {AVAILABLE_FIELDS.find(f => f.key === selectedField)?.label || selectedField}
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => setSelectedField(null)} className="btn btn-sm btn-secondary" style={{ padding: '2px 6px' }}>Done</button>
                                    <button onClick={() => removeField(selectedField)} className="text-danger" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem' }}>X (pts)</label>
                                    <input type="number" className="form-input" value={canvasConfig[selectedField].x} onChange={e => updateFieldConfig(selectedField, { x: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem' }}>Y (pts from bottom)</label>
                                    <input type="number" className="form-input" value={canvasConfig[selectedField].y} onChange={e => updateFieldConfig(selectedField, { y: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem' }}>Font Size</label>
                                <input type="number" className="form-input" value={canvasConfig[selectedField].fontSize || 12} onChange={e => updateFieldConfig(selectedField, { fontSize: parseInt(e.target.value) || 12 })} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={canvasConfig[selectedField].isBold || false} onChange={e => updateFieldConfig(selectedField, { isBold: e.target.checked })} />
                                    Bold
                                </label>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.75rem' }}>Rotation (deg)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="number" className="form-input" value={canvasConfig[selectedField].rotation || 0} onChange={e => updateFieldConfig(selectedField, { rotation: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>

                            {selectedField === 'date' && (
                                <div className="form-group">
                                    <label style={{ fontSize: '0.75rem' }}>Character Spacing</label>
                                    <input type="number" className="form-input" value={canvasConfig[selectedField].charSpacing || 0} onChange={e => updateFieldConfig(selectedField, { charSpacing: parseFloat(e.target.value) || 0 })} />
                                </div>
                            )}

                        </div>
                    ) : (
                        <div style={{ marginTop: '1rem' }}>
                            <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Active Elements</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {Object.keys(canvasConfig).map(key => (
                                    <li
                                        key={key}
                                        onClick={() => setSelectedField(key)}
                                        style={{
                                            padding: '0.75rem',
                                            backgroundColor: 'white',
                                            border: '1px solid var(--color-border)',
                                            marginBottom: '0.5rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                        className="hover-shadow"
                                    >
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                            {AVAILABLE_FIELDS.find(f => f.key === key)?.label || key}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            Edit &rarr;
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {Object.keys(canvasConfig).length === 0 && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>
                                    No fields added. Add a field above.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Canvas Area */}
                <div style={{ flex: 1, padding: '2rem', backgroundColor: '#e2e8f0', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: `${A4_WIDTH}px`,
                            height: `${A4_HEIGHT}px`,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            border: '1px solid #cbd5e1',
                            backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                        onClick={() => setSelectedField(null)}
                    >
                        {/* Cheque "Leaf" Visual Guide (Approximate standard cheque size within A4) */}
                        <div style={{
                            position: 'absolute',
                            left: '0px',
                            bottom: '500px', // Standard cheques are usually at bottom of A4 or top?
                            // User example coordinates Y=780 imply TOP of page (origin bottom).
                            // A4 height is 842. Y=780 is 62px from TOP.
                            // So let's just assume the whole A4 is the printing area.
                            width: '100%',
                            height: '300px',
                            border: '1px dashed #94a3b8',
                            pointerEvents: 'none'
                        }}></div>

                        {/* Ruler Markers */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '0.2rem', fontSize: '0.7rem', color: '#64748b' }}>(0,0)</div>

                        {/* Fields */}
                        {Object.entries(canvasConfig).map(([key, config]) => (
                            <div
                                key={key}
                                onMouseDown={(e) => handleMouseDown(e, key)}
                                style={{
                                    position: 'absolute',
                                    left: `${config.x}px`,
                                    bottom: `${config.y}px`, // PDF Coordinate System!
                                    cursor: isDragging && selectedField === key ? 'grabbing' : 'grab',
                                    padding: '2px 4px',
                                    border: selectedField === key ? '2px solid var(--color-primary)' : '1px dashed #cbd5e1',
                                    backgroundColor: selectedField === key ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                                    fontSize: `${config.fontSize || 12}px`,
                                    fontWeight: config.isBold ? 'bold' : 'normal',
                                    whiteSpace: 'nowrap',
                                    transform: `rotate(${config.rotation || 0}deg)`,
                                    transformOrigin: 'bottom left', // Match PDF rotation origin usually
                                    letterSpacing: config.charSpacing ? `${config.charSpacing}px` : 'normal',
                                    color: 'black',
                                    userSelect: 'none',
                                    zIndex: selectedField === key ? 10 : 1
                                }}
                            >
                                {key === 'acPayee' ? "A/C PAYEE ONLY" :
                                    key === 'amountWords' ? "Twenty Five Thousand Only" :
                                        key === 'amountNumeric' ? "25,000.00" :
                                            key === 'date' ? "25-02-2026" :
                                                key === 'signatureLabel' ? "Authorized Signature" :
                                                    AVAILABLE_FIELDS.find(f => f.key === key)?.label || key}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChequeTemplateForm;
