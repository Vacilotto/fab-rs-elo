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

    async clearDatabase() {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.run('DELETE FROM elo_history');
        await this.db.run('DELETE FROM matches');
        await this.db.run('DELETE FROM tournaments');
        await this.db.run('DELETE FROM heroes');
        await this.db.run('DELETE FROM players');
        // Reset sqlite sequences
        await this.db.run("DELETE FROM sqlite_sequence WHERE name IN ('elo_history', 'matches', 'tournaments', 'heroes', 'players')");
    }

    async addTournament(name: string, location?: string, date?: string): Promise<number> {
        const result = await this.db!.run(
            'INSERT INTO tournaments (name, location, date) VALUES (?, ?, ?)',
            [name, location, date]
        );
        return result.lastID!;
    }

    async addPlayer(name: string): Promise<number> {
        await this.db!.run(
            'INSERT INTO players (name, current_elo) VALUES (?, 1500) ON CONFLICT(name) DO NOTHING',
            [name]
        );
        const player = await this.db!.get('SELECT id FROM players WHERE name = ?', [name]);
        return player.id;
    }

    async addHero(name: string, heroClass?: string): Promise<number> {
        await this.db!.run(
            'INSERT INTO heroes (name, class) VALUES (?, ?) ON CONFLICT(name) DO NOTHING',
            [name, heroClass]
        );
        const hero = await this.db!.get('SELECT id FROM heroes WHERE name = ?', [name]);
        return hero.id;
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

    async getRankingsWithHeroAffinity() {
        // Query to find each player's hero with the most wins
        const sql = `
            WITH MatchWins AS (
                SELECT 
                    m.winner_id as player_id,
                    CASE WHEN m.winner_id = m.player1_id THEN m.player1_hero_id ELSE m.player2_hero_id END as hero_id,
                    COUNT(*) as wins
                FROM matches m
                WHERE m.winner_id IS NOT NULL
                GROUP BY m.winner_id, hero_id
            ),
            MaxWins AS (
                SELECT player_id, MAX(wins) as max_wins
                FROM MatchWins
                GROUP BY player_id
            ),
            BestHero AS (
                SELECT mw.player_id, MIN(h.name) as hero_name
                FROM MatchWins mw
                JOIN MaxWins mx ON mw.player_id = mx.player_id AND mw.wins = mx.max_wins
                JOIN heroes h ON mw.hero_id = h.id
                GROUP BY mw.player_id
            )
            SELECT p.name, p.current_elo, IFNULL(bh.hero_name, 'No wins yet') as best_hero
            FROM players p
            LEFT JOIN BestHero bh ON p.id = bh.player_id
            ORDER BY p.current_elo DESC;
        `;
        return this.db!.all(sql);
    }
}
