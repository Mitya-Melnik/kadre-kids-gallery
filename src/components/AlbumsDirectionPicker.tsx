import { Children, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { reachGoal } from "@/lib/analytics";

const query = "(max-width: 767px)";
const subscribe = (listener: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
export const useMobileAlbumSelector = () => useSyncExternalStore(subscribe,
  () => window.matchMedia(query).matches, () => false);

/** Preserve attribution on the mobile selector without forwarding arbitrary query data. */
export function albumDirectionHref(path: string, search: string) {
  const [base, hash] = path.split("#");
  const [pathname, existing] = base.split("?");
  const params = new URLSearchParams(existing);
  const input = new URLSearchParams(search);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid"]) {
    const value = input.get(key);
    if (value) params.set(key, value);
  }
  const result = params.toString();
  return `${pathname}${result ? `?${result}` : ""}${hash ? `#${hash}` : ""}`;
}

type DirectionLabel = { title: string; segment: string };
export default function AlbumsDirectionPicker({ mobile, labels, children }: {
  mobile: boolean; labels: readonly DirectionLabel[]; children: ReactNode;
}) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const strip = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const setIndex = (index: number) => {
    const safe = Math.max(0, Math.min(labels.length - 1, index));
    activeRef.current = safe;
    setActive(safe);
  };
  useEffect(() => {
    const element = strip.current;
    if (!mobile || !element) return;
    let frame = 0;
    const readScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (element.clientWidth) setIndex(Math.round(element.scrollLeft / element.clientWidth));
      });
    };
    const resize = () => element.scrollTo({ left: activeRef.current * element.clientWidth, behavior: "auto" });
    element.addEventListener("scroll", readScroll, { passive: true });
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); element.removeEventListener("scroll", readScroll); };
  }, [mobile, labels.length]);

  const select = (index: number, focus = false) => {
    const safe = Math.max(0, Math.min(labels.length - 1, index));
    setIndex(safe);
    strip.current?.scrollTo({ left: safe * strip.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    if (focus) nav.current?.querySelectorAll<HTMLButtonElement>("button")[safe]?.focus({ preventScroll: true });
    reachGoal("album_segment_preview", { segment: labels[safe].segment, placement: "mobile_selector" });
  };
  const keyNavigation = (event: KeyboardEvent<HTMLDivElement>) => {
    const change = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: labels.length - 1 };
    if (!(event.key in change)) return;
    event.preventDefault(); select(change[event.key as keyof typeof change], true);
  };

  if (!mobile) return <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">{children}</div>;

  return <div className="ad5-picker" role="region" aria-label="Направления выпускных альбомов" aria-roledescription="карусель">
    <div ref={nav} className="ad5-switch" role="group" aria-label="Выберите направление" onKeyDown={keyNavigation}>
      {labels.map((item, index) => <button key={item.segment} type="button" data-direction={item.segment}
        aria-pressed={index === active} aria-controls="ad5-strip" onClick={() => select(index)}>{item.title}</button>)}
    </div>
    <div id="ad5-strip" className="ad5-strip" ref={strip}>
      {slides.map((child, index) => <div key={labels[index].segment} className="ad5-slide" data-slide={labels[index].segment}
        role="group" aria-roledescription="слайд" aria-label={`${index + 1} из ${slides.length}: ${labels[index].title}`}
        aria-hidden={index !== active ? true : undefined} ref={(element) => { if (element) element.inert = index !== active; }}>
        {child}
      </div>)}
    </div>
    <div className="ad5-navigation">
      <button type="button" disabled={active === 0} onClick={() => select(active - 1)} aria-label="Предыдущее направление"><ArrowLeft size={20} aria-hidden="true" /></button>
      <p role="status" aria-live="polite" aria-atomic="true">{active + 1} из {slides.length}<span>Листайте или выберите выше</span></p>
      <button type="button" disabled={active === slides.length - 1} onClick={() => select(active + 1)} aria-label="Следующее направление"><ArrowRight size={20} aria-hidden="true" /></button>
    </div>
  </div>;
}
