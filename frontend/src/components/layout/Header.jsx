import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { currentTheme, setCurrentTheme, themes } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="top-header">
            <div className="header-left">
                {/* Could add breadcrumbs or page title here */}
                <h3>Welcome, {user ? user.username : 'Guest'}</h3>
            </div>
            <div className="header-right">
                <div className="theme-selector">
                    {Object.keys(themes).map((themeName) => (
                        <div
                            key={themeName}
                            className={`theme-btn ${currentTheme === themeName ? 'active' : ''}`}
                            style={{ backgroundColor: themes[themeName]['--color-primary'] }}
                            onClick={() => setCurrentTheme(themeName)}
                            title={`${themeName} theme`}
                        />
                    ))}
                </div>
                <div className="user-profile">
                    <div className="avatar">
                        {user ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <button onClick={handleLogout} className="btn btn-sm" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
