import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CTA from "@/components/CTA";
import { reachGoal } from "@/lib/analytics";

export default function HomeMobileEnquiry() {
  const [direction, setDirection] = useState<"photo-day" | "album" | null>(null);
  const open = (next: "photo-day" | "album") => {setDirection(next); reachGoal("product_select", {product:next, placement:"home_enquiry"});};
  return <>
    <section id="cta" className="bg-accent-soft px-4">
      <h2>Обсудим вашу съёмку</h2>
      <p className="mt-3 text-muted-foreground">Подберём формат и свободную дату для вашего сада или школы.</p>
      <div className="mt-5 grid gap-3"><Button size="lg" onClick={() => open("photo-day")}>Организовать фотодень</Button><Button size="lg" variant="outline" onClick={() => open("album")}>Рассчитать выпускные альбомы</Button></div>
      <p className="mt-4 text-sm text-muted-foreground">Ответим в течение рабочего дня. Без обязательств.</p>
    </section>
    <Dialog open={direction !== null} onOpenChange={value => {if(!value) setDirection(null);}}>
      <DialogContent className="home-enquiry-dialog max-h-[90dvh] overflow-y-auto rounded-t-2xl p-5">
        <DialogTitle className="pr-6 text-2xl font-bold">{direction === "album" ? "Рассчитаем альбомы" : "Организуем фотодень"}</DialogTitle>
        <DialogDescription>Оставьте контакты — уточним детали и предложим подходящий вариант.</DialogDescription>
        {direction && <CTA key={direction} fixedDirection={direction} compactMobile />}
      </DialogContent>
    </Dialog>
  </>;
}
