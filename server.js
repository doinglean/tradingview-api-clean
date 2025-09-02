const express = require('express');
const cors = require('cors');
const TradingView = require('@mathieuc/tradingview');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

console.log('🚀 TradingView API startet...');

const client = new TradingView.Client();
const charts = new Map();

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'TradingView API läuft!', 
        timestamp: new Date().toISOString()
    });
});

// Bitcoin Preis
app.get('/api/price/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();
        const fullSymbol = `BINANCE:${symbol}USDT`;
        
        console.log(`📊 Abrufen: ${fullSymbol}`);
        
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
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(404).json({ error: 'Keine Daten verfügbar' });
        }
        
    } catch (error) {
        console.error('❌ Fehler:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
});