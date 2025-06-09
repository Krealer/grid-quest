export async function loadJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
    return null;
  }
}
