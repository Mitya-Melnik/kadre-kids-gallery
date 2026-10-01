import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { MobileSwipeRail } from "@/components/kindergarten/MobileSwipeRail";
import { grade4Layouts } from "./Grade4Layouts";
import { schoolLayouts } from "./SchoolLayouts";

/** Uses the same six designs and all pages as the desktop, without a second asset list. */
export default function SchoolLayoutsMobile({ audience = "grade4" }: { audience?: "grade4" | "school" }) {
  const senior = audience === "school";
  const layouts = senior ? schoolLayouts : grade4Layouts;
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const layout = layouts[selected];
  const source = (page: number) => `/${senior ? "layouts-school" : "layouts-grade4"}/${layout.slug}/${page}`;
  const picture = (page: number, full = false) => <picture>
    {!full && <source media="(max-width: 767px)" srcSet={`${source(page)}-mobile.webp`} />}
    <img src={`${source(page)}.webp`} alt={`${layout.title} — пример оформления выпускного альбома для ${senior ? "9–11 классов" : "4 класса"}, страница ${page}`}
      loading={page === 1 ? "eager" : "lazy"} decoding="async" />
  </picture>;
  return <section id="layouts" className="g4-section g4-layouts" aria-labelledby="g4-layouts-title">
    <header><p className="g4-eyebrow">6 вариантов оформления</p>
      <h2 id="g4-layouts-title">{senior ? "Макеты школьных альбомов" : "Макеты альбомов для 4 класса"}</h2>
      <p>Выберите стиль, который подходит вашему классу. Нажмите на обложку, чтобы посмотреть альбом целиком.</p>
    </header>
    <div className="g4-layout-tabs" role="group" aria-label="Дизайн альбома">
      {layouts.map((item, index) => <button key={item.slug} type="button" aria-pressed={index === selected}
        aria-controls="g4-layout-preview" onClick={() => setSelected(index)}>{item.title}</button>)}
    </div>
    <button ref={opener} type="button" id="g4-layout-preview" className="g4-layout-cover"
      aria-label={`Посмотреть макет «${layout.title}»`} onClick={() => setOpen(true)}>
      {picture(1)}<span><strong>{layout.title}</strong><span>Открыть все развороты →</span></span>
    </button>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal><Dialog.Overlay className="km-v2-overlay" />
        <Dialog.Content className="km-v2-sheet g4-layout-sheet kindergarten-mobile-content-v3"
          onOpenAutoFocus={(event) => { event.preventDefault(); close.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
          <header className="km-v2-sheet-heading"><div><Dialog.Title>Макет «{layout.title}»</Dialog.Title>
            <Dialog.Description>Обложка и примеры разворотов. Фотографии, имена и данные выпускников заменяются на материалы вашего класса.</Dialog.Description></div>
            <Dialog.Close asChild><button ref={close} type="button" className="km-v2-close" aria-label="Закрыть макет"><X size={22} aria-hidden="true" /></button></Dialog.Close>
          </header>
          <div className="km-v2-sheet-body">
            <MobileSwipeRail key={layout.slug} count={layout.imageCount} label={`Страницы макета ${layout.title}`} itemLabel="Пример"
              renderItem={(index, active) => <div className="g4-layout-spread">{picture(index + 1, true)}
                <a tabIndex={active ? 0 : -1} href={`${source(index + 1)}.webp`} target="_blank" rel="noopener noreferrer">Открыть оригинал крупно</a>
              </div>} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </section>;
}
