
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaHome, FaUsers, FaGavel } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/teams', label: 'Teams', icon: <FaUsers /> },
    { path: '/auction', label: 'Auction', icon: <FaGavel /> },
  ];

  return (
    <nav className="navbar-container">
      <div className="navbar-glass">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">IPL<span className="text-neon-blue">2026</span></span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
              {location.pathname === link.path && <div className="nav-glow-bar" />}
            </Link>
          ))}
        </div>

        {/* SEARCH WIDGET */}
        <div className="navbar-search">
          <div className={`search-wrapper ${searchOpen ? 'open' : ''}`}>
            <FaSearch className="search-icon" onClick={() => setSearchOpen(!searchOpen)} />
            <input
              type="text"
              placeholder="Search Player..."
              className="search-input"
              onBlur={() => !searchOpen && setSearchOpen(false)} // simple close logic
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
