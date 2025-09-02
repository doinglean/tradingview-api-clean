const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const TradingView = require('@mathieuc/tradingview');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// HTTP Server
const server = http.createServer(app);

// WebSocket auf gleichem Port
const wss = new WebSocket.Server({ server });

// TradingView Client
const client = new TradingView.Client();
const charts = new Map();

// Speicher für AlbaTherium Daten
let latestAlbaData = {
    timestamp: null,
    signal: null,
    price: null,
    action: 'HOLD'
};

app.get('/', (req, res) => {
    res.json({ 
        status: 'TradingView API + AlbaTherium läuft!', 
        timestamp: new Date().toISOString(),
        websocket: `wss://${req.get('host')}/`
    });
});

app.get('/api/alba-signal', (req, res) => {
    if (latestAlbaData.timestamp) {
        res.json({
            success: true,
            signal: latestAlbaData,
            age_seconds: Math.floor((Date.now() - latestAlbaData.timestamp) / 1000)
        });
    } else {
        res.json({
            success: false,
            message: 'Keine AlbaTherium Daten verfügbar'
        });
    }
});

app.post('/api/alba-update', (req, res) => {
    latestAlbaData = {
        ...req.body,
        received_at: Date.now()
    };
    console.log('AlbaTherium Update:', latestAlbaData);
    res.json({ success: true });
});

// WebSocket Handler
wss.on('connection', (ws) => {
    console.log('Browser WebSocket verbunden');
    
    ws.on('message', (data) => {
        try {
            latestAlbaData = JSON.parse(data);
            console.log('AlbaTherium WebSocket Update:', latestAlbaData);
        } catch (error) {
            console.error('WebSocket Fehler:', error);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
    console.log('WebSocket und HTTP auf gleichem Port');
});