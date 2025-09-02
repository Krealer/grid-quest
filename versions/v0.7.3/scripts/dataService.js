export async function loadJson(path) {
  let res;
  try {
    res = await fetch(path);
  } catch (err) {
    throw new Error(`Network error while fetching ${path}: ${err.message}`);
  }
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
}
