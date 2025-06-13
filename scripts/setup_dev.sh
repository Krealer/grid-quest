#!/bin/bash
# setup_dev.sh - install Node.js dependencies

# Use npm ci when node_modules exists, otherwise npm install

set -e

if [ -d node_modules ]; then
    echo "node_modules already exists, running 'npm ci --prefer-offline' to refresh"
    npm ci --prefer-offline --no-audit
else
    echo "Installing dependencies via 'npm install'"
    npm install --prefer-offline --no-audit
fi

