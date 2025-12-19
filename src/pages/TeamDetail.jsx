import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, Users, ClipboardList } from 'lucide-react';
import teamsData from '../data/teams.json';
import playersData from '../data/players.json';
import PlayerCard from '../components/players/PlayerCard';
import LineupManager from '../components/teams/LineupManager';
import './TeamDetail.css';

const TeamDetail = () => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [viewMode, setViewMode] = useState('squad'); // 'squad' | 'builder'
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => {
        const foundTeam = teamsData.find(t => t.id === id);
        if (foundTeam) {
            setTeam(foundTeam);
            const teamPlayers = playersData.filter(p => p.teamId === id);
            setPlayers(teamPlayers);
        }
    }, [id]);

    if (!team) return <div className="container loading-text">Loading Team Data...</div>;

    const filteredPlayers = filterRole === 'All'
        ? players
        : players.filter(p => {
            const r = p.role.toLowerCase();
            if (filterRole === 'Batter') return r.includes('batter') && !r.includes('keeper');
            if (filterRole === 'Bowler') return r.includes('bowler') && !r.includes('all');
            if (filterRole === 'Allrounder') return r.includes('all');
            if (filterRole === 'Wicketkeeper') return r.includes('keeper');
            return false;
        });

    const roles = ['All', 'Batter', 'Bowler', 'Allrounder', 'Wicketkeeper'];

    return (
        <div className="team-detail-page">
            <div className="team-banner" style={{ background: `linear-gradient(to right, ${team.primaryColor}22, ${team.secondaryColor}22)` }}>
                <div className="container banner-content">
                    <Link to="/teams" className="back-link"><ArrowLeft size={20} /> Back to Teams</Link>

                    <div className="banner-main">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={team.logo}
                            alt={team.name}
                            className="big-team-logo"
                        />
                        <div className="banner-info">
                            <motion.h1
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="banner-title"
                            >
                                {team.name}
                            </motion.h1>
                            <div className="banner-meta">
                                <span>Captain: <strong>{team.captain}</strong></span>
                                <span className="dot">•</span>
                                <span>Home: <strong>{team.homeGround}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container squad-section">
                {/* View Switcher */}
                <div className="view-switcher">
                    <button
                        className={`view-btn ${viewMode === 'squad' ? 'active' : ''}`}
                        onClick={() => setViewMode('squad')}
                    >
                        <Users size={18} /> Analyse Squad
                    </button>
                    <button
                        className={`view-btn ${viewMode === 'builder' ? 'active' : ''}`}
                        onClick={() => setViewMode('builder')}
                    >
                        <ClipboardList size={18} /> Playing 11 Builder
                    </button>
                </div>

                {viewMode === 'squad' ? (
                    <>
                        <div className="controls-bar glass-panel">
                            <div className="filter-label"><Filter size={16} /> Filter Squad:</div>
                            <div className="filter-options">
                                {roles.map(role => (
                                    <button
                                        key={role}
                                        className={`filter-btn ${filterRole === role ? 'active' : ''}`}
                                        onClick={() => setFilterRole(role)}
                                        style={filterRole === role ? { backgroundColor: team.primaryColor, color: '#000' } : {}}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.div layout className="players-grid">
                            {filteredPlayers.length > 0 ? (
                                filteredPlayers.map(player => (
                                    <PlayerCard key={player.id} player={player} teamColor={team.primaryColor} />
                                ))
                            ) : (
                                <div className="no-players">No players found for this category yet.</div>
                            )}
                        </motion.div>
                    </>
                ) : (
                    <LineupManager teamId={team.id} allPlayers={players} />
                )}
            </div>
        </div>
    );
};

export default TeamDetail;
