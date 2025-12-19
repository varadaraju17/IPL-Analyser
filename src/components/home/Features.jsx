import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, Users } from 'lucide-react';
import './Features.css';

const features = [
    {
        icon: <Zap size={32} color="#00f3ff" />,
        title: "Real-Time Updates",
        desc: "Live auction data and squad changes as they happen."
    },
    {
        icon: <TrendingUp size={32} color="#bc13fe" />,
        title: "Deep Analytics",
        desc: "Advanced metrics for every T20 player globally."
    },
    {
        icon: <Shield size={32} color="#ffd700" />,
        title: "Official Data",
        desc: "Verified stats directly from IPL and ICC sources."
    },
    {
        icon: <Users size={32} color="#00ff9d" />,
        title: "Squad Comparison",
        desc: "Compare team strengths and weaknesses instantly."
    }
];

const Features = () => {
    return (
        <section className="container features-section">
            <div className="section-header">
                <h2 className="gradient-text">Why Use IPL Analyser?</h2>
                <p>The ultimate tool for cricket enthusiasts and analysts.</p>
            </div>

            <div className="features-grid">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        className="feature-card glass-panel"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -10 }}
                    >
                        <div className="feature-icon-wrapper">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Features;
