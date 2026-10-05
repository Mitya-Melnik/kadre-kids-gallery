import { Check } from "lucide-react";
import { audiences } from "@/components/Advantages";
import HomeRail from "./HomeRail";

export default function HomeMobileAdvantages() {
  return <section id="advantages" className="home-mobile-advantages bg-background">
    <div className="container mx-auto px-4">
      <header><h2>Почему выбирают «Дети в кадре»</h2><p className="text-muted-foreground">Детям комфортно, родителям удобно, учреждению — минимум организационной работы.</p></header>
      <HomeRail label="Почему выбирают Дети в кадре">
        {audiences.map(audience => {
          const Icon = audience.icon;
          return <article key={audience.label} className="flex h-full flex-col rounded-2xl border border-border bg-gradient-card p-5 shadow-soft">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${audience.accent}`}><Icon size={24} aria-hidden="true" /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-dark">{audience.label}</p>
            <h3 className="mt-2 text-[22px] font-bold leading-tight">{audience.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{audience.description}</p>
            <ul className="mt-5 space-y-3 border-t border-border pt-5">{audience.points.map(point => <li key={point} className="flex items-start gap-3 text-sm leading-relaxed"><Check size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" />{point}</li>)}</ul>
          </article>;
        })}
      </HomeRail>
    </div>
  </section>;
}
