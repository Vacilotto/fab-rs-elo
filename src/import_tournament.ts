import fs from 'fs';
import { DatabaseManager } from './db';

async function importTournament() {
    const db = new DatabaseManager();
    await db.init();

    console.log('Clearing existing data...');
    await db.clearDatabase();

    const data = JSON.parse(fs.readFileSync('./tournament_results.json', 'utf8'));

    const tournamentId = await db.addTournament('Regional Tournament', 'Rio Grande do Sul', new Date().toISOString());
    console.log(`Created tournament with ID: ${tournamentId}`);

    // We need to process rounds sequentially to ensure ELO is calculated correctly based on history
    for (const roundData of data) {
        console.log(`Processing Round ${roundData.round}...`);

        for (const match of roundData.matches) {
            if (match.p2 === 'BYE') {
                console.log(`Skipping BYE match for ${match.p1}`);
                continue;
            }

            const p1Id = await db.addPlayer(match.p1);
            const p2Id = await db.addPlayer(match.p2);

            const h1Id = await db.addHero(match.p1_deck);
            const h2Id = await db.addHero(match.p2_deck);

            let winnerId: number | null = null;
            if (match.winner === match.p1) {
                winnerId = p1Id;
            } else if (match.winner === match.p2) {
                winnerId = p2Id;
            }

            await db.recordMatch({
                tournament_id: tournamentId,
                player1_id: p1Id,
                player2_id: p2Id,
                player1_hero_id: h1Id,
                player2_hero_id: h2Id,
                winner_id: winnerId
            });
        }
    }

    console.log('Import completed successfully.');

    const rankings = await db.getRankingsWithHeroAffinity();
    console.log('Final Rankings:');
    console.table(rankings.slice(0, 10)); // Top 10
}

importTournament().catch(console.error);
