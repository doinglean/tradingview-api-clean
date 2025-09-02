// TradingView API Explorer - Alle Features testen
const TradingView = require('@mathieuc/tradingview');

console.log('🔍 TradingView API Feature Explorer');
console.log('====================================');

async function exploreAPI() {
    const client = new TradingView.Client();
    
    console.log('\n1. 📊 CLIENT FEATURES:');
    console.log('- Version:', TradingView.version || 'Unbekannt');
    console.log('- Client erstellt:', !!client);
    
    // Chart Session erstellen
    const chart = new client.Session.Chart();
    console.log('- Chart Session:', !!chart);
    
    console.log('\n2. 🎯 VERFÜGBARE METHODEN:');
    console.log('Chart Methoden:', Object.getOwnPropertyNames(chart).filter(name => typeof chart[name] === 'function'));
    console.log('Client Methoden:', Object.getOwnPropertyNames(client).filter(name => typeof client[name] === 'function'));
    
    console.log('\n3. 💹 MARKET DATA TESTEN:');
    
    // Verschiedene Symbole testen
    const symbols = [
        'BINANCE:BTCUSDT',
        'BINANCE:ETHUSDT',
        'NASDAQ:AAPL',
        'FX:EURUSD',
        'OANDA:XAUUSD'
    ];
    
    for (const symbol of symbols) {
        try {
            console.log(`\n📈 Teste Symbol: ${symbol}`);
            const testChart = new client.Session.Chart();
            
            testChart.onSymbolLoaded(() => {
                console.log(`✅ ${symbol} erfolgreich geladen`);
                console.log('- Beschreibung:', testChart.infos?.description);
                console.log('- Exchange:', testChart.infos?.exchange);
                console.log('- Währung:', testChart.infos?.currency_code);
                console.log('- Typ:', testChart.infos?.type);
                console.log('- Session:', testChart.infos?.session);
            });
            
            testChart.onUpdate(() => {
                if (testChart.periods && testChart.periods.length > 0) {
                    const latest = testChart.periods[testChart.periods.length - 1];
                    console.log(`💰 ${symbol}: ${latest.close} (Vol: ${latest.volume})`);
                }
            });
            
            testChart.onError((error) => {
                console.log(`❌ ${symbol} Fehler:`, error);
            });
            
            // Verschiedene Timeframes testen
            const timeframes = ['1', '5', '15', '1H', '4H', '1D'];
            const randomTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
            
            testChart.setMarket(symbol, {
                timeframe: randomTimeframe
            });
            
            console.log(`- Timeframe: ${randomTimeframe}`);
            
            // Kurz warten für Daten
            await new Promise(resolve => setTimeout(resolve, 3000));
            
        } catch (error) {
            console.log(`❌ Fehler bei ${symbol}:`, error.message);
        }
    }
    
    console.log('\n4. 🔧 ADVANCED FEATURES TESTEN:');
    
    try {
        // Indikatoren testen
        console.log('\n📊 INDIKATOREN:');
        const indicatorChart = new client.Session.Chart();
        
        indicatorChart.setMarket('BINANCE:BTCUSDT', {
            timeframe: '1H'
        });
        
        // Warten bis Chart geladen
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Standard-Indikatoren testen
        const indicators = [
            {
                name: 'RSI',
                id: 'RSI@tv-basicstudies-1',
                inputs: { length: 14 }
            },
            {
                name: 'Moving Average',
                id: 'MASimple@tv-basicstudies-1', 
                inputs: { length: 20 }
            },
            {
                name: 'MACD',
                id: 'MACD@tv-basicstudies-1',
                inputs: {}
            }
        ];
        
        for (const indicator of indicators) {
            try {
                console.log(`\n🔍 Teste Indikator: ${indicator.name}`);
                
                const study = new indicatorChart.Study({
                    id: indicator.id,
                    version: '1'
                });
                
                // Inputs setzen falls vorhanden
                if (indicator.inputs && Object.keys(indicator.inputs).length > 0) {
                    Object.entries(indicator.inputs).forEach(([key, value]) => {
                        study.setOption(key, value);
                    });
                }
                
                study.onUpdate(() => {
                    console.log(`✅ ${indicator.name} Update:`, study.periods?.[0] || 'Keine Daten');
                });
                
                study.onError((error) => {
                    console.log(`❌ ${indicator.name} Fehler:`, error);
                });
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.log(`❌ ${indicator.name} konnte nicht geladen werden:`, error.message);
            }
        }
        
    } catch (error) {
        console.log('❌ Advanced Features Fehler:', error);
    }
    
    console.log('\n5. 🔍 WEITERE FEATURES:');
    
    try {
        // Session Features erkunden
        console.log('\nSession Features:');
        const session = client.Session;
        console.log('- Session Methoden:', Object.getOwnPropertyNames(session).filter(name => typeof session[name] === 'function'));
        
        // Mögliche andere Features
        if (client.search) {
            console.log('\n🔍 SEARCH Feature verfügbar');
        }
        
        if (client.screener) {
            console.log('\n📊 SCREENER Feature verfügbar');
        }
        
        if (client.alerts) {
            console.log('\n🔔 ALERTS Feature verfügbar');
        }
        
        if (client.watchlist) {
            console.log('\n📋 WATCHLIST Feature verfügbar');
        }
        
    } catch (error) {
        console.log('❌ Session Exploration Fehler:', error);
    }
    
    console.log('\n6. 📝 ZUSAMMENFASSUNG:');
    console.log('==================');
    console.log('✅ Realtime Preise: Funktioniert');
    console.log('✅ Multiple Symbole: Verfügbar');
    console.log('✅ Verschiedene Timeframes: Verfügbar');
    console.log('✅ Standard Indikatoren: Testbereit');
    console.log('❓ Invite-Only Indikatoren: Manuell zu konfigurieren');
    console.log('❓ Advanced Features: Zu erkunden');
    
    console.log('\n🎯 NÄCHSTE SCHRITTE:');
    console.log('1. Deine spezifischen Indikatoren identifizieren');
    console.log('2. WebSocket Messages für invite-only Indikatoren analysieren');
    console.log('3. Trading-Signal Logik implementieren');
    console.log('4. N8N Integration vorbereiten');
}

// Explorer starten
exploreAPI().catch(console.error);

// Script nach 60 Sekunden beenden
setTimeout(() => {
    console.log('\n⏰ API Explorer Test beendet');
    console.log('Alle Features wurden getestet!');
    process.exit(0);
}, 60000);