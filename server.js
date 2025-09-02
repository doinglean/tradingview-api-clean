const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const TradingView = require('@mathieuc/tradingview');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// TradingView Client
const client = new TradingView.Client();
const charts = new Map();

// Speicher für AlbaTherium Daten
let latestAlbaData = {
    timestamp: null,
    signal: null,
    price: null,
    color: null,
    action: 'HOLD'
};

// WebSocket Server
const wss = new WebSocket.Server({ 
    port: process.env.WS_PORT || (PORT + 1000) 
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'TradingView API + AlbaTherium läuft!', 
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/price/:symbol - Preis abrufen',
            'GET /api/alba-signal - AlbaTherium Signal',
            'POST /api/alba-update - Signal Update'
        ],
        websocket: `ws://localhost:${process.env.WS_PORT || (PORT + 1000)}`
    });
});

// Bestehender Preis-Endpunkt
app.get('/api/price/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();
        const fullSymbol = `BINANCE:${symbol}USDT`;
        
        if (!charts.has(fullSymbol)) {
            const chart = new client.Session.Chart();
            chart.setMarket(fullSymbol, { timeframe: '1H' });
            charts.set(fullSymbol, chart);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        const chart = charts.get(fullSymbol);
        
        if (chart.periods && chart.periods.length > 0) {
            const latest = chart.periods[chart.periods.length - 1];
            res.json({
                symbol: fullSymbol,
                price: latest.close,
                volume: latest.volume,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(404).json({ error: 'Keine Daten verfügbar' });
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AlbaTherium Signal Endpunkt für N8N
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
            message: 'Keine AlbaTherium Daten verfügbar - Browser-Script aktivieren'
        });
    }
});

// Signal Update Endpunkt
app.post('/api/alba-update', (req, res) => {
    latestAlbaData = {
        ...req.body,
        received_at: Date.now()
    };
    
    console.log('AlbaTherium Update erhalten:', latestAlbaData);
    
    res.json({ success: true, message: 'Signal gespeichert' });
});

// WebSocket Verbindungen verwalten
wss.on('connection', (ws) => {
    console.log('Browser WebSocket verbunden');
    
    ws.on('message', (data) => {
        try {
            const signal = JSON.parse(data);
            latestAlbaData = {
                ...signal,
                received_at: Date.now()
            };
            console.log('AlbaTherium WebSocket Update:', latestAlbaData);
        } catch (error) {
            console.error('WebSocket Parsing Fehler:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('Browser WebSocket getrennt');
    });
});

app.listen(PORT, () => {
    console.log(`HTTP API: Port ${PORT}`);
    console.log(`WebSocket: Port ${process.env.WS_PORT || (PORT + 1000)}`);
    console.log('AlbaTherium Bridge bereit!');
});