import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Sidebar = () => {
    const { user } = useAuth(); // Assuming we might check roles here later

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span>CMS App</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">📊</span>
                    Dashboard
                </NavLink>
                <NavLink to="/companies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🏢</span>
                    Companies
                </NavLink>
                <NavLink to="/vendors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🏪</span>
                    Vendors
                </NavLink>
                <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">👥</span>
                    Customers
                </NavLink>
                <NavLink to="/banks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🏦</span>
                    Banks
                </NavLink>
                <NavLink to="/accounts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">💰</span>
                    Accounts
                </NavLink>
                <NavLink to="/cheque-books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">💳</span>
                    Cheques
                </NavLink>
                <NavLink to="/incoming-cheques" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">📥</span>
                    In-Cheques
                </NavLink>
                <NavLink to="/pdc" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">📅</span>
                    PDC
                </NavLink>
                <NavLink to="/cheque-printing" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🖨️</span>
                    Printing
                </NavLink>
                <NavLink to="/templates" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">📝</span>
                    Templates
                </NavLink>
                <NavLink to="/notifications" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🔔</span>
                    Alerts
                </NavLink>
                <NavLink to="/notifications/config" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">⚙️</span>
                    Config
                </NavLink>
                <NavLink to="/approvals" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">✅</span>
                    Approvals
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">📈</span>
                    Reports
                </NavLink>
                <NavLink to="/audit" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">🛡️</span>
                    Audit Log
                </NavLink>
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                    &copy; 2026 CMS
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
