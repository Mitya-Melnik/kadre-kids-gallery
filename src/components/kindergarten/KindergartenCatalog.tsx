import { useRef, useState, useSyncExternalStore } from "react";
import type { SyntheticEvent } from "react";
import AlbumCatalog from "./AlbumCatalog";
import { albumPackages } from "@/config/albumPackages";
import { reachGoal } from "@/lib/analytics";

// Only the kindergarten page opts in. The existing desktop/school catalog stays intact.
const mobileQuery = "(max-width: 767px)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;
type Album = (typeof albumPackages)[number];

function MobileCatalog() {
  const [selectedId, setSelectedId] = useState<Album["id"]>("ten-pages");
  const [previewError, setPreviewError] = useState(false);
  const selectionRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLDetailsElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentAlbum = albumPackages.find((album) => album.id === selectedId) ?? albumPackages[3];
  const imageBase = currentAlbum.image.replace(/\.(webp|jpg|jpeg|png)$/, "");
  const imagePath = `${imageBase}.webp`;
  const additions = "additionalInfo" in currentAlbum ? currentAlbum.additionalInfo : [];
  const includedGraduation = additions.find((item) => item.startsWith("Фотосъёмка выпускного — в подарок"));

  const selectAlbum = (id: Album["id"], fromComparison = false) => {
    videoRef.current?.pause();
    setSelectedId(id);
    setPreviewError(false);
    reachGoal("album_format_select", { audience: "kindergarten", album_id: id, placement: "mobile_catalog" });
    if (fromComparison) {
      if (comparisonRef.current) comparisonRef.current.open = false;
      requestAnimationFrame(() => {
        selectionRef.current?.focus({ preventScroll: true });
        selectionRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };
  const trackDetails = (section: string) => (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (event.currentTarget.open) {
      reachGoal(section === "comparison" ? "album_comparison_open" : "album_details_open", {
        audience: "kindergarten", album_id: selectedId, section, placement: "mobile_catalog",
      });
    } else if (section === "video") {
      videoRef.current?.pause();
    }
  };
  const chooseButton = (album: Album) => (
    <button key={album.id} type="button" className="km-choice"
      aria-pressed={album.id === selectedId} aria-controls="km-selected-album"
      data-album-id={album.id} onClick={() => selectAlbum(album.id)}>
      <span>{album.shortTitle}</span><strong>{album.price}</strong>
      {album.id === selectedId && <span className="km-choice-check" aria-hidden="true">✓</span>}
    </button>
  );

  return (
    <section id="albums" className="km-catalog" aria-labelledby="km-catalog-title">
      <div className="container mx-auto px-4">
        <header className="km-catalog-heading">
          <h2 id="km-catalog-title">Альбомы и цены</h2>
          <p>Пять форматов — выберите, сколько истории сохранить.</p>
          <p className="km-order-terms"><strong>21×30 см · от 10 альбомов</strong><br />Цена указана за один альбом.</p>
        </header>

        <div className="km-options" role="group" aria-label="Выберите формат альбома">
          <div className="km-option-group">
            <h3>Память о группе</h3>
            <div className="km-compact-options">{albumPackages.slice(0, 3).map(chooseButton)}</div>
          </div>
          {albumPackages.slice(3).map((album) => (
            <div className="km-option-group km-option-group-wide" key={album.id}>
              <div className="km-option-caption">
                <h3>{album.title.replace(/ — .+$/, "")}</h3>
                {album.popular && <span className="km-badge">Рекомендуем</span>}
              </div>
              {chooseButton(album)}
            </div>
          ))}
        </div>

        <p className="km-status" role="status" aria-live="polite" aria-atomic="true">
          Выбран {currentAlbum.title}, {currentAlbum.price} за альбом.
        </p>
        <article id="km-selected-album" className="km-selected" ref={selectionRef} tabIndex={-1}
          aria-label={`Выбранный альбом: ${currentAlbum.title}`}>
          <header>
            <h3>{currentAlbum.title}</h3>
            <p className="km-price"><strong>{currentAlbum.price}</strong><span>за альбом</span></p>
            <p>{currentAlbum.comparisonFormat} · Съёмка: {currentAlbum.shootingDays.toLowerCase()}</p>
          </header>
          <figure className="km-preview" key={currentAlbum.id}>
            {previewError ? <p role="status">Пример не загрузился. Откройте изображение по ссылке ниже.</p> : (
              <img src={imagePath} srcSet={`${imageBase}-mobile.webp 600w, ${imagePath} 1000w`}
                sizes="(max-width: 767px) calc(100vw - 64px), 1000px" alt={`Пример альбома «${currentAlbum.title}»`}
                width={1000} height={1000} loading="lazy" decoding="async"
                onError={(event) => {
                  if (event.currentTarget.srcset) {
                    event.currentTarget.srcset = "";
                    event.currentTarget.src = imagePath;
                  } else {
                    setPreviewError(true);
                  }
                }} />
            )}
            <figcaption><a href={imagePath} target="_blank" rel="noopener noreferrer">
              Открыть пример крупно <span className="km-status">в новой вкладке</span>
            </a></figcaption>
          </figure>
          <ul className="km-highlights">{currentAlbum.features.slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}</ul>
          {includedGraduation && <p className="km-included">{includedGraduation}</p>}
          <p className="km-included">Все удачные обработанные электронные фотографии — в подарок.</p>
          <a href="#cta" className="km-action" onClick={() => reachGoal("consultation_click", {
            page: "kindergarten", placement: "mobile_catalog", album_id: selectedId,
          })}>Рассчитать для группы</a>

          <div className="km-details-group" key={`details-${selectedId}`}>
            <details onToggle={trackDetails("contents")}>
              <summary>Что входит в альбом<span aria-hidden="true">⌄</span></summary>
              <div className="km-details-body">
                <p>{currentAlbum.description}</p>
                <p>{currentAlbum.suitableFor}</p>
                <dl>{currentAlbum.items.map((item) => (
                  <div key={item.size}><dt>{item.size}: {item.price}</dt><dd>{item.note}</dd></div>
                ))}</dl>
                <ul>{currentAlbum.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              </div>
            </details>
            {additions.length > 0 && <details onToggle={trackDetails("additions")}>
              <summary>Дополнения и подарки<span aria-hidden="true">⌄</span></summary>
              <div className="km-details-body"><ul>{additions.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </details>}
            <details onToggle={trackDetails("video")}>
              <summary>Смотреть видео альбома<span aria-hidden="true">⌄</span></summary>
              <div className="km-details-body"><video ref={videoRef} src={currentAlbum.video}
                poster={imagePath} controls playsInline preload="none"
                aria-label={`Видео альбома «${currentAlbum.title}»`} /></div>
            </details>
          </div>
        </article>

        <div className="km-details-group km-catalog-more">
          <details ref={comparisonRef} onToggle={trackDetails("comparison")}>
            <summary>Сравнить все 5 форматов<span aria-hidden="true">⌄</span></summary>
            <div className="km-details-body km-comparison">
              {albumPackages.map((album) => <article key={album.id}>
                <h3>{album.title}</h3><p><strong>{album.price}</strong> · {album.comparisonFormat}</p>
                <p>Съёмка: {album.shootingDays.toLowerCase()}</p><p>{album.suitableFor}</p>
                <button type="button" className="km-compare-choice" aria-pressed={album.id === selectedId}
                  onClick={() => selectAlbum(album.id, true)}>Выбрать {album.shortTitle.toLowerCase()}</button>
              </article>)}
            </div>
          </details>
          <details onToggle={trackDetails("common_terms")}>
            <summary>Общие условия заказа<span aria-hidden="true">⌄</span></summary>
            <div className="km-details-body"><ul>
              <li>Формат всех альбомов — 21×30 см. Минимальный тираж — от 10 альбомов.</li>
              <li>Все удачные обработанные электронные фотографии — в подарок.</li>
              <li>Для воспитателей: один альбом бесплатно, второй — со скидкой 50%.</li>
              <li>Доставка до пункта выдачи СДЭК включена.</li>
            </ul></div>
          </details>
        </div>
      </div>
    </section>
  );
}

export default function KindergartenCatalog() {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isMobile ? <MobileCatalog /> : <AlbumCatalog />;
}
