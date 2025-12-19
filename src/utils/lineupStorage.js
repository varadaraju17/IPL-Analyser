// src/utils/lineupStorage.js
// Helper to manage multiple lineups for a team using localStorage.
// Storage schema: { "lineups_<teamId>": { "Lineup Name": { xi: [playerId...], impact: playerId|null } } }

/** Get all saved lineups for a team */
export function getLineups(teamId) {
    const key = `lineups_${teamId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse lineups from localStorage', e);
        return {};
    }
}

/** Save a lineup under a given name */
export function saveLineup(teamId, name, data) {
    const key = `lineups_${teamId}`;
    const existing = getLineups(teamId);
    existing[name] = data;
    localStorage.setItem(key, JSON.stringify(existing));
}

/** Delete a saved lineup */
export function deleteLineup(teamId, name) {
    const key = `lineups_${teamId}`;
    const existing = getLineups(teamId);
    if (existing[name]) {
        delete existing[name];
        localStorage.setItem(key, JSON.stringify(existing));
    }
}

/** Export a lineup as JSON string */
export function exportLineup(teamId, name) {
    const lineups = getLineups(teamId);
    if (!lineups[name]) return null;
    return JSON.stringify({ name, data: lineups[name] }, null, 2);
}

/** Import a lineup JSON (string) and store it */
export function importLineup(teamId, jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        const { name, data } = parsed;
        if (!name || !data) return false;
        saveLineup(teamId, name, data);
        return true;
    } catch (e) {
        console.error('Import lineup failed', e);
        return false;
    }
}

/** Get a specific lineup data */
export function getLineup(teamId, name) {
    const lineups = getLineups(teamId);
    return lineups[name] || null;
}
