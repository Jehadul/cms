import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../styles/layout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                <main className="content-area">
                    <div className="container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
