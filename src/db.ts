import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { updateRatings } from './elo';

export interface Player {
    id?: number;
    name: string;
    current_elo: number;
}

export interface Hero {
    id?: number;
    name: string;
    class?: string;
}

export interface Match {
    id?: number;
    tournament_id: number;
    player1_id: number;
    player2_id: number;
    player1_hero_id: number;
    player2_hero_id: number;
    winner_id: number | null;
    elo_change?: number;
    match_date?: string;
}

export class DatabaseManager {
    private db: Database | null = null;

    async init() {
        this.db = await open({
            filename: './fab-elo.db',
            driver: sqlite3.Database
        });

        // In a real app we'd use migrations, here we just run the schema
        const schema = await import('fs').then(fs => fs.readFileSync('./schema.sql', 'utf8'));
        await this.db.exec(schema);
    }

    async addPlayer(name: string): Promise<number> {
        const result = await this.db!.run(
            'INSERT INTO players (name, current_elo) VALUES (?, 1500) ON CONFLICT(name) DO NOTHING',
            [name]
        );
        return result.lastID!;
    }

    async addHero(name: string, heroClass?: string): Promise<number> {
        const result = await this.db!.run(
            'INSERT INTO heroes (name, class) VALUES (?, ?) ON CONFLICT(name) DO NOTHING',
            [name, heroClass]
        );
        return result.lastID!;
    }

    async recordMatch(match: Match) {
        const p1 = await this.getPlayer(match.player1_id);
        const p2 = await this.getPlayer(match.player2_id);

        if (!p1 || !p2) throw new Error('Players not found');

        const score1 = match.winner_id === match.player1_id ? 1 : match.winner_id === match.player2_id ? 0 : 0.5;
        const [newElo1, newElo2, change] = updateRatings(p1.current_elo, p2.current_elo, score1);

        await this.db!.run('BEGIN TRANSACTION');
        try {
            const matchResult = await this.db!.run(
                `INSERT INTO matches (tournament_id, player1_id, player2_id, player1_hero_id, player2_hero_id, winner_id, elo_change)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [match.tournament_id, match.player1_id, match.player2_id, match.player1_hero_id, match.player2_hero_id, match.winner_id, change]
            );

            const matchId = matchResult.lastID!;

            await this.db!.run('UPDATE players SET current_elo = ? WHERE id = ?', [newElo1, match.player1_id]);
            await this.db!.run('UPDATE players SET current_elo = ? WHERE id = ?', [newElo2, match.player2_id]);

            await this.db!.run('INSERT INTO elo_history (player_id, match_id, elo_after) VALUES (?, ?, ?)', [match.player1_id, matchId, newElo1]);
            await this.db!.run('INSERT INTO elo_history (player_id, match_id, elo_after) VALUES (?, ?, ?)', [match.player2_id, matchId, newElo2]);

            await this.db!.run('COMMIT');
        } catch (e) {
            await this.db!.run('ROLLBACK');
            throw e;
        }
    }

    async getPlayer(id: number): Promise<Player | undefined> {
        return this.db!.get('SELECT * FROM players WHERE id = ?', [id]);
    }

    async getRankings() {
        return this.db!.all('SELECT name, current_elo FROM players ORDER BY current_elo DESC');
    }
}
