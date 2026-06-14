// localStorage-backed cache with stale-while-revalidate support.
// Data older than STALE_MS is evicted (treated as missing); within that window
// it is returned immediately so the UI renders at once, while the caller also
// fires a fresh network request in the background.

const STALE_MS = 30 * 60 * 1000; // 30 minutes

export function peekCache(key) {
  try {
    const raw = localStorage.getItem(`enderek:${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > STALE_MS) {
      localStorage.removeItem(`enderek:${key}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(`enderek:${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // Quota exceeded or private browsing — fail silently, caching is best-effort
  }
}

export function burstCache(key) {
  try {
    localStorage.removeItem(`enderek:${key}`);
  } catch {}
}
