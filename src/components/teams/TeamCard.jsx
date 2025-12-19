
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Users, ChevronRight } from 'lucide-react';
import './TeamCard.css';

const TeamCard = ({ team }) => {
    // Generate a "capacity" visual based on squat count (e.g. max 25)
    // Random "power" metric for visual flair if not available
    const powerLevel = Math.min(team.squadSize ? (team.squadSize / 25) * 100 : 85, 100);

    return (
        <Link to={`/teams/${team.id}`} className="team-card-link">
            <motion.div
                className="team-card"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ '--team-color': team.primaryColor, '--team-sec-color': team.secondaryColor || '#fff' }}
            >
                {/* DECORATIVE HOLOGRAPHIC BORDERS */}
                <div className="card-border-glow" />
                <div className="card-corner-accent top-left" />
                <div className="card-corner-accent bottom-right" />

                <div className="card-bg-gradient" />

                <div className="team-logo-container">
                    <div className="logo-halo" />
                    {team.logo ? (
                        <img src={team.logo} alt={team.name} className="team-logo" />
                    ) : (
                        <div className="logo-placeholder">{team.shortName}</div>
                    )}
                </div>

                <div className="team-content">
                    <div className="team-header">
                        <h2 className="team-name">{team.name}</h2>
                        <span className="team-code">{team.shortName}</span>
                    </div>

                    <div className="team-metrics">
                        <div className="metric-row">
                            <div className="metric-icon"><Trophy size={16} /></div>
                            <span className="metric-label">Titles</span>
                            <span className="metric-value text-neon-gold">{team.titles.length}</span>
                        </div>
                        <div className="metric-row">
                            <div className="metric-icon"><Users size={16} /></div>
                            <span className="metric-label">Squad</span>
                            <span className="metric-value">{team.squadSize || 25}</span>
                        </div>
                    </div>

                    {/* SQUAD CAPACITY VISUALIZER */}
                    <div className="capacity-meter-container">
                        <div className="meter-label">
                            <span>PWR</span>
                            <span>{Math.round(powerLevel)}%</span>
                        </div>
                        <div className="meter-track">
                            <motion.div
                                className="meter-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${powerLevel}%` }}
                                transition={{ delay: 0.2, duration: 1 }}
                            />
                        </div>
                    </div>

                    <div className="card-action-btn">
                        <span>ANALYZE</span>
                        <ChevronRight size={16} />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default TeamCard;
