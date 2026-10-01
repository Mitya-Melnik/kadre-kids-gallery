import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import "./kindergarten-swipes-v7.css";

/** Native scrolling keeps vertical page gestures and browser zoom available.
 * All content stays mounted. Equal-height slides grow with the longest item;
 * no clipped text, autoplay, gesture library or duplicated content source.
 */
export function MobileSwipeRail({ count, label, itemLabel, renderItem, className = "" }: {
  count: number;
  label: string;
  itemLabel: string;
  renderItem: (index: number, active: boolean) => ReactNode;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const id = useId();
  const select = (index: number) => {
    const next = Math.max(0, Math.min(index, count - 1));
    rail.current?.scrollTo({ left: next * rail.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => {
    const element = rail.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    let width = element.clientWidth;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (width === element.clientWidth) return;
      width = element.clientWidth;
      const selected = Math.min(position.current, count - 1);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => element.scrollTo({ left: selected * width, behavior: "auto" }));
    });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [count]);
  if (!count) return null;
  return <div className={`kg7-swipe ${className}`} data-current={current}>
    <div id={id} ref={rail} className="kg7-rail" role="region" aria-roledescription="карусель"
      aria-label={label} tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        const next = event.key === "ArrowRight" ? current + 1 : event.key === "ArrowLeft" ? current - 1
          : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
        if (next !== null) { event.preventDefault(); select(next); }
      }}
      onScroll={(event) => {
        const element = event.currentTarget;
        if (!element.clientWidth) return;
        const next = Math.max(0, Math.min(count - 1, Math.round(element.scrollLeft / element.clientWidth)));
        position.current = next;
        setCurrent(next);
      }}>
      {Array.from({ length: count }, (_, index) => <div key={index} className="kg7-slide"
        role="group" aria-roledescription="слайд" aria-label={`${itemLabel} ${index + 1} из ${count}`}
        aria-hidden={index !== current}>
        {renderItem(index, index === current)}
      </div>)}
    </div>
    {count > 1 && <div className="kg7-controls">
      <button type="button" aria-label="Предыдущая карточка" aria-controls={id} disabled={current === 0}
        onClick={() => select(current - 1)}><ArrowLeft size={22} aria-hidden="true" /></button>
      <div><p role="status" aria-live="polite" aria-atomic="true">{itemLabel} {current + 1} из {count}</p>
        <span>Листайте или нажимайте стрелки</span></div>
      <button type="button" aria-label="Следующая карточка" aria-controls={id} disabled={current === count - 1}
        onClick={() => select(current + 1)}><ArrowRight size={22} aria-hidden="true" /></button>
    </div>}
  </div>;
}

type AlbumImage = { src: string; mobileSrc: string; alt: string };
export function MobileAlbumSpreads({ images }: { images: readonly AlbumImage[] }) {
  const [zoomed, setZoomed] = useState<AlbumImage | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  // The existing reader controller covers reviews, but not this case subsection.
  useEffect(() => {
    const target = root.current;
    const page = target?.closest(".kindergarten-mobile-content-v3");
    if (!target || !page || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      page.toggleAttribute("data-kg7-reading", entry.isIntersecting);
    }, { rootMargin: "-96px 0px -180px 0px", threshold: 0 });
    observer.observe(target);
    return () => { observer.disconnect(); page.removeAttribute("data-kg7-reading"); };
  }, []);
  return <div ref={root} className="kg7-spreads">
    <MobileSwipeRail count={images.length} label="История группы внутри альбома" itemLabel="Разворот"
      renderItem={(index, active) => {
        const image = images[index];
        return <button type="button" className="kg7-spread-button" tabIndex={active ? 0 : -1}
          aria-label={`Увеличить: ${image.alt}`} onClick={(event) => { opener.current = event.currentTarget; setZoomed(image); }}>
          <picture><source media="(max-width: 767px)" srcSet={image.mobileSrc} />
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
          </picture>
          <span className="kg7-expand" aria-hidden="true"><Expand size={22} /></span>
        </button>;
      }} />
    <Dialog.Root open={zoomed !== null} onOpenChange={(open) => { if (!open) setZoomed(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="kg3-lightbox-overlay" />
        <Dialog.Content className="kg3-lightbox kg7-lightbox"
          onOpenAutoFocus={(event) => { event.preventDefault(); closeButton.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }); }}>
          <header><Dialog.Title>История группы внутри альбома</Dialog.Title>
            <Dialog.Close asChild><button type="button" ref={closeButton} aria-label="Закрыть разворот"><X size={24} aria-hidden="true" /></button></Dialog.Close>
          </header>
          <Dialog.Description className="sr-only">{zoomed?.alt}</Dialog.Description>
          {zoomed && <><div className="kg3-lightbox-photo"><img className="kg3-lightbox-image" src={zoomed.src} alt={zoomed.alt} /></div>
            <a className="kg7-original" href={zoomed.src} target="_blank" rel="noopener noreferrer">Открыть оригинал в новой вкладке</a></>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
