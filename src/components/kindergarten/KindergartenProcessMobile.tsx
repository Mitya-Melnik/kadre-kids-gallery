import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { albumSteps } from "@/components/Process";
import { reachGoal } from "@/lib/analytics";
import "./kindergarten-process-mobile.css";

/** Presentation only: the complete six steps still come from the existing Process source. */
export default function KindergartenProcessMobile() {
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);
  const lastTracked = useRef(-1);

  const updateActive = (index: number) => {
    activeRef.current = index;
    setActive(index);
  };
  const goTo = (index: number, focusNavigation = false) => {
    const target = Math.max(0, Math.min(albumSteps.length - 1, index));
    const element = strip.current;
    if (!element) return;
    updateActive(target);
    element.scrollTo({
      left: target * element.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    if (focusNavigation) navigation.current?.querySelector<HTMLButtonElement>(`[data-step="${target}"]`)?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const element = strip.current;
    if (!element) return;
    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!element.clientWidth) return;
        updateActive(Math.max(0, Math.min(albumSteps.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
      });
    };
    const align = () => element.scrollTo({ left: activeRef.current * element.clientWidth, behavior: "instant" });
    element.addEventListener("scroll", sync, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(align);
    observer?.observe(element);
    window.addEventListener("resize", align);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      element.removeEventListener("scroll", sync);
      window.removeEventListener("resize", align);
    };
  }, []);

  useEffect(() => {
    if (lastTracked.current === -1) { lastTracked.current = active; return; }
    if (lastTracked.current !== active) {
      reachGoal("album_process_step_select", { audience: "kindergarten", step: active + 1 });
      lastTracked.current = active;
    }
  }, [active]);

  return (
    <section id="process" className="kgp6 bg-secondary/30 py-20" aria-labelledby="kgp6-title">
      <div className="container mx-auto px-4">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Понятный процесс</p>
          <h2 id="kgp6-title" className="text-3xl font-bold tracking-tight text-foreground">Как всё проходит</h2>
        </header>
        <div className="kgp6-browser" role="region" aria-roledescription="карусель" aria-label="Шесть этапов создания альбома">
          <ol className="kgp6-navigation" ref={navigation} aria-label="Все этапы" onKeyDown={(event) => {
            const target = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-step]");
            if (!target) return;
            const index = Number(target.dataset.step);
            const destination = event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? albumSteps.length - 1 : null;
            if (destination !== null) { event.preventDefault(); goTo(destination, true); }
          }}>
            {albumSteps.map((step, index) => <li key={step.title}>
              <button type="button" data-step={index} aria-current={active === index ? "step" : undefined}
                aria-controls={`kgp6-step-${index}`} onClick={() => goTo(index)}>
                <span className="kgp6-number" aria-hidden="true">{index + 1}</span><span>{step.title}</span>
              </button>
            </li>)}
          </ol>
          <div className="kgp6-strip" ref={strip}>
            {albumSteps.map((step, index) => {
              const Icon = step.icon;
              const timing = "timing" in step ? step.timing : undefined;
              return <div key={step.title} id={`kgp6-step-${index}`} className="kgp6-slide"
                role="group" aria-roledescription="слайд" aria-label={`Шаг ${index + 1} из ${albumSteps.length}: ${step.title}`}
                aria-hidden={active !== index ? true : undefined} ref={(node) => { if (node) node.inert = active !== index; }}>
                <article className="kgp6-card">
                  <div className="kgp6-card-heading"><span className="kgp6-icon"><Icon size={22} aria-hidden="true" /></span><span>Шаг {index + 1}</span></div>
                  <h3>{step.title}</h3>
                  <p className="kgp6-description">{step.description}</p>
                  {timing && <p className="kgp6-timing">{timing}</p>}
                </article>
              </div>;
            })}
          </div>
          <div className="kgp6-controls">
            <button type="button" disabled={active === 0} aria-label="Предыдущий этап" onClick={() => goTo(active - 1)}><ChevronLeft size={22} aria-hidden="true" /></button>
            <p role="status" aria-live="polite" aria-atomic="true">Шаг {active + 1} из {albumSteps.length}</p>
            <button type="button" disabled={active === albumSteps.length - 1} aria-label="Следующий этап" onClick={() => goTo(active + 1)}><ChevronRight size={22} aria-hidden="true" /></button>
          </div>
          <p className="kgp6-hint">Листайте карточки или выберите этап выше</p>
        </div>
      </div>
    </section>
  );
}
