import { useRef, useState, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Check, Expand, Play, X } from "lucide-react";
import AlbumCatalog from "./AlbumCatalog";
import { albumPackages } from "@/config/albumPackages";
import { reachGoal } from "@/lib/analytics";
import "./kindergarten-catalog-v2.css";

// Opt-in only: desktop and school pages keep their original catalog.
const mobileQuery = "(max-width: 767px)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;
type Album = (typeof albumPackages)[number];
type Panel = "details" | "comparison" | "video" | "image";

// Short presentation of existing contents, not a second price/product source.
// Full contents, prices, images and additions always come from albumPackages.
const highlights: Record<Album["id"], readonly string[]> = {
  folder: ["Портрет ребёнка", "Ребёнок и одногруппники", "Воспитатели и общая фотография"],
  trio: ["Портрет ребёнка", "Фотографии с друзьями", "Воспитатели и общая фотография"],
  "six-pages": ["Индивидуальный портрет ребёнка", "Друзья, воспитатели и общая фотография", "2 страницы групповых фотографий"],
  "ten-pages": ["Индивидуальный разворот ребёнка", "3 индивидуальных портрета", "6 страниц групповых фотографий"],
  "fourteen-pages": ["10 страниц групповых фотографий", "Персональное «Письмо в будущее»", "Фото выпускного включено в 3 дня съёмки"],
};
const shortName = (album: Album) => album.title.replace(/ — \d+ страниц$/, "");
const panelTitles: Record<Panel, string> = {
  details: "Состав и дополнения", comparison: "Сравнить 5 форматов",
  video: "Видео альбома", image: "Пример альбома",
};
const scrollBehavior = (): ScrollBehavior => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function MobileCatalog() {
  const [selectedId, setSelectedId] = useState<Album["id"]>("ten-pages");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const panelTitle = useRef<HTMLHeadingElement>(null);
  const catalog = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const currentAlbum = albumPackages.find((album) => album.id === selectedId) ?? albumPackages[3];
  const imageBase = currentAlbum.image.replace(/\.(webp|jpg|jpeg|png)$/, "");
  const imagePath = `${imageBase}.webp`;
  const additions = "additionalInfo" in currentAlbum ? currentAlbum.additionalInfo : [];

  const selectAlbum = (id: string) => {
    const album = albumPackages.find((item) => item.id === id);
    if (!album || album.id === selectedId) return;
    setSelectedId(album.id);
    setPreviewError(false);
    setVideoError(false);
    reachGoal("album_format_select", { audience: "kindergarten", album_id: album.id, placement: "mobile_catalog_tabs" });
  };
  const openPanel = (kind: Panel, event: MouseEvent<HTMLButtonElement>) => {
    returnFocus.current = event.currentTarget;
    setPanel(kind);
    reachGoal(kind === "comparison" ? "album_comparison_open" : "album_details_open", {
      audience: "kindergarten", album_id: selectedId, section: kind, placement: "mobile_catalog_tabs",
    });
  };
  const closePanel = () => {
    video.current?.pause();
    setPanel(null);
  };
  const chooseFromComparison = (album: Album) => {
    selectAlbum(album.id);
    returnFocus.current = catalog.current?.querySelector<HTMLElement>(`[data-album-id="${album.id}"]`) ?? null;
    closePanel();
  };
  const scrollToForm = (event: MouseEvent<HTMLAnchorElement>) => {
    // <base href="/"> must not send this link to the home page or drop UTM.
    event.preventDefault();
    document.getElementById("cta")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    reachGoal("consultation_click", { page: "kindergarten", placement: "mobile_catalog", album_id: selectedId });
  };

  return (
    <section id="albums" ref={catalog} className="km-catalog km-catalog-v2" aria-labelledby="km-catalog-title">
      <div className="km-v2-container">
        <header className="km-v2-heading">
          <h2 id="km-catalog-title">Альбомы и цены</h2>
          <p>21×30 см · заказ от 10 альбомов</p>
        </header>
        <Tabs.Root value={selectedId} onValueChange={selectAlbum} className="km-v2-browser">
          <Tabs.List className="km-v2-tabs" aria-label="Формат альбома">
            {albumPackages.map((album) => (
              <Tabs.Trigger key={album.id} value={album.id} className="km-v2-tab" data-album-id={album.id}>
                {album.shortTitle.includes("страниц")
                  ? <><span>{album.shortTitle.split(" ")[0]}</span><span>страниц</span></>
                  : <span>{album.shortTitle}</span>}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Tabs.Content value={selectedId} className="km-v2-card" data-selected-album={selectedId}>
            <header className="km-v2-card-heading">
              <div className="km-v2-name">
                <span className="km-v2-badge" style={{ visibility: currentAlbum.popular ? "visible" : "hidden" }}>Рекомендуем</span>
                <h3>{shortName(currentAlbum)}</h3>
              </div>
              <p className="km-v2-price"><strong>{currentAlbum.price}</strong><span>за альбом</span></p>
            </header>
            <p className="km-v2-specs">{currentAlbum.comparisonFormat} · Съёмка: {currentAlbum.shootingDays.toLowerCase()}</p>
            <figure className="km-v2-media">
              <button type="button" className="km-v2-preview" data-open="image"
                aria-label={`Открыть крупно пример: ${currentAlbum.title}`} onClick={(event) => openPanel("image", event)}>
                {previewError ? <span className="km-v2-image-error">Пример не загрузился. Нажмите, чтобы открыть отдельно.</span> : (
                  <img key={imagePath} src={imagePath} srcSet={`${imageBase}-mobile.webp 600w, ${imagePath} 1000w`}
                    sizes="(max-width: 767px) 320px, 1000px" alt={`Пример альбома «${currentAlbum.title}»`}
                    width={1000} height={1000} loading="lazy" decoding="async"
                    onError={(event) => {
                      if (event.currentTarget.srcset) { event.currentTarget.srcset = ""; event.currentTarget.src = imagePath; }
                      else setPreviewError(true);
                    }} />
                )}
                <span className="km-v2-expand" aria-hidden="true"><Expand size={20} /></span>
              </button>
              <button type="button" className="km-v2-video" data-open="video" onClick={(event) => openPanel("video", event)}>
                <Play size={16} aria-hidden="true" /> Видео
              </button>
            </figure>
            <ul className="km-v2-highlights">
              {highlights[selectedId].map((text) => <li key={text}><Check size={17} aria-hidden="true" /><span>{text}</span></li>)}
            </ul>
            <p className="km-v2-gift">Все удачные электронные фото — в подарок</p>
            <a href="/kindergarten#cta" className="km-v2-action" onClick={scrollToForm}>Рассчитать для группы</a>
            <div className="km-v2-secondary">
              <button type="button" data-open="details" onClick={(event) => openPanel("details", event)}>Состав и дополнения</button>
              <button type="button" data-open="comparison" onClick={(event) => openPanel("comparison", event)}>Сравнить</button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <Dialog.Root open={panel !== null} onOpenChange={(open) => { if (!open) closePanel(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="km-v2-overlay" />
          <Dialog.Content className="km-v2-sheet" data-panel={panel ?? undefined}
            onOpenAutoFocus={(event) => { event.preventDefault(); panelTitle.current?.focus({ preventScroll: true }); }}
            onCloseAutoFocus={(event) => { event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true }); }}>
            <header className="km-v2-sheet-heading">
              <div>
                <Dialog.Title ref={panelTitle} tabIndex={-1}>{panel ? panelTitles[panel] : "Альбом"}</Dialog.Title>
                <Dialog.Description>{panel === "comparison" ? "Цены за один альбом · заказ от 10 экземпляров" : `${currentAlbum.title} · ${currentAlbum.price}`}</Dialog.Description>
              </div>
              <Dialog.Close asChild><button type="button" className="km-v2-close" aria-label="Закрыть панель"><X size={24} aria-hidden="true" /></button></Dialog.Close>
            </header>
            <div className="km-v2-sheet-body">
              {panel === "details" && <>
                <p>{currentAlbum.description}. {currentAlbum.suitableFor}.</p>
                <dl>{currentAlbum.items.map((item) => <div key={item.size}><dt>{item.size}: {item.price}</dt><dd>{item.note}</dd></div>)}</dl>
                <h3>Входит в стоимость</h3>
                <ul>{currentAlbum.features.map((text) => <li key={text}>{text}</li>)}</ul>
                {additions.length > 0 && <><h3>Дополнения и условия бонусов</h3><ul>{additions.map((text) => <li key={text}>{text}</li>)}</ul></>}
                <h3>Общие условия</h3>
                <ul>
                  <li>Формат — 21×30 см. Минимальный тираж — от 10 альбомов.</li>
                  <li>Все удачные обработанные электронные фотографии — в подарок.</li>
                  <li>Для воспитателей: один альбом бесплатно, второй — со скидкой 50%.</li>
                  <li>Доставка до пункта выдачи СДЭК включена.</li>
                </ul>
              </>}
              {panel === "comparison" && <div className="km-v2-comparison">
                {albumPackages.map((album) => <article key={album.id}>
                  <div className="km-v2-compare-heading"><h3>{shortName(album)}</h3><strong>{album.price}</strong></div>
                  <p>{album.comparisonFormat} · Съёмка: {album.shootingDays.toLowerCase()}</p>
                  <p>{album.suitableFor}</p>
                  <button type="button" className="km-v2-compare-choice" data-compare-id={album.id}
                    aria-pressed={album.id === selectedId} onClick={() => chooseFromComparison(album)}>
                    {album.id === selectedId ? "Выбран — вернуться" : `Выбрать ${album.shortTitle === "Папка" ? "папку" : album.shortTitle.toLowerCase()}`}
                  </button>
                </article>)}
              </div>}
              {panel === "video" && <>
                <video ref={video} src={currentAlbum.video} poster={imagePath} controls playsInline preload="none"
                  aria-label={`Видео альбома «${currentAlbum.title}»`} onError={() => setVideoError(true)}
                  onPlay={() => reachGoal("album_video_play", { audience: "kindergarten", album_id: selectedId, placement: "mobile_catalog_tabs" })} />
                {videoError && <p role="status">Видео не удалось загрузить. Попробуйте открыть файл отдельно.</p>}
                <a className="km-v2-original" href={currentAlbum.video} target="_blank" rel="noopener noreferrer">Открыть видео в новой вкладке</a>
              </>}
              {panel === "image" && <>
                <img className="km-v2-large-image" src={imagePath} alt={`Пример альбома «${currentAlbum.title}»`} width={1000} height={1000} />
                <a className="km-v2-original" href={imagePath} target="_blank" rel="noopener noreferrer">Открыть оригинал в новой вкладке</a>
              </>}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

export default function KindergartenCatalog() {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isMobile ? <MobileCatalog /> : <AlbumCatalog />;
}
