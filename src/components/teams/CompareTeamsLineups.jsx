import React, { useState, useEffect } from 'react';
import teamsData from '../../data/teams.json';
import playersData from '../../data/players.json';
import { getLineups, getLineup } from '../../utils/lineupStorage';
import './CompareTeamsLineups.css';

const CompareTeamsLineups = () => {
    const [teamAId, setTeamAId] = useState('');
    const [teamBId, setTeamBId] = useState('');
    const [lineupsA, setLineupsA] = useState({});
    const [lineupsB, setLineupsB] = useState({});
    const [selectedA, setSelectedA] = useState('');
    const [selectedB, setSelectedB] = useState('');

    // Load lineups when team changes
    useEffect(() => {
        if (teamAId) setLineupsA(getLineups(teamAId));
        else setLineupsA({});
    }, [teamAId]);

    useEffect(() => {
        if (teamBId) setLineupsB(getLineups(teamBId));
        else setLineupsB({});
    }, [teamBId]);

    const renderComparison = () => {
        if (!selectedA || !selectedB) return <div className="empty-state">Select a lineup for each team to begin comparison.</div>;
        const dataA = getLineup(teamAId, selectedA);
        const dataB = getLineup(teamBId, selectedB);

        const getPlayerDetails = (id) => playersData.find(p => p.id === id) || { name: 'Unknown Player', role: 'N/A', image: '' };

        const renderSlot = (data, teamColor) => (
            <div className="compare-list">
                {data.xiIdx.map((pid, idx) => {
                    const player = getPlayerDetails(pid);
                    return (
                        <div key={idx} className="compare-row animated-entry" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <span className="idx">{idx + 1}</span>
                            <img src={player.image || 'https://via.placeholder.com/40'} alt={player.name} className="mini-avatar" />
                            <div className="p-info">
                                <span className="p-name">{player.name}</span>
                                <span className="p-role">{player.role}</span>
                            </div>
                        </div>
                    );
                })}
                {/* Impact Player */}
                <div className="compare-row impact-row">
                    <span className="idx">IP</span>
                    {data.impactIdx ? (
                        <>
                            <img src={getPlayerDetails(data.impactIdx).image} className="mini-avatar" />
                            <div className="p-info">
                                <span className="p-name">{getPlayerDetails(data.impactIdx).name}</span>
                                <span className="p-role">Impact Player</span>
                            </div>
                        </>
                    ) : (
                        <span className="no-impact">No Impact Player</span>
                    )}
                </div>
            </div>
        );

        return (
            <div className="compare-view">
                <div className="compare-column">
                    <h4 className="versus-team-title" style={{ color: teamsData.find(t => t.id === teamAId)?.primaryColor }}>
                        {teamsData.find(t => t.id === teamAId)?.name} <span className="lineup-tag">{selectedA}</span>
                    </h4>
                    {renderSlot(dataA)}
                </div>

                <div className="vs-divider">
                    <div className="vs-circle">VS</div>
                </div>

                <div className="compare-column">
                    <h4 className="versus-team-title" style={{ color: teamsData.find(t => t.id === teamBId)?.primaryColor }}>
                        {teamsData.find(t => t.id === teamBId)?.name} <span className="lineup-tag">{selectedB}</span>
                    </h4>
                    {renderSlot(dataB)}
                </div>
            </div>
        );
    };

    return (
        <div className="compare-teams-lineups">
            <h3>Compare Lineups Across Teams</h3>
            <div className="team-selectors">
                <div>
                    <label>Team A:</label>
                    <select value={teamAId} onChange={e => { setTeamAId(e.target.value); setSelectedA(''); }}>
                        <option value="">Select Team</option>
                        {teamsData.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Team B:</label>
                    <select value={teamBId} onChange={e => { setTeamBId(e.target.value); setSelectedB(''); }}>
                        <option value="">Select Team</option>
                        {teamsData.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {teamAId && teamBId && (
                <div className="lineup-selectors">
                    <div>
                        <label>{teamsData.find(t => t.id === teamAId)?.name} Lineup:</label>
                        <select value={selectedA} onChange={e => setSelectedA(e.target.value)}>
                            <option value="">Select Lineup</option>
                            {Object.keys(lineupsA).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>{teamsData.find(t => t.id === teamBId)?.name} Lineup:</label>
                        <select value={selectedB} onChange={e => setSelectedB(e.target.value)}>
                            <option value="">Select Lineup</option>
                            {Object.keys(lineupsB).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {teamAId && teamBId && renderComparison()}
        </div>
    );
};

export default CompareTeamsLineups;
