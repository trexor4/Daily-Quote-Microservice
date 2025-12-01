const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8030;
const QUOTES_FILE = path.join(__dirname, 'quotes.json');
let quotes = {};

// Load quotes at startup
async function loadQuotes() {
    try {
        const data = await fs.readFile(QUOTES_FILE, 'utf-8');
        quotes = JSON.parse(data);
        console.log('Quotes loaded from quotes.json');
    } catch (err) {
        console.error('Failed to load quotes.json:', err);
        process.exit(1);
    }
}

// GET /quote?category=general
app.get('/quote', (req, res) => {
    const category = req.query.category || 'general';
    const catQuotes = quotes[category];

    if (!catQuotes || catQuotes.length === 0) {
        return res.status(404).json({ error: 'Category not found or empty' });
    }

    // Pick a random quote
    const randomIndex = Math.floor(Math.random() * catQuotes.length);
    const selected = catQuotes[randomIndex];

    res.json({
        category,
        quote: selected.quote,
        author: selected.author
    });
});

// Start server
app.listen(PORT, async () => {
    await loadQuotes();
    console.log(`Daily Quote Service running on port ${PORT}`);
});
