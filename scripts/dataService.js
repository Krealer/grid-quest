export async function loadJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      const msg =
        res.status === 404
          ? `File not found: ${path}`
          : `${res.status} ${res.statusText} (${path})`;
      throw new Error(msg);
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(`Malformed JSON in ${path}: ${err.message}`);
    }
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
    return null;
  }
}
