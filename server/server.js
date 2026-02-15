const http = require('http');
const fs = require('fs');
const path = require('path');

const SCORES_FILE = '/data/scores.json';
const PORT = 3000;

function loadScores() {
    try {
        if (fs.existsSync(SCORES_FILE)) {
            return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading scores:', e);
    }
    return [];
}

function saveScores(scores) {
    try {
        fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
    } catch (e) {
        console.error('Error saving scores:', e);
    }
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/scores' && req.method === 'GET') {
        const scores = loadScores();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(scores));
        return;
    }

    if (req.url === '/stats' && req.method === 'GET') {
        const scores = loadScores();
        const uniquePlayers = new Set(scores.map(s => s.name)).size;
        const totalGames = scores.length;
        const avg = (arr, fn) => arr.length ? +(arr.reduce((s, v) => s + fn(v), 0) / arr.length).toFixed(1) : 0;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            totalGames,
            uniquePlayers,
            averageAlerts: avg(scores, s => s.alerts || 0),
            averageMeters: {
                noise: avg(scores, s => s.meters?.noise ?? 0),
                damage: avg(scores, s => s.meters?.damage ?? 0),
                risk: avg(scores, s => s.meters?.risk ?? 0),
                career: avg(scores, s => s.meters?.career ?? 0)
            }
        }));
        return;
    }

    if (req.url === '/scores' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const newScore = JSON.parse(body);
                const scores = loadScores();
                scores.push({
                    name: String(newScore.name).slice(0, 20),
                    alerts: parseInt(newScore.alerts) || 0,
                    meters: newScore.meters || {},
                    date: new Date().toISOString()
                });
                scores.sort((a, b) => b.alerts - a.alerts);
                const trimmed = scores.slice(0, 1000);
                saveScores(trimmed);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`Score server running on port ${PORT}`);
});
