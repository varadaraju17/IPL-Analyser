import React, { useState, useEffect } from 'react';
// Removed react-tabs imports; using custom tab implementation
import PlayingXIBuilder from './PlayingXIBuilder';
import { getLineups, saveLineup, deleteLineup, exportLineup, importLineup, getLineup } from '../../utils/lineupStorage';
import './LineupManager.css';
import { ShieldAlert, CheckCircle } from 'lucide-react'; // Using icon names directly for better error handling if lucide has them


const LineupManager = ({ teamId, allPlayers }) => {
    const [activeTab, setActiveTab] = useState('squad'); // 'squad' | 'current' | 'saved' | 'compare'
    const [lineupName, setLineupName] = useState('');
    const [savedLineups, setSavedLineups] = useState({});
    const [compareA, setCompareA] = useState('');
    const [compareB, setCompareB] = useState('');

    const [builderKey, setBuilderKey] = useState(0);

    // Load saved lineups on mount
    useEffect(() => {
        const data = getLineups(teamId);
        setSavedLineups(data);
    }, [teamId]);

    // Save current lineup
    const handleSave = () => {
        if (!lineupName.trim()) return alert('Please enter a name for the lineup');

        // Get current from localStorage as source of truth from PlayingXIBuilder
        const current = JSON.parse(localStorage.getItem(`playing11_${teamId}`) || '{}');

        // Validation
        if (!current.xiIdx || current.xiIdx.length !== 11) {
            return alert(`Lineup must have exactly 11 players! Currently selected: ${current.xiIdx?.length || 0}`);
        }

        saveLineup(teamId, lineupName, current);
        setSavedLineups(getLineups(teamId));
        setLineupName('');
        alert(`Lineup "${lineupName}" saved successfully!`);
    };

    const handleDelete = (name) => {
        if (window.confirm(`Delete lineup "${name}"?`)) {
            deleteLineup(teamId, name);
            setSavedLineups(getLineups(teamId));
        }
    };

    const handleExport = (name) => {
        const json = exportLineup(teamId, name);
        if (!json) return alert('Export failed');
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}_lineup.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const success = importLineup(teamId, ev.target.result);
            if (success) {
                setSavedLineups(getLineups(teamId));
                alert('Import successful');
            } else {
                alert('Import failed');
            }
        };
        reader.readAsText(file);
    };

    const renderSavedList = () => (
        <div className="saved-list">
            {Object.keys(savedLineups).length === 0 && <p>No saved lineups.</p>}
            {Object.entries(savedLineups).map(([name, data]) => (
                <div key={name} className="saved-item">
                    <span className="lineup-name">{name}</span>
                    <button onClick={() => {
                        // Load into current builder
                        localStorage.setItem(`playing11_${teamId}`, JSON.stringify(data));
                        setBuilderKey(prev => prev + 1); // Force re-mount to load new data
                        setActiveTab('squad');
                        alert(`Lineup "${name}" loaded into builder!`);
                    }}>Load</button>
                    <button onClick={() => handleDelete(name)}>Delete</button>
                    <button onClick={() => handleExport(name)}>Export</button>
                </div>
            ))}
        </div>
    );

    const renderCompare = () => {
        const aData = getLineup(teamId, compareA);
        const bData = getLineup(teamId, compareB);
        if (!aData || !bData) return <p>Select two lineups to compare.</p>;
        const renderSlot = (playerIds) => (
            <ul className="compare-slot">
                {playerIds.map((pid, idx) => {
                    const player = allPlayers.find(p => p.id === pid);
                    return <li key={idx}>{player ? player.name : '—'}</li>;
                })}
            </ul>
        );
        return (
            <div className="compare-view">
                <div className="compare-column">
                    <h4>{compareA}</h4>
                    {renderSlot(aData.xiIdx)}
                    <p>Impact: {aData.impactIdx ? allPlayers.find(p => p.id === aData.impactIdx).name : '—'}</p>
                </div>
                <div className="compare-column">
                    <h4>{compareB}</h4>
                    {renderSlot(bData.xiIdx)}
                    <p>Impact: {bData.impactIdx ? allPlayers.find(p => p.id === bData.impactIdx).name : '—'}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="lineup-manager">
            <div className="lineup-tabs">
                <button className={activeTab === 'squad' ? 'active' : ''} onClick={() => setActiveTab('squad')}>Squad Builder</button>
                <button className={activeTab === 'current' ? 'active' : ''} onClick={() => setActiveTab('current')}>Current Lineup</button>
                <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => setActiveTab('saved')}>Saved Lineups</button>
                <button className={activeTab === 'compare' ? 'active' : ''} onClick={() => setActiveTab('compare')}>Compare</button>
            </div>
            {activeTab === 'squad' && (
                <>
                    <PlayingXIBuilder key={builderKey} teamId={teamId} allPlayers={allPlayers} />
                    <div className="save-controls">
                        <input type="text" placeholder="Lineup name" value={lineupName} onChange={e => setLineupName(e.target.value)} />
                        <button onClick={handleSave}>Save Lineup</button>
                    </div>
                </>
            )}
            {activeTab === 'current' && (
                <PlayingXIBuilder key={`curr-${builderKey}`} teamId={teamId} allPlayers={allPlayers} />
            )}
            {activeTab === 'saved' && (
                <>
                    {renderSavedList()}
                    <div className="import-section">
                        <label>Import Lineup: <input type="file" accept="application/json" onChange={handleImport} /></label>
                    </div>
                </>
            )}
            {activeTab === 'compare' && (
                <>
                    <div className="compare-selectors">
                        <select value={compareA} onChange={e => setCompareA(e.target.value)}>
                            <option value="">Select Lineup A</option>
                            {Object.keys(savedLineups).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <select value={compareB} onChange={e => setCompareB(e.target.value)}>
                            <option value="">Select Lineup B</option>
                            {Object.keys(savedLineups).map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    {renderCompare()}
                </>
            )}
        </div>
    );
};

export default LineupManager;
