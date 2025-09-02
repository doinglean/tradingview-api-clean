# AlbaTherium Indikator IDs extrahieren

## Schritt 1: TradingView öffnen
- Gehe zu deinem Chart mit den AlbaTherium Indikatoren

## Schritt 2: DevTools öffnen  
- F12 drücken oder CMD+Option+I
- Network Tab wählen
- WebSocket Filter aktivieren

## Schritt 3: Indikator neu laden
- Entferne den "MTF Volatility Edge Zones Premium" Indikator
- Füge ihn wieder hinzu
- Beobachte die WebSocket Messages

## Schritt 4: Nach "create_study" suchen
- Finde Nachrichten die "create_study" enthalten
- Kopiere die komplette Message

Beispiel Format: