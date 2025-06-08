# Grid Quest

Grid Quest is a browser-based role-playing game built with plain HTML, CSS and JavaScript.

## Running locally

Because the game loads JSON files via `fetch`, it needs to be served over HTTP. From the project root run:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/` in your browser to launch `index.html`. Any other static server (e.g. `npx serve`) will work as well. This mirrors how the project is hosted with GitHub Pages.

## Development

Game scripts live under `scripts/` and data files are in `data/`. With the server running, modifying these files and refreshing the page is enough to see changes.

### Environments

Maps can specify an `environment` value which adds a CSS class like `env-fog` or `env-rain` to the grid. The stylesheet provides visual effects for these classes. Additional options such as `env-day`, `env-dusk` and `env-night` are available for custom day, dusk or night scenes.

## Deployment

The repository is ready for GitHub Pages. Commit your changes to the default branch and enable Pages to serve `index.html` from the repository root.
