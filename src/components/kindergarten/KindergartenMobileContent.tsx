import { useRef, useState, useSyncExternalStore } from "react";
import type { ComponentType, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

const query = "(max-width: 767px)";
const subscribe = (listener: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;
export const useKindergartenMobile = () => useSyncExternalStore(subscribe, snapshot, serverSnapshot);

/** The existing advantages remain the content source. Only their presentation changes. */
export function MobileAdvantages({ children }: { children: ReactNode }) {
  return <div className="kg3-advantages-wrap"><details className="kg3-disclosure kg3-advantages">
    <summary>Почему выбирают «Дети в кадре»</summary>
    {children}
  </details></div>;
}

type Review = { id: number; name: string; role: string; text: string; initials: string };
function ReviewCard({ review }: { review: Review }) {
  return <figure className="kg3-review" data-kg3-review={review.id}>
    <blockquote>{review.text}</blockquote>
    <figcaption><strong>{review.name}</strong><span>{review.role}</span></figcaption>
  </figure>;
}
export function MobileReviews({ testimonials }: { testimonials: Review[] }) {
  // Use existing reviews verbatim: comfort of a shy child and organisation.
  const preferred = [7, 2].flatMap((id) => testimonials.filter((item) => item.id === id));
  const first = [...preferred, ...testimonials.filter((item) => !preferred.includes(item))].slice(0, 2);
  const rest = testimonials.filter((item) => !first.includes(item));
  return <section className="kg3-section kg3-reviews bg-gradient-card" aria-labelledby="kg3-reviews-title">
    <div className="container mx-auto px-4">
      <h2 id="kg3-reviews-title">Отзывы</h2>
      <div className="kg3-review-list">{first.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
      {rest.length > 0 && <details className="kg3-disclosure kg3-more-reviews">
        <summary>Остальные отзывы ({rest.length})</summary>
        <div className="kg3-review-list">{rest.map((review) => <ReviewCard key={review.id} review={review} />)}</div>
      </details>}
    </div>
  </section>;
}

type Question = { question: string; answer: ReactNode };
export function MobileQuestions({ items }: { items: Question[] }) {
  const priority = ["Что входит в стоимость?", "Как родители выбирают портрет ребёнка?", "Что делать, если ребёнок пропустил съёмку?", "Когда будут готовы альбомы?"];
  const first = priority.flatMap((question) => items.filter((item) => item.question === question));
  const rest = items.filter((item) => !priority.includes(item.question));
  const render = (item: Question) => <details className="kg3-question kg3-disclosure" key={item.question} data-kg3-question>
    <summary>{item.question}</summary><div className="kg3-answer">{item.answer}</div>
  </details>;
  return <section id="kindergarten-faq" className="kg3-section kg3-faq bg-accent-soft" aria-labelledby="kg3-faq-title">
    <div className="container mx-auto px-4">
      <h2 id="kg3-faq-title">Ответы на вопросы</h2>
      <p className="kg3-intro">Самые частые вопросы от родителей и администрации детских садов</p>
      <div className="kg3-question-list">{first.map(render)}</div>
      {rest.length > 0 && <details className="kg3-disclosure kg3-more-questions">
        <summary>Остальные вопросы ({rest.length})</summary>
        <div className="kg3-question-list">{rest.map(render)}</div>
      </details>}
    </div>
  </section>;
}

type StoryImage = { imageNumber?: number; slug?: string; alt: string; kind: "portrait" | "group" | "life" };
type PictureProps = { image: StoryImage; className: string; loading: "eager" | "lazy" };
const categories: { kind: StoryImage["kind"]; label: string }[] = [
  { kind: "portrait", label: "Портреты" }, { kind: "group", label: "Друзья" }, { kind: "life", label: "Жизнь группы" },
];
export function MobileStoryGallery({ images, Picture }: { images: StoryImage[]; Picture: ComponentType<PictureProps> }) {
  const [kind, setKind] = useState<StoryImage["kind"]>("portrait");
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const photos = images.filter((image) => image.kind === kind);
  const selected = photos[current] ?? photos[0];
  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, photos.length - 1));
    setCurrent(next);
    rail.current?.scrollTo({ left: next * rail.current.clientWidth, behavior: zoomed || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const navigation = (modal = false) => <div className="kg3-photo-controls">
    <button type="button" aria-label="Предыдущая фотография" disabled={current === 0} onClick={() => goTo(current - 1)}><ArrowLeft size={22} aria-hidden="true" /></button>
    <p role="status" aria-live="polite">{current + 1} из {photos.length}{!modal && <span>Листайте или нажимайте стрелки</span>}</p>
    <button type="button" aria-label="Следующая фотография" disabled={current === photos.length - 1} onClick={() => goTo(current + 1)}><ArrowRight size={22} aria-hidden="true" /></button>
  </div>;
  return <section id="gallery" className="kg3-section kg3-gallery bg-secondary/50" aria-labelledby="kg3-gallery-title">
    <div className="container mx-auto px-4">
      <header>
        <h2 id="kg3-gallery-title">Живые фотографии для выпускных альбомов</h2>
        <p className="kg3-intro">Портреты, друзья, игры и знакомые моменты из жизни группы — всё, что делает альбом личной историей детей.</p>
      </header>
      <div className="kg3-photo-filters" role="group" aria-label="Какие фотографии показать">
        {categories.map((category) => <button type="button" key={category.kind} aria-pressed={kind === category.kind} aria-controls="kg3-photo-strip"
          onClick={() => { setKind(category.kind); setCurrent(0); }}>{category.label}</button>)}
      </div>
      <div id="kg3-photo-strip" key={kind} ref={rail} className="kg3-photo-strip" data-kind={kind} role="region" aria-label="Фотографии выпускной группы"
        onScroll={(event) => {
          const element = event.currentTarget;
          if (element.clientWidth) setCurrent(Math.max(0, Math.min(photos.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
        }}>
        {photos.map((image, index) => <div className="kg3-photo-slide" key={image.slug ?? image.imageNumber}>
          <button type="button" tabIndex={index === current ? 0 : -1} aria-label={`Увеличить фотографию: ${image.alt}`}
            onClick={(event) => { opener.current = event.currentTarget; setCurrent(index); setZoomed(true); }}>
            <Picture image={image} className="kg3-photo-image" loading="lazy" />
            <span className="kg3-photo-expand" aria-hidden="true"><Expand size={21} /></span>
          </button>
        </div>)}
      </div>
      {navigation()}
      {kind === "life" && <p className="kg3-intro kg3-life-caption">Игры, занятия и прогулки сохраняют атмосферу группы, которую дети будут узнавать спустя годы.</p>}
    </div>
    <Dialog.Root open={zoomed} onOpenChange={setZoomed}>
      <Dialog.Portal>
        <Dialog.Overlay className="kg3-lightbox-overlay" />
        <Dialog.Content className="kg3-lightbox"
          onOpenAutoFocus={(event) => { event.preventDefault(); closeButton.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }); }}>
          <header><Dialog.Title>Фотографии выпускной группы</Dialog.Title>
            <Dialog.Close asChild><button ref={closeButton} type="button" aria-label="Закрыть фотографию"><X size={24} aria-hidden="true" /></button></Dialog.Close>
          </header>
          <Dialog.Description className="sr-only">{selected.alt}</Dialog.Description>
          <div className="kg3-lightbox-photo"><Picture image={selected} className="kg3-lightbox-image" loading="eager" /></div>
          {navigation(true)}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </section>;
}
