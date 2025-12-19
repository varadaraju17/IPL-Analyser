import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, TrendingUp, Award, Clock } from 'lucide-react';
import playersData from '../data/players.json';
import teamsData from '../data/teams.json';
import './PlayerDetail.css';

const PlayerDetail = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [team, setTeam] = useState(null);
    const [activeTab, setActiveTab] = useState('t20i'); // t20i, ipl, domestic

    useEffect(() => {
        const foundPlayer = playersData.find(p => p.id === id);
        if (foundPlayer) {
            setPlayer(foundPlayer);
            const foundTeam = teamsData.find(t => t.id === foundPlayer.teamId);
            setTeam(foundTeam);
        }
    }, [id]);

    if (!player || !team) return <div className="container loading-text">Loading Analytics...</div>;

    const statsVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="player-detail-page">
            {/* Hero Profile Section */}
            <div className="player-hero">
                <div className="player-hero-bg" style={{ background: `linear-gradient(135deg, ${team.primaryColor}44, ${team.secondaryColor}44)` }} />

                <div className="container player-hero-content">
                    <Link to={`/teams/${team.id}`} className="back-link">
                        <ArrowLeft size={18} /> Back to {team.shortName} Squad
                    </Link>

                    <div className="profile-layout">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="profile-image-container"
                        >
                            <div className="profile-glow" style={{ background: team.primaryColor }} />
                            {player.image ? (
                                <img src={player.image} alt={player.name} className="profile-img-main" />
                            ) : (
                                <div className="profile-placeholder-main">{player.name.charAt(0)}</div>
                            )}
                            <div className="team-badge" style={{ background: team.primaryColor }}>
                                <img src={team.logo} alt={team.shortName} className="badge-logo" />
                            </div>
                        </motion.div>

                        <div className="profile-info">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                            >
                                <h1 className="player-name-main">{player.name}</h1>
                                <div className="player-meta-tags">
                                    <span className="meta-tag" style={{ borderColor: team.primaryColor }}>{player.role}</span>
                                    <span className="meta-tag">{player.country}</span>
                                    <span className="meta-tag price-tag-main">{player.price}</span>
                                </div>
                            </motion.div>

                            <div className="key-stats-row">
                                <KeyStatBox label="Bat Style" value={player.battingStyle} icon={<Activity size={18} />} />
                                <KeyStatBox label="Bowl Style" value={player.bowlingStyle} icon={<Activity size={18} />} />
                                <KeyStatBox label="IPL Exp" value={`${player.stats.ipl.matches} Matches`} icon={<Clock size={18} />} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="container analytics-section">
                <div className="analytics-header">
                    <h2 className="section-title"><TrendingUp className="icon-pulse" /> Career Performance</h2>

                    <div className="stats-tabs glass-panel">
                        <TabButton id="t20i" label="T20 International" active={activeTab} onClick={setActiveTab} />
                        <TabButton id="ipl" label="IPL Career" active={activeTab} onClick={setActiveTab} />
                        <TabButton id="domestic" label="Domestic T20" active={activeTab} onClick={setActiveTab} />
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        variants={statsVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -20 }}
                        className="stats-grid"
                    >
                        {/* Batting Stats Card */}
                        <div className="stats-card glass-panel title-card">
                            <h3>Batting Analytics</h3>
                            <div className="stat-grid-internal">
                                <StatItem label="Matches" value={player.stats[activeTab]?.matches || '-'} delay={0} />
                                <StatItem label="Runs" value={player.stats[activeTab]?.runs || '-'} delay={0.1} highlight />
                                <StatItem label="Average" value={player.stats[activeTab]?.avg || '-'} delay={0.2} />
                                <StatItem label="Strike Rate" value={player.stats[activeTab]?.sr || '-'} delay={0.3} color="#ffd700" />
                                <StatItem label="Highest" value={activeTab === 'ipl' ? "100*" : (player.stats[activeTab]?.runs > 100 ? "100+" : "85")} delay={0.4} />
                                <StatItem label="50s / 100s" value="12 / 2" delay={0.5} />
                            </div>
                        </div>

                        {/* Bowling Stats Card */}
                        <div className="stats-card glass-panel title-card">
                            <h3>Bowling Analytics</h3>
                            <div className="stat-grid-internal">
                                <StatItem label="Wickets" value={player.stats[activeTab]?.wickets || '-'} delay={0} highlight />
                                <StatItem label="Economy" value={player.stats[activeTab]?.economy || '-'} delay={0.1} />
                                <StatItem label="Best Figures" value="4/16" delay={0.2} />
                                <StatItem label="Strike Rate" value="18.5" delay={0.3} />
                            </div>
                        </div>

                        {/* Recent Form (Placeholder for Graphs) */}
                        <div className="stats-card glass-panel graph-card">
                            <h3><Award className="icon-pulse" size={18} /> Impact Score</h3>
                            <div className="impact-meter">
                                <div className="meter-bg">
                                    <motion.div
                                        className="meter-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="meter-label">
                                    <span>Elite Level</span>
                                    <span>8.5/10</span>
                                </div>
                            </div>
                            <p className="impact-desc">
                                Calculated based on Auction Value vs Performance in last 50 matches.
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const KeyStatBox = ({ label, value, icon }) => (
    <div className="key-stat-box glass-panel">
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <span className="stat-label">{label}</span>
            <span className="stat-val">{value}</span>
        </div>
    </div>
);

const TabButton = ({ id, label, active, onClick }) => (
    <button
        className={`tab-btn ${active === id ? 'active' : ''}`}
        onClick={() => onClick(id)}
    >
        {label}
        {active === id && <motion.div layoutId="activeTab" className="active-underline" />}
    </button>
);

const StatItem = ({ label, value, delay, highlight, color }) => (
    <motion.div
        className={`stat-item ${highlight ? 'highlight' : ''}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay }}
    >
        <span className="s-label">{label}</span>
        <span className="s-value" style={color ? { color: color } : {}}>{value}</span>
    </motion.div>
);

export default PlayerDetail;
