
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Shield, Zap, Target, Activity } from 'lucide-react';
import './PlayerCard.css';

const PlayerCard = ({ player, teamColor }) => {
    const isIndian = player.country === 'India';

    // --- SMART CATEGORY LOGIC ---
    const getDetailedCategory = () => {
        const r = (player.role || "").toLowerCase();
        const b = (player.bowlingStyle || "").toLowerCase();

        // 1. Wicketkeepers
        if (r.includes("wicket")) return "Wicketkeeper Batter";

        // 2. Allrounders
        if (r.includes("allrounder") || r.includes("all")) {
            if (b.includes("fast") || b.includes("medium") || b.includes("pace")) return "Pace Bowling Allrounder";
            if (b.includes("spin") || b.includes("break") || b.includes("orthodox")) return "Spin Bowling Allrounder";
            return "Allrounder";
        }

        // 3. Bowlers
        if (r.includes("bowler")) {
            if (b.includes("fast") || b.includes("medium") || b.includes("pace")) return "Pacer";
            if (b.includes("spin") || b.includes("break") || b.includes("orthodox")) return "Spinner";
            return "Bowler";
        }

        // 4. Batters
        if (r.includes("batter") || r.includes("batsman")) {
            if (r.includes("top") || r.includes("open")) return "Top Order Batter";
            if (r.includes("middle")) return "Middle Order Batter";
            return "Batter";
        }

        return player.role || "Player";
    };

    const detailedCategory = getDetailedCategory();

    const getRoleIcon = () => {
        const cat = detailedCategory.toLowerCase();
        if (cat.includes('wk')) return <Shield size={14} />;
        if (cat.includes('all')) return <Zap size={14} />;
        if (cat.includes('pacer') || cat.includes('spinner')) return <Target size={14} />;
        return <Activity size={14} />;
    };

    return (
        <Link to={`/player/${player.id}`} className="player-card-link">
            <motion.div
                className="player-card"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    '--card-accent': isIndian ? '#ff9933' : '#ff0055',
                    '--card-glow': isIndian ? 'rgba(255, 153, 51, 0.4)' : 'rgba(255, 0, 85, 0.4)'
                }}
            >
                {/* DECORATIVE HOLOGRAPHIC BORDERS */}
                <div className="card-border-glow" />
                <div className="card-corner-accent top-left" />
                <div className="card-corner-accent bottom-right" />
                <div className="card-bg-gradient" />

                {/* HEADER - COUNTRY BADGE (ID Removed) */}
                <div className="player-badge-top">
                    {isIndian ? <span className="p-badge ind">🇮🇳 INDIA</span> : <span className="p-badge intl">✈️ OVERSEAS</span>}
                </div>

                {/* IMAGE AREA */}
                <div className="player-image-container">
                    <div className="image-halo" />
                    {player.image ? (
                        <div className="hex-image-wrapper">
                            <img src={player.image} alt={player.name} className="player-img-std" />
                        </div>
                    ) : (
                        <div className="image-placeholder"><User size={40} /></div>
                    )}
                </div>

                {/* CONTENT AREA */}
                <div className="player-content-std">

                    <div className="player-header-std">
                        <h2 className="player-name-std">{player.name}</h2>
                        <div className="role-pill-std" style={{ color: 'var(--card-accent)', borderColor: 'var(--card-accent)' }}>
                            {getRoleIcon()} {detailedCategory}
                        </div>
                    </div>

                    {/* DETAILED STATS GRID */}
                    <div className="player-details-box">
                        <div className="detail-row">
                            <span className="d-label">BATTING</span>
                            <span className="d-value">{player.battingStyle || "Right Hand Bat"}</span>
                        </div>
                        <div className="detail-divider"></div>
                        <div className="detail-row">
                            <span className="d-label">BOWLING</span>
                            <span className="d-value">{player.bowlingStyle && player.bowlingStyle !== '-' ? player.bowlingStyle : "None"}</span>
                        </div>
                    </div>

                    {/* PRICE FOOTER */}
                    <div className="price-container-std">
                        <div className="price-label-row">
                            <span className="lbl">AUCTION PRICE</span>
                            <span className="lbl-age">AGE: {player.age}</span>
                        </div>
                        <div className="price-bar-track">
                            <div className="price-bar-fill"></div>
                        </div>
                        <div className="price-val-row">
                            <span className="val">{player.price || "Retained"}</span>
                        </div>
                    </div>

                </div>
            </motion.div>
        </Link>
    );
};

export default PlayerCard;
