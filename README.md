# FAB Regional ELO System (Rio Grande do Sul)

A specialized competition tracking and ELO ranking system tailored for the **Flesh and Blood (FaB)** community in **Rio Grande do Sul (RS)**.

## 🚀 Purpose

While global rankings provide a broad view, this regional system offers:
- **Granular Local Insights**: Track player skill levels within the specific landscape of regional competition.
- **Meta-Analysis**: Identify regional hero win rates and matchup shifts.
- **Historical Record**: A persistent database of matches, tournaments, and player growth.
- **Hero Affinity**: Automatically identifies each player's "Signature Hero" based on tournament performance.

## 🛠️ Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Language**: [TypeScript](https://www.typescript.org/)
- **Database**: [SQLite](https://www.sqlite.org/) (Persistent storage)
- **Web**: Express.js with EJS templates
- **Styling**: Premium custom CSS with a modern dark theme

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

3.  **Import Tournament Data**:
    ```powershell
    npm run import
    ```
    *This clears the current history and imports results from `tournament_results.json`.*

4.  **Start the Web Interface**:
    ```powershell
    npm run web
    ```
    *Visit `http://localhost:3000` to view the mission and regional rankings.*

## 📂 Project Structure

- `src/elo.ts`: Core ELO calculation logic.
- `src/db.ts`: Database Management layer (transactions & metrics).
- `src/server.ts`: Express web server implementation.
- `src/import_tournament.ts`: Script for bulk data processing.
- `views/`: EJS templates for the web interface.
- `public/`: Static assets (CSS, etc.).
- `schema.sql`: Database schema definition.

## 🗺️ Roadmap

Following the **CO-STAR** strategy method:
1.  **✅ Phase 1: Foundation**: Project initialization and SQL schema.
2.  **✅ Phase 2: Result Management**: Core ELO engine and match registration.
3.  **✅ Phase 3: Metric Evaluation**: Hero-specific win rates and player affinity.
4.  **✅ Phase 4: Visibility**: Premium Web UI (Standings & Analytics).
5.  **✅ Phase 5: Data Integration**: Import logic for real-world tournament results.

---
*Created for the Flesh and Blood community in Rio Grande do Sul.*
