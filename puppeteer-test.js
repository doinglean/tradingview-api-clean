const puppeteer = require('puppeteer');

console.log('Teste minimale Puppeteer Version...');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    
    await page.goto('https://tradingview.com/chart/');
    console.log('TradingView geladen - Browser bleibt 30 Sekunden offen');
    
    setTimeout(() => browser.close(), 30000);
})();
