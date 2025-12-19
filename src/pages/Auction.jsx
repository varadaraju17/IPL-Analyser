import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import playersData from '../data/players.json';
import teamsData from '../data/teams.json';
import './Auction.css';

const Auction = () => {
    // Top 5 most expensive players (mock logic based on string price)
    // In a real app, price should be integer. Here we filter manually for the demo.
    const topBuys = playersData
        .filter(p => p.price.includes('Cr') && !p.price.includes('Retained'))
        .sort((a, b) => parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, '')))
        .slice(0, 3);

    return (
        <div className="container auction-page">
            <header className="auction-header">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="gradient-text neon-text"
                >
                    IPL 2026 AUCTION INSIGHTS
                </motion.h1>
                <p>Analysis of the record-breaking spending spree.</p>
            </header>

            <div className="auction-grid">
                {/* Top Buys Section */}
                <section className="auction-section top-buys">
                    <h2><DollarSign className="icon-gold" /> Top Buys</h2>
                    <div className="top-buys-list">
                        {topBuys.map((player, index) => {
                            const team = teamsData.find(t => t.id === player.teamId);
                            return (
                                <motion.div
                                    key={player.id}
                                    className="buy-card glass-panel"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <div className="rank">#{index + 1}</div>
                                    <img src={team?.logo} alt={team?.shortName} className="team-logo-small" />
                                    <div className="buy-info">
                                        <h3>{player.name}</h3>
                                        <span className="price-highlight">{player.price}</span>
                                    </div>
                                    <div className="role-badge">{player.role}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Team Spend Analysis (Mock Visuals) */}
                <section className="auction-section spend-analysis">
                    <h2><Briefcase className="icon-cyan" /> Purse Remaining</h2>
                    <div className="purse-grid">
                        {teamsData.slice(0, 5).map((team, index) => (
                            <div key={team.id} className="purse-row">
                                <div className="team-name-row">
                                    <img src={team.logo} alt={team.shortName} className="tiny-logo" />
                                    <span>{team.shortName}</span>
                                </div>
                                <div className="progress-bar-container">
                                    <motion.div
                                        className="progress-bar"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.random() * 40 + 10}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        style={{ background: team.primaryColor }}
                                    />
                                </div>
                                <span className="purse-val">₹{Math.floor(Math.random() * 5) + 1}.5 Cr</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Auction;
