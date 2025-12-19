import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CinematicBackground from './CinematicBackground';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout-wrapper relative min-h-screen">
            <CinematicBackground />
            <Navbar />
            <main className="content-container relative z-10 pt-20">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
