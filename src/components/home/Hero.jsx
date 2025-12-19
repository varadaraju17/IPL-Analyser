import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Zap } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            {/* 3D TUNNEL EFFECT */}
            <div className="hero-tunnel-container">
                <div className="tunnel-ring ring-1" />
                <div className="tunnel-ring ring-2" />
                <div className="tunnel-ring ring-3" />
                <div className="tunnel-grid" />
            </div>


            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.68, -0.55, 0.265, 1.55] }}
                    className="hero-badge"
                >
                    <span className="live-dot" /> LIVE SEASON 2026
                </motion.div>

                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    THE ULTIMATE <br />
                    <span className="neon-cyan">CRICKET ARENA</span>
                </motion.h1>

                <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Analyze the 2026 Squads with Next-Gen Stats, Advanced Auction Metrics, and Real-time Team Power Levels.
                </motion.p>

                <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link to="/teams">
                        <button className="cyber-btn primary">
                            <span className="btn-content">EXPLORE SQUADS <Zap size={18} /></span>
                            <span className="glitch-effect"></span>
                        </button>
                    </Link>
                    <Link to="/auction">
                        <button className="cyber-btn secondary">
                            <span className="btn-content">AUCTION DATA <Trophy size={18} /></span>
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
