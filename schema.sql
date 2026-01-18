-- Database schema for FAB Regional ELO System

-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    current_elo REAL DEFAULT 1500.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Heroes Table
CREATE TABLE IF NOT EXISTS heroes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    class TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments Table
CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER,
    player1_id INTEGER,
    player2_id INTEGER,
    player1_hero_id INTEGER,
    player2_hero_id INTEGER,
    winner_id INTEGER, -- NULL for draw
    elo_change REAL, -- Magnitude of ELO change for player1 (negative of change for player2)
    match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (player1_id) REFERENCES players(id),
    FOREIGN KEY (player2_id) REFERENCES players(id),
    FOREIGN KEY (player1_hero_id) REFERENCES heroes(id),
    FOREIGN KEY (player2_hero_id) REFERENCES heroes(id)
);

-- ELO History Table (For tracking player progress over time)
CREATE TABLE IF NOT EXISTS elo_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    match_id INTEGER,
    elo_after REAL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);
