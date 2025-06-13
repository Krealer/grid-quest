export async function loadJson(path, fallback) {
  let res;
  try {
    res = await fetch(path);
  } catch (err) {
    const msg = `Network error while fetching ${path}: ${err.message}`;
    if (fallback !== undefined) {
      console.error(msg);
      return fallback;
    }
    throw new Error(msg);
  }
  if (!res.ok) {
    const msg =
      res.status === 404
        ? `File not found: ${path}`
        : `${res.status} ${res.statusText} (${path})`;
    if (fallback !== undefined) {
      console.error(msg);
      return fallback;
    }
    throw new Error(msg);
  }
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    const msg = `Malformed JSON in ${path}: ${err.message}`;
    if (fallback !== undefined) {
      console.error(msg);
      return fallback;
    }
    throw new Error(msg);
  }
}
