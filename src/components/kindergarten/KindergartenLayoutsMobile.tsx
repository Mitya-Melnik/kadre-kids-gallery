import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { layoutDesigns } from "./KindergartenLayouts";
import { kindergartenLayoutPages } from "@/config/kindergartenLayoutPages";
import { MobileSwipeRail } from "./MobileSwipeRail";
import "./kindergarten-layouts-mobile.css";

/** Prefer the small existing image; recover once with the original, then explain the error. */
function LayoutPicture({ base, alt, full = false }: { base: string; alt: string; full?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="kg10-image-error" role="status">Изображение не загрузилось. Попробуйте открыть оригинал.</span>;
  return <img src={`${base}.webp`} srcSet={full ? undefined : `${base}-mobile.webp 600w, ${base}.webp 1000w`}
    sizes="(max-width: 767px) calc(100vw - 32px), 1000px" alt={alt}
    width={1000} height={1000} loading="lazy" decoding="async"
    onError={(event) => {
      if (event.currentTarget.srcset) {
        event.currentTarget.srcset = "";
        event.currentTarget.src = `${base}.webp`;
      } else setFailed(true);
    }} />;
}

/** Mobile-only counterpart. The original desktop grid and dialogs remain untouched. */
export default function KindergartenLayoutsMobile() {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const layout = layoutDesigns[selected];
  const pages = kindergartenLayoutPages[layout.slug];
  const source = (page: string | number) => `/layouts/${layout.slug}/${page}`;
  return <section id="layouts" className="kg10-layouts" aria-labelledby="kg10-layouts-title">
    <header><p className="kg10-eyebrow">12 вариантов оформления</p>
      <h2 id="kg10-layouts-title">Макеты</h2>
      <p>Все макеты подходят к любому пакету из каталога. Выберите дизайн и нажмите на обложку, чтобы посмотреть развороты.</p>
    </header>
    <div className="kg10-layout-tabs" role="group" aria-label="Дизайн альбома">
      {layoutDesigns.map((item, index) => <button key={item.slug} type="button" aria-pressed={index === selected}
        aria-controls="kg10-layout-preview" onClick={() => setSelected(index)}>{item.title}</button>)}
    </div>
    <button ref={opener} type="button" id="kg10-layout-preview" className="kg10-layout-cover"
      aria-label={`Посмотреть макет «${layout.title}»`} onClick={() => setOpen(true)}>
      <LayoutPicture key={layout.slug} base={source("cover")} alt={`${layout.title} — обложка макета`} />
      <span><strong>{layout.title}</strong><span>Открыть все развороты →</span></span>
    </button>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal><Dialog.Overlay className="km-v2-overlay" />
        <Dialog.Content className="km-v2-sheet kg10-layout-sheet kindergarten-mobile-content-v3"
          onOpenAutoFocus={(event) => { event.preventDefault(); close.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus({ preventScroll: true }); }}>
          <header className="km-v2-sheet-heading"><div><Dialog.Title>Макет «{layout.title}»</Dialog.Title>
            <Dialog.Description>Примеры разворотов. Фотографии и данные детей заменяются на материалы вашей группы.</Dialog.Description></div>
            <Dialog.Close asChild><button ref={close} type="button" className="km-v2-close" aria-label="Закрыть макет"><X size={22} aria-hidden="true" /></button></Dialog.Close>
          </header>
          <div className="km-v2-sheet-body">
            <MobileSwipeRail key={layout.slug} count={pages.length} label={`Страницы макета ${layout.title}`} itemLabel="Пример"
              renderItem={(index, active) => <div className="kg10-layout-spread">
                <LayoutPicture base={source(pages[index])} alt={`${layout.title} — макет ${pages[index]}`} full />
                <a tabIndex={active ? 0 : -1} href={`${source(pages[index])}.webp`} target="_blank" rel="noopener noreferrer">Открыть оригинал крупно</a>
              </div>} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </section>;
}
