# Grid Quest

**Grid Quest** is a lightweight role-playing game that runs entirely in the browser. Explore tile based maps, battle enemies and collect loot – all without a backend server.

## Features

- Turn based combat on a grid layout
- Inventory management
- Quests with an in game log
- Player stats and leveling
- Completely client side so it works with GitHub Pages

## Running locally

Grid Quest loads data via `fetch` so it needs to be served over HTTP. After running `npm install` you can start a simple server from the project root:

```bash
python3 -m http.server
# or npx http-server
```

Visit `http://localhost:8000/` in your browser.

## Project structure

- `index.html` – entry point for the application
- `scripts/` – JavaScript modules that power the game
- `style/` – stylesheets
- `data/` – maps, enemies, items and other JSON data

## Development

Refresh the browser after editing files in `scripts/`, `style/` or `data/`. Node tooling is only used for linting and tests and does not affect the static build.

### Setup

1. Install [Node.js](https://nodejs.org/) (v18 or later recommended).
2. Install the project dependencies:

```bash
npm install
```
Run this command before using `npm run lint` or `npm test`.

### Available commands

- `npm run lint` – check code with ESLint
- `npm run format` – format files using Prettier
- `npm test` – run Jest tests (none included by default)

## Deploying to GitHub Pages

1. Push your latest code to the `main` branch (or another branch you wish to publish).
2. In the repository settings, enable **GitHub Pages** and select that branch as the source.
3. Once the Pages build completes, access the game at `https://<username>.github.io/<repository>/`.

## Contributing

1. Fork the repository and create a branch for your changes.
2. Run `npm test` and `npm run lint` before committing.
3. Submit a pull request describing your changes.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Known Issues

1. Large Untested Modules

   - Some JavaScript files (e.g., `scripts/main.js`) are several hundred lines long, making them hard to maintain and test.

2. Manual Asset Loading
   - Many JSON assets are fetched at runtime (e.g., `loadMap` in `scripts/mapLoader.js`), requiring a local HTTP server. If any file is missing or malformed, the error handling is minimal.
