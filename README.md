# Grid Quest

Grid Quest is a browser-based role-playing game built with plain HTML, CSS and JavaScript.

## Running locally

Because the game loads JSON files via `fetch`, it needs to be served over HTTP. From the project root run:

```bash
python3 -m http.server
```

Then open `http://localhost:8000/` in your browser to launch `index.html`. Any other static server (e.g. `npx serve`) will work as well. This mirrors how the project is hosted with GitHub Pages.

## Development

Game scripts live under `scripts/`, data files are in `data/`, and stylesheets can be found in `style/`. With the server running, modifying these files and refreshing the page is enough to see changes.

### Environments

Maps can specify an `environment` value which adds a CSS class like `env-fog` or `env-rain` to the grid. When the field is omitted the map defaults to the `clear` environment, applying an `env-clear` class. The stylesheet provides visual effects for these classes. Additional options such as `env-day`, `env-dusk` and `env-night` are available for custom day, dusk or night scenes.

## Deployment

The repository is ready for GitHub Pages. Commit your changes to the default branch and enable Pages to serve `index.html` from the repository root.

## Code Layout

The project keeps game scripts in the `scripts/` directory. Data files such as
dialog definitions live under `data/` and stylesheets are found in `style/`.
`index.html` loads these assets and initializes the game using modules from
`scripts/`.

## Testing

Grid Quest does not have an automated test suite. To manually test changes,
start a local server and open the game in your browser:

```bash
python3 -m http.server
```

Once the server is running, navigate to `http://localhost:8000/` and interact
with the game. Reload the page after making changes to verify they work as
expected.

## Contributing

1. Fork the repository and create a new branch for your feature or fix.
2. Follow the testing steps above to verify your changes locally.
3. Submit a pull request against the default branch with a clear description of
   your changes.

Contributions should follow the existing code style (two-space indentation) and
include documentation updates when relevant.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
