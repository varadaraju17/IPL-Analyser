import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign } from 'lucide-react';
import playersData from '../../data/players.json'; // Go up two levels
import './MarketMovers.css';

const MarketMovers = () => {
    // Parse price string "₹25,00,00,000" -> number
    const parsePrice = (priceStr) => {
        if (!priceStr || priceStr === "Retained" || priceStr === "User Given") return 0;
        return parseInt(priceStr.replace(/[₹,]/g, ''), 10);
    };

    const topBuys = playersData
        .filter(p => p.price !== "Retained" && p.price !== "User Given")
        .sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        .slice(0, 4);

    return (
        <div className="market-movers-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="gradient-text">Top Auction Buys</h2>
                    <p className="section-subtitle">Most expensive signings of IPL 2026</p>
                </motion.div>

                <div className="movers-grid">
                    {topBuys.map((player, index) => (
                        <motion.div
                            key={player.id}
                            className="mover-card glass-panel"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="rank-badge">#{index + 1}</div>
                            <div className="mover-info">
                                <h3>{player.name}</h3>
                                <p className="mover-role">{player.role}</p>
                            </div>
                            <div className="mover-price">
                                <DollarSign size={16} />
                                {player.price}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketMovers;
