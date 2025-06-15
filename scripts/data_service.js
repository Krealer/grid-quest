import { showError } from './error_prompt.js';

const cache = new Map();

export async function loadJson(path, fallback) {
  if (cache.has(path)) {
    return cache.get(path);
  }

  function handleError(msg) {
    if (fallback !== undefined) {
      console.error(msg);
      showError(msg);
      cache.set(path, fallback);
      return fallback;
    }
    throw new Error(msg);
  }

  let res;
  try {
    res = await fetch(path);
  } catch (err) {
    return handleError(`Network error while fetching ${path}: ${err.message}`);
  }
  if (!res.ok) {
    const msg =
      res.status === 404
        ? `File not found: ${path}`
        : `${res.status} ${res.statusText} (${path})`;
    return handleError(msg);
  }
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    cache.set(path, data);
    return data;
  } catch (err) {
    return handleError(`Malformed JSON in ${path}: ${err.message}`);
  }
}

export function preloadJson(path) {
  if (!cache.has(path)) {
    loadJson(path).catch(() => {});
  }
}
