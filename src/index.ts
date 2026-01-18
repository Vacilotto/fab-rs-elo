import { DatabaseManager } from './db';

async function main() {
    const db = new DatabaseManager();
    await db.init();

    console.log('--- FAB Regional ELO System Initialized ---');

    // Example Seed Data
    const player1Id = await db.addPlayer('Guga');
    const player2Id = await db.addPlayer('Felipe');
    const hero1Id = await db.addHero('Kayo', 'Brute');
    const hero2Id = await db.addHero('Dromai', 'Illusionist');

    console.log(`Players: Guga (${player1Id}), Felipe (${player2Id})`);

    // Record a dummy match
    await db.recordMatch({
        tournament_id: 1,
        player1_id: player1Id,
        player2_id: player2Id,
        player1_hero_id: hero1Id,
        player2_hero_id: hero2Id,
        winner_id: player1Id
    });

    console.log('Match recorded: Guga vs Felipe (Guga Wins)');

    const rankings = await db.getRankings();
    console.log('Current Regional Rankings:');
    console.table(rankings);
}

main().catch(console.error);
