# Klimazon Website

Dit project gebruikt `src/` als bron en publiceert naar `docs/` voor GitHub Pages.
Tijdens ontwikkeling werk je **altijd** in `src/`. De map `docs/` wordt automatisch gegenereerd.

**Snel starten**
1. Installeer dependencies:
   ```bash
   npm install
   ```
1. Start development sync + Tailwind watch:
   ```bash
   npm run dev
   ```
1. Open de site vanaf `docs/`:
   ```bash
   python -m http.server --directory docs
   ```
   Ga daarna naar `http://localhost:8000`.

**Build voor GitHub Pages**
1. Maak een production build:
   ```bash
   npm run build
   ```
   Dit synchroniseert `src/` naar `docs/` en bouwt `docs/css/main.css`.

**Belangrijk**
- Werk in `src/`, serve altijd `docs/`.
- Als iets in de browser ontbreekt, check of `npm run dev` draait of draai `npm run build`.
- Gebruik geen live-server op `docs/` bij `includes.js`: de live-reload injectie kan partials kapotmaken
  (zoals het mobiele menu). `python -m http.server` werkt wel goed.
