import { useEffect } from "react";
import "./kindergarten-content-controls.css";

/** The new reading areas do not compete with the floating contact shortcuts.
 * The bottom enquiry bar remains available. Hero/catalog controls are unchanged.
 */
export default function MobileContentViewportControls() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".kindergarten-mobile-content-v3");
    if (!root || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      root.toggleAttribute("data-kg3-reading", visible.size > 0);
    }, { rootMargin: "-96px 0px -180px 0px", threshold: 0 });
    root.querySelectorAll(".kg3-gallery, .kg3-reviews, .kg3-faq, .kg3-advantages-wrap").forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      root.removeAttribute("data-kg3-reading");
    };
  }, []);
  return null;
}
