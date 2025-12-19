
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersPath = path.join(__dirname, '../src/data/players.json');

try {
    const rawData = fs.readFileSync(playersPath, 'utf8');
    const playersData = JSON.parse(rawData);

    const rcbPlayers = playersData.filter(p => p.teamId === 'rcb');

    console.log(`RCB Player Count: ${rcbPlayers.length}`);
    rcbPlayers.forEach(p => {
        console.log(`${p.name} | ${p.role} | ${p.age}`);
    });

} catch (err) {
    console.error(err);
}
