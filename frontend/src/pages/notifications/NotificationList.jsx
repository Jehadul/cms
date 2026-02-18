import React, { useEffect, useState } from 'react';
import { getNotifications, markAsRead } from '../../api/notificationApi';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Optional: Polling every minute
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            // Hardcoded companyId for demo
            const data = await getNotifications(1);
            setNotifications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id) => {
        try {
            await markAsRead(id);
            // Update local state to reflect read status
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading Notifications...</div>;

    return (
        <div className="card">
            <h3>Notifications</h3>
            {notifications.length === 0 ? (
                <p>No new notifications.</p>
            ) : (
                <ul className="list-group">
                    {notifications.map(n => (
                        <li key={n.id} className={`list-group-item ${n.read ? 'read' : 'unread'}`} style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--color-border)',
                            backgroundColor: n.read ? 'transparent' : 'rgba(var(--color-primary-rgb), 0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{n.title}</strong>
                                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                            </div>
                            <p style={{ margin: '0.5rem 0' }}>{n.message}</p>
                            {!n.read && (
                                <button onClick={() => handleRead(n.id)} className="btn btn-sm btn-link">Mark as Read</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationList;
