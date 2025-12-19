import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import teamsData from '../../data/teams.json';
import allPlayers from '../../data/players.json';
import './GlobalLineupView.css';

const GlobalLineupView = () => {
    const [allLineups, setAllLineups] = useState([]);

    useEffect(() => {
        const loaded = teamsData.map(team => {
            const savedData = localStorage.getItem(`playing11_${team.id}`);
            let xi = [];
            let impact = null;

            if (savedData) {
                try {
                    const { xiIdx, impactIdx } = JSON.parse(savedData);
                    xi = xiIdx.map(id => allPlayers.find(p => p.id === id)).filter(Boolean);
                    if (impactIdx) impact = allPlayers.find(p => p.id === impactIdx);
                } catch (e) {
                    console.error("Error parsing lineup for", team.id, e);
                }
            }
            return { team, xi, impact };
        });
        setAllLineups(loaded);
    }, []);

    return (
        <div className="global-lineup-container">
            <h2 className="section-title">ALL TEAMS - CURRENT PLAYING XI</h2>

            <div className="horizontal-scroll-track">
                {allLineups.map(({ team, xi, impact }) => (
                    <div key={team.id} className="team-lineup-card" style={{ '--team-color': team.primaryColor }}>
                        {/* HEADER */}
                        <div className="tl-header">
                            <div className="tl-logo-area">
                                {team.logo ? <img src={team.logo} alt={team.name} /> : <div className="tl-placeholder">{team.shortName}</div>}
                            </div>
                            <div className="tl-info">
                                <h3>{team.name}</h3>
                                <span className="tl-count">
                                    {xi.length}/11 Selected
                                    {xi.length < 11 && <AlertTriangle size={12} color="#ff3333" style={{ marginLeft: 6 }} />}
                                </span>
                            </div>
                        </div>

                        {/* LINEUP LIST */}
                        <div className="tl-list-area">
                            {xi.length === 0 ? (
                                <div className="tl-empty-state">No Lineup Set</div>
                            ) : (
                                xi.map((player, idx) => (
                                    <div key={player.id} className="tl-player-row">
                                        <span className="tl-num">{idx < 9 ? `0${idx + 1}` : idx + 1}</span>
                                        <img src={player.image || '/default_player.png'} alt="" className="tl-p-img" onError={(e) => e.target.src = '/default_player.png'} />
                                        <div className="tl-p-info">
                                            <span className="tl-p-name">{player.name}</span>
                                            <span className="tl-p-role">{player.role.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* IMPACT PLAYER */}
                        <div className="tl-impact-area">
                            <span className="imp-lbl"><Zap size={12} color="#ff00ff" /> IMPACT PLAYER</span>
                            {impact ? (
                                <div className="tl-imp-player">
                                    <img src={impact.image || '/default_player.png'} alt={impact.name} className="imp-av" onError={(e) => e.target.src = '/default_player.png'} />
                                    <span className="imp-name">{impact.name}</span>
                                </div>
                            ) : (
                                <span className="imp-none" style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic', marginLeft: 10 }}>None Selected</span>
                            )}
                        </div>

                        <Link to={`/teams/${team.id}`} className="tl-edit-btn">EDIT LINEUP</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlobalLineupView;
