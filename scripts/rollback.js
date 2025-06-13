export async function rollbackTo(version) {
  // Guard against executing in a browser environment
  if (typeof window !== 'undefined') {
    console.warn('Rollback is not supported in the browser.');
    return;
  }

  const fsExtra = await import('fs-extra');
  const path = await import('path');

  const fs = fsExtra.default || fsExtra;
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
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
