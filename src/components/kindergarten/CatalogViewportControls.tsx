import { useEffect } from "react";

/** Hide duplicate floating controls only while the catalog's own CTA is fully visible.
 * The approved hero and every other page retain their existing controls.
 */
export default function CatalogViewportControls() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    let observer: IntersectionObserver | null = null;
    let section: HTMLElement | null = null;
    let frame = 0;
    const connect = () => {
      observer?.disconnect();
      section?.removeAttribute("data-inline-action-visible");
      section = document.querySelector<HTMLElement>(".km-catalog-v2");
      const action = section?.querySelector<HTMLElement>(".km-v2-action");
      if (!media.matches || !section || !action) return;
      const targetSection = section;
      observer = new IntersectionObserver(([entry]) => {
        targetSection.toggleAttribute("data-inline-action-visible", entry.isIntersecting && entry.intersectionRatio >= 0.99);
      }, { rootMargin: "-80px 0px -96px 0px", threshold: [0, 0.99, 1] });
      observer.observe(action);
    };
    const onChange = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(connect);
    };
    connect();
    media.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      section?.removeAttribute("data-inline-action-visible");
      media.removeEventListener("change", onChange);
    };
  }, []);
  return null;
}
