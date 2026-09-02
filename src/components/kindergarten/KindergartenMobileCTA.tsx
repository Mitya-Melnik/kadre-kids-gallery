import { Button } from "@/components/ui/button";
import { reachGoal } from "@/lib/analytics";

const KindergartenMobileCTA = () => (
  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
    <Button asChild className="w-full" size="lg">
      <a href="/kindergarten#cta" onClick={(event) => { event.preventDefault(); document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" }); reachGoal("consultation_click", { page: "kindergarten", placement: "mobile_sticky" }); }}>
        Рассчитать стоимость
      </a>
    </Button>
  </div>
);

export default KindergartenMobileCTA;
