import React, { useEffect, useState } from 'react';
import { getAlertConfig, updateAlertConfig } from '../../api/notificationApi';
import { Bell, Mail, MessageSquare, Save, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const AlertConfigForm = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const COMPANY_ID = 1; // In real app, get from Context/Auth

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const data = await getAlertConfig(COMPANY_ID);
            setConfig(data);
        } catch (error) {
            console.error("Failed to load config", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updateAlertConfig(COMPANY_ID, config);
            setMessage({ type: 'success', text: 'Configuration saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Failed to save config", error);
            setMessage({ type: 'error', text: 'Failed to save configuration.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!config) return <div>Failed to load configuration.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bell size={28} /> Alert Configuration
                </h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Customize how and when you receive system notifications.</p>
            </div>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Notification Channels */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare size={20} /> Notification Channels
                    </h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="form-check form-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                            <div>
                                <label className="form-check-label" htmlFor="inAppEnabled" style={{ fontWeight: '500', display: 'block' }}>In-App Notifications</label>
                                <small style={{ color: 'var(--color-text-muted)' }}>Receive alerts directly within the application dashboard.</small>
                            </div>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="inAppEnabled"
                                name="inAppEnabled"
                                checked={config.inAppEnabled}
                                onChange={handleChange}
                                style={{ transform: 'scale(1.2)' }}
                            />
                        </div>

                        <div className="form-check form-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                            <div>
                                <label className="form-check-label" htmlFor="emailEnabled" style={{ fontWeight: '500', display: 'block' }}>Email Notifications</label>
                                <small style={{ color: 'var(--color-text-muted)' }}>Receive critical alerts via email.</small>
                            </div>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="emailEnabled"
                                name="emailEnabled"
                                checked={config.emailEnabled}
                                onChange={handleChange}
                                style={{ transform: 'scale(1.2)' }}
                            />
                        </div>

                        <div className="form-check form-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', opacity: 0.7 }}>
                            <div>
                                <label className="form-check-label" htmlFor="smsEnabled" style={{ fontWeight: '500', display: 'block' }}>SMS Notifications</label>
                                <small style={{ color: 'var(--color-text-muted)' }}>Receive urgent alerts via SMS (Premium Feature).</small>
                            </div>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="smsEnabled"
                                name="smsEnabled"
                                checked={config.smsEnabled}
                                onChange={handleChange}
                                style={{ transform: 'scale(1.2)' }}
                                disabled // Mock for now
                            />
                        </div>
                    </div>
                </div>

                {/* Event Triggers */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} /> Event Triggers
                    </h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div className="form-check form-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label className="form-check-label" htmlFor="notifyPdcDueToday" style={{ fontWeight: '500' }}>Notify when Outgoing Cheque is Due Today</label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="notifyPdcDueToday"
                                name="notifyPdcDueToday"
                                checked={config.notifyPdcDueToday}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                            <div className="form-check form-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <label className="form-check-label" htmlFor="notifyPdcUpcoming" style={{ fontWeight: '500' }}>Notify before Due Date (Upcoming)</label>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="notifyPdcUpcoming"
                                    name="notifyPdcUpcoming"
                                    checked={config.notifyPdcUpcoming}
                                    onChange={handleChange}
                                />
                            </div>

                            {config.notifyPdcUpcoming && (
                                <div style={{ paddingLeft: '2rem' }}>
                                    <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Days Before Due Date</label>
                                    <input
                                        type="number"
                                        name="daysBeforeUpcoming"
                                        className="form-control"
                                        value={config.daysBeforeUpcoming}
                                        onChange={handleChange}
                                        style={{ maxWidth: '100px' }}
                                        min="1"
                                        max="30"
                                    />
                                    <small style={{ color: 'var(--color-text-muted)' }}>Send alert X days before the cheque date.</small>
                                </div>
                            )}
                        </div>

                        <hr style={{ borderColor: 'var(--color-border)' }} />

                        <div className="form-check form-switch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label className="form-check-label" htmlFor="notifyBounced" style={{ fontWeight: '500' }}>Notify on Cheque Bounce / Return</label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="notifyBounced"
                                name="notifyBounced"
                                checked={config.notifyBounced}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Recipients */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Alert Recipients
                    </h3>

                    <div className="form-group">
                        <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={16} /> Email Addresses
                        </label>
                        <textarea
                            name="alertRecipients"
                            className="form-control"
                            rows="3"
                            value={config.alertRecipients || ''}
                            onChange={handleChange}
                            placeholder="admin@company.com, finance@company.com"
                        />
                        <small style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', display: 'block' }}>
                            Enter comma-separated email addresses to receive alerts.
                        </small>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                        <Save size={20} /> {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AlertConfigForm;
