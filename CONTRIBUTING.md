# Contributing

This guide walks through setting up the development environment so you can run
linting and unit tests locally.

GitHub Pages serves only the static files in this repository (HTML, CSS and
JavaScript). The Node-based dependencies described below are used solely for
development tasks like linting and testing and are not part of the deployed
site.

## Prerequisites

- **Node.js** v18 or later should be installed on your system. You can obtain it
  from [nodejs.org](https://nodejs.org/).

## Installing dependencies

From the repository root, install the project dependencies with:

```bash
npm install
```

This command installs ESLint, Prettier, Jest and other packages used during
development. These tools help maintain code quality but are not included in the
GitHub Pages deployment. If a `node_modules` directory already exists, you can
refresh it with the helper script which favors cached packages:

```bash
./scripts/setup_dev.sh
```

## Running checks

After installing dependencies, run the lint and test suites to verify your
environment:

```bash
npm run lint
npm test
```

Both commands should complete without errors before you submit a pull request.

## File naming

Name new files using `snake_case` to keep the repository consistent.
