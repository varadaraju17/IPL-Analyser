
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersPath = path.join(__dirname, '../src/data/players.json');

console.log(`Reading players from: ${playersPath}`);

try {
    const rawData = fs.readFileSync(playersPath, 'utf8');
    const playersData = JSON.parse(rawData);

    console.log(`Initial player count: ${playersData.length}`);

    // Deduplicate logic
    // We'll prioritize the LAST occurrence if duplicates exist (assuming latest append is correct), 
    // or just unique by details.
    // However, the issue is likely duplicate IDs or Names.

    // Let's filter by unique ID first.
    const uniquePlayers = [];
    const seenIds = new Set();

    // Process in reverse to keep the LATEST definition if we appended
    // OR traverse normally but check if we've seen it.

    // Actually, looking at the user report, I likely appended 25 players multiplied by 5.
    // So we should rebuild the list.

    // Better strategy: Map of id -> player object. 
    // This naturally handles uniqueness.
    const playerMap = new Map();

    playersData.forEach(p => {
        // Create a unique key. ID is good, but let's be careful if IDs were reused.
        // For RCB, ids were rcb-1 to rcb-25.
        // If I appended the same block 5 times, they have same IDs.
        // So Map will overwrite and keep the last one. Perfect.
        playerMap.set(p.id, p);
    });

    const cleanedPlayers = Array.from(playerMap.values());
    console.log(`Cleaned player count: ${cleanedPlayers.length}`);

    // Optional: Sort by teamId then ID for tidiness
    cleanedPlayers.sort((a, b) => {
        if (a.teamId === b.teamId) {
            // Try to sort by numerical part of ID if possible
            const numA = parseInt(a.id.split('-')[1]) || 0;
            const numB = parseInt(b.id.split('-')[1]) || 0;
            return numA - numB;
        }
        return a.teamId.localeCompare(b.teamId);
    });

    fs.writeFileSync(playersPath, JSON.stringify(cleanedPlayers, null, 2), 'utf8');
    console.log('Successfully wrote cleaned players.json');

} catch (err) {
    console.error('Error processing file:', err);
}
