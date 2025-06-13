# Grid Quest

**Grid Quest** is a lightweight role-playing game that runs entirely in the browser. Explore tile based maps, battle enemies and collect loot – all without a backend server.

## Features

- Turn based combat on a grid layout
- Inventory management
- Quests with an in game log
- Player stats and leveling
- Completely client side so it works with GitHub Pages

## Running locally

To work on Grid Quest locally you need Node.js for the lint and test tools and a
local HTTP server to serve the static assets.

1. Install [Node.js](https://nodejs.org/) (v18 or later is recommended).
2. Install the Node dependencies:

   ```bash
   npm install
   ```

   This sets up ESLint, Prettier and Jest which are used during development.
3. Optionally run the checks:

   ```bash
   npm run lint
   npm test
   ```

4. Start a local server from the project root so that the JSON and image assets
   load correctly:

   ```bash
   python3 -m http.server
   # or npx http-server
   ```

5. Visit `http://localhost:8000/` in your browser.

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

Alternatively run the helper script which prefers cached packages when
available:

```bash
./scripts/setup_dev.sh
```

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
3. Name new files using `snake_case` to keep the repository consistent.
4. Submit a pull request describing your changes.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Known Issues

1. Large Untested Modules

   - Some JavaScript files (e.g., `scripts/main.js`) are several hundred lines long, making them hard to maintain and test.

2. Manual Asset Loading
   - Many JSON assets are fetched at runtime (e.g., `loadMap` in `scripts/mapLoader.js`), requiring a local HTTP server. If any file is missing or malformed, the error handling is minimal.

3. Remove Unused Copies
   - Previous releases were stored in a `versions/` directory. These files have been removed from the working tree to keep the repository lightweight. Use Git history or tags to access older snapshots.
