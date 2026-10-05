import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Native scrolling leaves vertical gestures and text zoom available. */
export default function HomeRail({ children, label }: { children: ReactNode[]; label: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const position = useRef(0);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (width === element.clientWidth) return;
      width = element.clientWidth;
      element.scrollTo({left: position.current * width, behavior: "auto"});
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const go = (index: number) => {
    const element = rail.current;
    if (element) element.scrollTo({left: Math.max(0, Math.min(children.length - 1, index)) * element.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  };
  return <div className="home-rail-wrap">
    <div ref={rail} className="home-rail" role="region" aria-label={label} tabIndex={0}
      onScroll={event => {position.current = Math.max(0, Math.min(children.length - 1, Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))); setCurrent(position.current);}}
      onKeyDown={event => { if(event.target !== event.currentTarget) return; if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1));} }}>
      {children.map((child, index) => <div key={index} className="home-slide" role="group" aria-label={`${index + 1} из ${children.length}`}>{child}</div>)}
    </div>
    <div className="home-rail-controls"><button type="button" aria-label={`Назад: ${label}`} disabled={current === 0} onClick={() => go(current - 1)}><ArrowLeft size={20} /></button><span aria-live="polite">{current + 1} из {children.length}<small>Листайте или нажимайте стрелки</small></span><button type="button" aria-label={`Далее: ${label}`} disabled={current >= children.length - 1} onClick={() => go(current + 1)}><ArrowRight size={20} /></button></div>
  </div>;
}
