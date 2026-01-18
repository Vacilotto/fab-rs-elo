# FAB Regional ELO System (Rio Grande do Sul)

A specialized competition tracking and ELO ranking system tailored for the **Flesh and Blood (FaB)** community in **Rio Grande do Sul (RS)**.

## 🚀 Purpose

While global rankings provide a broad view, this regional system offers:
- **Granular Local Insights**: Track player skill levels within the specific landscape of regional competition.
- **Meta-Analysis**: Identify regional hero win rates and matchup shifts.
- **Historical Record**: A persistent database of matches, tournaments, and player growth.

## 🛠️ Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescript.org/) for type-safe ELO calculations and data management.
- **Database**: [SQLite](https://www.sqlite.org/) for lightweight, persistent storage.
- **Computation**: Custom ELO algorithm implementation.

## 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended v18+)
- [npm](https://www.npmjs.com/)

## 🏃 Getting Started

1.  **Install Dependencies**:
    ```powershell
    npm install
    ```

2.  **Build the Project**:
    ```powershell
    npm run build
    ```

3.  **Run the Demonstration**:
    ```powershell
    npm run start
    ```
    *This will initialize the database, seed test players/heroes, record a sample match, and display the current regional rankings in your console.*

## 📂 Project Structure

- `src/elo.ts`: Core ELO calculation logic (expected score vs. actual performance).
- `src/db.ts`: Database Management layer (SQLite interactions and transactions).
- `src/index.ts`: Application entry point and demonstration script.
- `schema.sql`: Database schema definition (Players, Heroes, Matches, Tournaments).
- `fab-elo.db`: The generated SQLite database (ignored by git).

## 🗺️ Roadmap

Following the **CO-STAR** strategy method:
1.  **✅ Phase 1: Foundation**: Project initialization, TypeScript setup, and SQL schema.
2.  **✅ Phase 2: Result Management**: Core ELO engine and match registration logic.
3.  **⏳ Phase 3: Metric Evaluation**: Hero-specific win rates and matchup matrices.
4.  **⏳ Phase 4: Visibility**: Dashboard/Visualization layer for community access.

---
*Created for the Flesh and Blood community in Rio Grande do Sul.*
