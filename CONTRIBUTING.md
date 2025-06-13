# Contributing

This guide walks through setting up the development environment so you can run
linting and unit tests locally.

## Prerequisites

- **Node.js** v18 or later should be installed on your system. You can obtain it
  from [nodejs.org](https://nodejs.org/).

## Installing dependencies

From the repository root, install the project dependencies with:

```bash
npm install
```

This command installs ESLint, Prettier, Jest and other packages used during
development. If a `node_modules` directory already exists, you can refresh it
with the helper script which favors cached packages:

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
