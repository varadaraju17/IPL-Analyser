import React from 'react';
import { motion } from 'framer-motion';
import teamsData from '../../data/teams.json';
import './LogoMarquee.css';

const LogoMarquee = () => {
    // Duplicate list for seamless loop
    const marqueeTeams = [...teamsData, ...teamsData];

    return (
        <div className="marquee-container">
            <div className="gradient-overlay left" />
            <motion.div
                className="track"
                animate={{ x: [0, -2000] }}
                transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear"
                }}
            >
                {marqueeTeams.map((team, index) => (
                    <div key={`${team.id}-${index}`} className="marquee-logo-item">
                        <img src={team.logo} alt={team.name} className="marquee-logo" />
                    </div>
                ))}
            </motion.div>
            <div className="gradient-overlay right" />
        </div>
    );
};

export default LogoMarquee;
