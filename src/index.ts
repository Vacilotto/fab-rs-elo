import { DatabaseManager } from './db';

async function main() {
    const db = new DatabaseManager();
    await db.init();

    console.log('--- FAB Regional ELO System Initialized ---');

    // Example Seed Data
    const player1Id = await db.addPlayer('Guga');
    const player2Id = await db.addPlayer('Felipe');
    const player3Id = await db.addPlayer('Mateus');

    const hero1Id = await db.addHero('Kayo', 'Brute');
    const hero2Id = await db.addHero('Dromai', 'Illusionist');
    const hero3Id = await db.addHero('Katsu', 'Ninja');

    console.log(`Players: Guga, Felipe, Mateus`);

    // Record matches to establish a "Best Hero"
    // Guga wins twice with Kayo
    await db.recordMatch({ tournament_id: 1, player1_id: player1Id, player2_id: player2Id, player1_hero_id: hero1Id, player2_hero_id: hero2Id, winner_id: player1Id });
    await db.recordMatch({ tournament_id: 1, player1_id: player1Id, player2_id: player3Id, player1_hero_id: hero1Id, player2_hero_id: hero3Id, winner_id: player1Id });

    // Felipe wins once with Dromai
    await db.recordMatch({ tournament_id: 1, player1_id: player2Id, player2_id: player3Id, player1_hero_id: hero2Id, player2_hero_id: hero3Id, winner_id: player2Id });

    console.log('Matches recorded correctly.');

    const rankingsCount = await db.getRankingsWithHeroAffinity();
    console.log('Current Regional Rankings (with Hero Affinity):');
    console.table(rankingsCount);
}

main().catch(console.error);
