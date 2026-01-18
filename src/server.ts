import express from 'express';
import path from 'path';
import { DatabaseManager } from './db';

const app = express();
const port = process.env.PORT || 3000;
const db = new DatabaseManager();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files (css, images)
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'FAB Regional ELO - RS' });
});

app.get('/rankings', async (req, res) => {
    try {
        const rankings = await db.getRankingsWithHeroAffinity();
        res.render('rankings', { title: 'Regional Rankings', rankings });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function startServer() {
    await db.init();
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

startServer().catch(console.error);
