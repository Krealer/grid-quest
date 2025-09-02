export function rollbackTo(version) {
  const fs = require('fs-extra');
  const path = require('path');

  const base = path.resolve(__dirname, '../');
  const versionPath = path.resolve(__dirname, `../versions/${version}`);

  if (!fs.existsSync(versionPath)) {
    console.error(`Version ${version} does not exist.`);
    return;
  }

  // Copy everything back
  fs.copySync(versionPath, base, {
    overwrite: true,
    filter: (src) => !src.includes('/versions/')
  });

  console.log(`Rolled back to version ${version}`);
}
