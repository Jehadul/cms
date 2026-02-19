import React, { useEffect, useState } from 'react';
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import {
    Send, Download, Clock, AlertTriangle,
    PlusCircle, FileText, Printer, ChevronRight,
    TrendingUp, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load dashboard stats", error);
            // Fallback for demo if API fails
            setStats({
                totalIssuedCount: 0,
                totalIssuedAmount: 0,
                totalReceivedCount: 0,
                totalReceivedAmount: 0,
                bouncedCount: 0,
                pendingApprovalCount: 0,
                chequesDueToday: 0,
                incomingDueToday: 0,
                recentActivity: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const StatCard = ({ title, value, subValue, icon: Icon, color, bgColor }) => (
        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
            <div className="card-body p-3">
                <div className="d-flex align-items-center mb-2">
                    <div style={{
                        backgroundColor: bgColor,
                        width: '36px', height: '36px',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: color,
                        marginRight: '0.75rem'
                    }}>
                        <Icon size={18} />
                    </div>
                    <h5 className="text-muted mb-0" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{title}</h5>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                    <h3 className="mb-0" style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.4rem' }}>{value}</h3>
                    {subValue && <span className="badge bg-light text-dark" style={{ fontSize: '0.75rem' }}>{subValue}</span>}
                </div>
            </div>
        </div>
    );

    const QuickAction = ({ to, icon: Icon, label, color }) => (
        <Link to={to} className="text-decoration-none">
            <div className="card border-0 shadow-sm h-100 hover-card" style={{ borderRadius: '10px', transition: 'transform 0.2s' }}>
                <div className="card-body p-2 d-flex flex-column align-items-center justify-content-center text-center gap-1">
                    <div style={{ color: color, marginBottom: '0.15rem' }}>
                        <Icon size={22} />
                    </div>
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>{label}</span>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                        Good Morning, {user?.username || 'User'} 👋
                    </h2>
                    <p className="text-muted mb-0">Here's what's happening with your finances today.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <StatCard
                        title="Cheques Issued"
                        value={stats.totalIssuedAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        subValue={`${stats.totalIssuedCount} cheques`}
                        icon={ArrowUpRight}
                        color="#2563eb"
                        bgColor="#eff6ff"
                    />
                </div>
                <div className="col-md-3">
                    <StatCard
                        title="Cheques Received"
                        value={stats.totalReceivedAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        subValue={`${stats.totalReceivedCount} cheques`}
                        icon={ArrowDownLeft}
                        color="#16a34a"
                        bgColor="#f0fdf4"
                    />
                </div>
                <div className="col-md-3">
                    <StatCard
                        title="Pending Approvals"
                        value={stats.pendingApprovalCount}
                        icon={Clock}
                        color="#ea580c"
                        bgColor="#fff7ed"
                    />
                </div>
                <div className="col-md-3">
                    <StatCard
                        title="Attention Needed"
                        value={stats.bouncedCount + stats.chequesDueToday + stats.incomingDueToday}
                        subValue="Due / Bounced"
                        icon={AlertTriangle}
                        color="#dc2626"
                        bgColor="#fef2f2"
                    />
                </div>
            </div>

            <div className="row g-4">
                {/* Main Content Column */}
                <div className="col-lg-8">
                    {/* Quick Actions */}
                    <div className="mb-4">
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>Quick Actions</h4>
                        <div className="row g-3">
                            <div className="col-md-3 col-6">
                                <QuickAction to="/cheque-books/add" icon={PlusCircle} label="New Cheque Book" color="#4f46e5" />
                            </div>
                            <div className="col-md-3 col-6">
                                <QuickAction to="/incoming-cheques/add" icon={ArrowDownLeft} label="Deposit Cheque" color="#059669" />
                            </div>
                            <div className="col-md-3 col-6">
                                <QuickAction to="/cheque-printing" icon={Printer} label="Print Cheque" color="#0891b2" />
                            </div>
                            <div className="col-md-3 col-6">
                                <QuickAction to="/reports" icon={FileText} label="View Reports" color="#ca8a04" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>Recent Activity</h5>
                            <Link to="/reports" className="text-decoration-none" style={{ fontSize: '0.9rem', fontWeight: 600 }}>View All</Link>
                        </div>
                        <div className="card-body p-0">
                            {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="list-group-item py-3 px-4 d-flex align-items-center justify-content-between border-light">
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '50%',
                                                    backgroundColor: activity.type === 'INCOMING' ? '#f0fdf4' : '#eff6ff',
                                                    color: activity.type === 'INCOMING' ? '#16a34a' : '#2563eb',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {activity.type === 'INCOMING' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{activity.description}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{activity.date} • {activity.status}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 700, color: activity.type === 'INCOMING' ? '#16a34a' : '#1e293b' }}>
                                                {activity.type === 'INCOMING' ? '+' : '-'}{activity.amount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted">No recent activity found.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="col-lg-4">
                    {/* Alerts / Due Today */}
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: 'white' }}>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <Clock size={20} className="text-white-50" />
                                <h5 className="mb-0" style={{ fontWeight: 600 }}>Due Today</h5>
                            </div>

                            <div className="d-flex justify-content-between align-items-end mb-2">
                                <div>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Outgoing Cheques</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.chequesDueToday}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Incoming Deposits</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.incomingDueToday}</div>
                                </div>
                            </div>

                            {(stats.chequesDueToday > 0 || stats.incomingDueToday > 0) && (
                                <Link to="/pdc" className="btn btn-light btn-sm w-100 mt-3" style={{ fontWeight: 600, color: '#4f46e5' }}>
                                    Review Due Items
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Help / Support Link */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                        <div className="card-body p-4 text-center">
                            <h6 style={{ fontWeight: 700, color: '#334155' }}>Need Help?</h6>
                            <p className="text-muted small mb-3">Check our documentation or contact support.</p>
                            <button className="btn btn-outline-primary btn-sm rounded-pill px-4">Get Support</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-card:hover { transform: translateY(-3px); cursor: pointer; }
            `}</style>
        </div>
    );
};

export default Dashboard;
