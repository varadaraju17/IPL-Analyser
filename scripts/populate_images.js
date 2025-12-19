
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersPath = path.join(__dirname, '../src/data/players.json');
const publicPath = path.join(__dirname, '../public');
const defaultImagePath = path.join(publicPath, 'default_player.png');
const imagesBaseDir = path.join(publicPath, 'player-images');

console.log(`Reading players from: ${playersPath}`);

// Ensure base images directory exists
if (!fs.existsSync(imagesBaseDir)) {
    fs.mkdirSync(imagesBaseDir, { recursive: true });
}

// Read players data
const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
let updatedCount = 0;

playersData.forEach(player => {
    // Sanitize player name for filename
    const safeName = player.name.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
    const teamId = player.teamId || 'unknown';

    // Create team directory if not exists
    const teamDir = path.join(imagesBaseDir, teamId);
    if (!fs.existsSync(teamDir)) {
        fs.mkdirSync(teamDir, { recursive: true });
    }

    const imageFilename = `${safeName}.png`;
    const targetImagePath = path.join(teamDir, imageFilename);
    const publicUrl = `/player-images/${teamId}/${imageFilename}`;

    // Copy default image to target path
    if (fs.existsSync(defaultImagePath)) {
        try {
            fs.copyFileSync(defaultImagePath, targetImagePath);
        } catch (e) {
            console.error(`Failed to copy image for ${player.name}:`, e.message);
        }
    } else {
        console.error(`Default image not found at ${defaultImagePath}`);
    }

    // Update player record
    player.image = publicUrl;
    updatedCount++;
    // console.log(`Processed: ${player.name} -> ${publicUrl}`); // Commented out to reduce noise
});

// Write back updated JSON
fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2), 'utf8');

console.log(`\nSuccessfully generated images and updated paths for ${updatedCount} players.`);
