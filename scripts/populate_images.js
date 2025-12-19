
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playersPath = path.join(__dirname, '../src/data/players.json');
const publicPath = path.join(__dirname, '../public');
const batsmanImgPath = path.join(publicPath, 'default_batsman.png');
const bowlerImgPath = path.join(publicPath, 'default_bowler.png');
const defaultImgPath = path.join(publicPath, 'default_player.png'); // Fallback
const imagesBaseDir = path.join(publicPath, 'player-images');

console.log(`Reading players from: ${playersPath}`);

if (!fs.existsSync(imagesBaseDir)) {
    fs.mkdirSync(imagesBaseDir, { recursive: true });
}

const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
let updatedCount = 0;

playersData.forEach(player => {
    const safeName = player.name.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
    const teamId = player.teamId || 'unknown';
    const role = (player.role || "").toLowerCase();

    // Determine target image type
    let sourceImage = defaultImgPath;
    if (role.includes('bowl')) sourceImage = bowlerImgPath;
    else if (role.includes('bat') || role.includes('keeper')) sourceImage = batsmanImgPath;

    // Check if source exists, else fallback
    if (!fs.existsSync(sourceImage)) sourceImage = defaultImgPath;
    if (!fs.existsSync(sourceImage)) {
        // console.error(`No default image found for ${player.name}`);
        return;
    }

    const teamDir = path.join(imagesBaseDir, teamId);
    if (!fs.existsSync(teamDir)) fs.mkdirSync(teamDir, { recursive: true });

    const imageFilename = `${safeName}.png`;
    const targetImagePath = path.join(teamDir, imageFilename);
    const publicUrl = `/player-images/${teamId}/${imageFilename}`;

    // Copy ONLY if not exists (preserve manual uploads), OR overwrite if forced (optional)
    // For now, let's copy if missing to standardise
    if (!fs.existsSync(targetImagePath)) {
        try {
            fs.copyFileSync(sourceImage, targetImagePath);
        } catch (e) {
            console.error(`Failed to copy image for ${player.name}:`, e.message);
        }
    }

    // Always update JSON path to be safe
    player.image = publicUrl;
    updatedCount++;
});

fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2), 'utf8');
console.log(`\nSuccessfully populated images for ${updatedCount} players.`);
