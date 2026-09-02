import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { loadMetrika, reachGoal } from "@/lib/analytics";

const STORAGE_KEY = "detivkadre-analytics-consent";
type Consent = "accepted" | "declined" | null;

const AnalyticsConsent = () => {
  const [consent, setConsent] = useState<Consent>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Consent;
    setConsent(saved);
    setIsReady(true);
    if (saved === "accepted") loadMetrika();
  }, []);

  useEffect(() => {
    const trackLink = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.href;
      if (href.startsWith("tel:")) reachGoal("phone_click");
      else if (href.includes("seenday.com")) reachGoal("seenday_open");
      else if (href.includes("max.ru")) reachGoal("max_open");
      else if (href.includes("vk.com")) reachGoal("vk_open");
    };
    document.addEventListener("click", trackLink);
    return () => document.removeEventListener("click", trackLink);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    if (value === "accepted") loadMetrika();
  };

  if (!isReady || consent) return null;

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur md:bottom-5 md:p-5" aria-label="Настройки аналитики">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Мы используем Яндекс Метрику, чтобы понимать, как улучшать сайт. Аналитика включится только с вашего согласия. Подробнее — в{" "}
          <Link to="/privacy#cookies" className="font-medium text-primary underline">политике обработки данных</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => choose("declined")}>Только необходимые</Button>
          <Button type="button" size="sm" onClick={() => choose("accepted")}>Разрешить аналитику</Button>
        </div>
      </div>
    </aside>
  );
};

export default AnalyticsConsent;
