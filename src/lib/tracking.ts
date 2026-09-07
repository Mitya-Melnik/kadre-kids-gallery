const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid"] as const;
const STORAGE_KEY = "detivkadre-entry-tracking";

export const rememberEntryTracking = () => {
  const current = new URLSearchParams(window.location.search);
  const tracking = Object.fromEntries(TRACKING_KEYS.flatMap((key) => current.get(key) ? [[key, current.get(key)!]] : []));
  if (Object.keys(tracking).length) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
};

export const withSavedTracking = (href: string) => {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>;
    const current = new URLSearchParams(window.location.search);
    const url = new URL(href, window.location.origin);
    TRACKING_KEYS.forEach((key) => {
      const value = current.get(key) || stored[key];
      if (!url.searchParams.has(key) && value) url.searchParams.set(key, value);
    });
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
};
