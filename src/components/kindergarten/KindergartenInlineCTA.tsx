import { Button } from "@/components/ui/button";
import { reachGoal } from "@/lib/analytics";

const KindergartenInlineCTA = () => (
  <section className="bg-background pb-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-7 text-center md:flex-row md:text-left">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Хотите такой альбом для своей группы?</h2>
          <p className="mt-2 text-muted-foreground">Чтобы успеть провести съёмку и получить тираж к выпускному, дату лучше забронировать заранее.</p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <a href="/kindergarten#cta" onClick={(event) => { event.preventDefault(); document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" }); reachGoal("consultation_click", { page: "kindergarten", placement: "layouts" }); }}>
            Узнать свободные даты
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default KindergartenInlineCTA;
