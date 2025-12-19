import React, { useState } from 'react';
import { motion } from 'framer-motion';
import teamsData from '../data/teams.json';
import TeamCard from '../components/teams/TeamCard';
import CompareTeamsLineups from '../components/teams/CompareTeamsLineups';
import GlobalLineupView from '../components/teams/GlobalLineupView';
import './Teams.css';

const Teams = () => {
    const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'compare'
    return (
        <div style={{ paddingBottom: '60px', width: '100%' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-text neon-text"
                    style={{ fontSize: '3rem', marginBottom: '16px' }}
                >
                    IPL TEAMS 2026
                </motion.h1>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '1.2rem' }}>
                    Explore squads, analytics, and performance metrics for all 10 franchises.
                </p>
            </header>

            {/* Navigation Tabs */}
            <div className="teams-tabs-nav">
                <button
                    className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('grid')}
                >
                    All Teams
                </button>
                <button
                    className={`tab-btn ${activeTab === 'lineups' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lineups')}
                >
                    All Current Lineups
                </button>
                <button
                    className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
                    onClick={() => setActiveTab('compare')}
                >
                    Compare Lineups
                </button>
            </div>

            {activeTab === 'grid' && (
                <div className="teams-grid-container">
                    {teamsData.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TeamCard team={team} />
                        </motion.div>
                    ))}
                </div>
            )}

            {activeTab === 'lineups' && (
                <GlobalLineupView />
            )}

            {activeTab === 'compare' && (
                <CompareTeamsLineups />
            )}
        </div>
    );
};

export default Teams;
