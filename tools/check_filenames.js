import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const ignoreDirs = new Set(['node_modules', 'versions', '.git']);
let failed = false;

function checkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      if (!/^[a-z0-9_]+(\.[a-z0-9_]+)*\.js$/.test(entry.name)) {
        console.error(`Invalid filename: ${path.relative(rootDir, fullPath)}`);
        failed = true;
      }
    }
  }
}

checkDir(rootDir);
if (failed) {
  process.exit(1);
}
