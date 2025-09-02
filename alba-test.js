const TradingView = require('@mathieuc/tradingview');

async function testAlbaTherium() {
    console.log('🔍 Teste AlbaTherium Indikator...');
    
    const client = new TradingView.Client();
    const chart = new client.Session.Chart();
    
    chart.setMarket('BINANCE:BTCUSDT', { timeframe: '1' });
    
    // Warten bis Chart geladen
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
        // AlbaTherium MTF Volatility Edge Zones mit der echten ID
        const albaIndicator = new chart.Study({
            id: 'PUB;e49e7a8e29b1498283712d000cbacfd9',
            version: '1.0',
            text: 'bmI9Ks46_YFGgP7CmGP1tqPeaT/gRIg==_M9xxeSZFH8x9...' // Der verschlüsselte Code
        });
        
        albaIndicator.onUpdate(() => {
            console.log('🚀 AlbaTherium Update:', albaIndicator.periods);
        });
        
        albaIndicator.onError((error) => {
            console.log('❌ AlbaTherium Fehler:', error);
        });
        
        console.log('✅ AlbaTherium Indikator geladen - warte auf Daten...');
        
    } catch (error) {
        console.log('❌ Fehler beim Laden:', error.message);
    }
    
    setTimeout(() => process.exit(0), 30000);
}

testAlbaTherium();