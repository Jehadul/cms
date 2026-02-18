import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">Cheque Management System</div>
                <div className="nav-user">
                    <span>Welcome, {user?.username}</span>
                    <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                </div>
            </nav>
            <main className="dashboard-content">
                <div className="container">
                    <h1>Dashboard</h1>
                    <div className="stats-grid">
                        <div className="card stat-card">
                            <h3>Pending Approvals</h3>
                            <p className="stat-value">12</p>
                        </div>
                        <div className="card stat-card">
                            <h3>Cheques Issued</h3>
                            <p className="stat-value">45</p>
                        </div>
                        <div className="card stat-card">
                            <h3>Total Amount</h3>
                            <p className="stat-value">$1,250,000</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
