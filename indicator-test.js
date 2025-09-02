const TradingView = require('@mathieuc/tradingview');

async function testIndicators() {
    const client = new TradingView.Client();
    const chart = new client.Session.Chart();
    
    chart.setMarket('BINANCE:BTCUSDT', { timeframe: '1H' });
    
    // Warten bis Chart geladen
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        // Korrekte Methode um Indikatoren zu laden
        const rsi = TradingView.getIndicator('RSI');
        const study = new chart.Study(rsi);
        
        study.onUpdate(() => {
            console.log('RSI Werte:', study.periods);
        });
        
        console.log('RSI Indikator geladen');
        
    } catch (error) {
        console.log('RSI Fehler:', error.message);
        
        // Alternative Syntax versuchen
        try {
            const study = new chart.Study('RSI@tv-basicstudies');
            study.onUpdate(() => {
                console.log('RSI (Alt-Syntax):', study.periods);
            });
        } catch (altError) {
            console.log('Alternative auch fehlgeschlagen:', altError.message);
        }
    }
    
    setTimeout(() => process.exit(0), 10000);
}

testIndicators();