# Grid Quest

**Grid Quest** is a lightweight role-playing game that runs entirely in the browser. Explore tile based maps, battle enemies and collect loot – all without a backend server.

## Features

- Turn based combat on a grid layout
- Inventory management and crafting
- Quests with an in game log
- Player stats and leveling
- Completely client side so it works with GitHub Pages

## Running locally

Because the game loads JSON data with `fetch`, it must be served over HTTP. From the project root run:

```bash
python3 -m http.server
```

Open `http://localhost:8000/` to start playing. Any static server will work.

## Project structure

- `index.html` – entry point for the application
- `scripts/` – JavaScript modules that power the game
- `style/` – stylesheets
- `data/` – maps, enemies, items and other JSON data

## Development

Refresh the browser after editing files in `scripts/`, `style/` or `data/`. Node tooling is only used for linting and tests and does not affect the static build.

### Setup

Install dev dependencies once:

```bash
npm install
```

### Available commands

- `npm run lint` – check code with ESLint
- `npm run format` – format files using Prettier
- `npm test` – run Jest tests (none included by default)

## Contributing

1. Fork the repository and create a branch for your changes.
2. Run `npm test` and `npm run lint` before committing.
3. Submit a pull request describing your changes.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Known Issues

5. Large Untested Modules
   - Some JavaScript files (e.g., `scripts/main.js`) are several hundred lines long, making them hard to maintain and test.

6. Manual Asset Loading
   - Many JSON assets are fetched at runtime (e.g., `loadMap` in `scripts/mapLoader.js`), requiring a local HTTP server. If any file is missing or malformed, the error handling is minimal.
