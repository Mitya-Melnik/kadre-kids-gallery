export const METRIKA_COUNTER_ID = 112153281;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export const reachGoal = (goal: string, params?: Record<string, unknown>) => {
  window.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal, params);
};

export const trackPageView = (url: string, referer: string) => {
  window.ym?.(METRIKA_COUNTER_ID, "hit", url, {
    title: document.title,
    referer,
  });
};

export const loadMetrika = () => {
  if (window.ym) return;

  window.ym = function (...args: unknown[]) {
    (window.ym as typeof window.ym & { a?: unknown[] }).a ||= [];
    (window.ym as typeof window.ym & { a: unknown[] }).a.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_COUNTER_ID}`;
  document.head.appendChild(script);

  window.ym(METRIKA_COUNTER_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    defer: false,
  });
};
