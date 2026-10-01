import { Helmet } from "react-helmet";
import { Check } from "lucide-react";
import TopBar from "@/components/TopBar";
import AlbumPromoStrip from "@/components/AlbumPromoStrip";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { albumSteps, getProcessSteps } from "@/components/Process";
import { grade4HeroImages, participantBenefits } from "@/config/grade4Content";
import { MobileAlbumCatalog } from "@/components/kindergarten/KindergartenCatalog";
import { KindergartenEnquiryShell, KindergartenEnquirySection } from "@/components/kindergarten/KindergartenEnquiry";
import { MobileAdvantages, MobileStoryGallery, type PictureProps } from "@/components/kindergarten/KindergartenMobileContent";
import { MobileSwipeRail } from "@/components/kindergarten/MobileSwipeRail";
import KindergartenProcessMobile from "@/components/kindergarten/KindergartenProcessMobile";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";
import CatalogViewportControls from "@/components/kindergarten/CatalogViewportControls";
import MobileContentViewportControls from "@/components/kindergarten/MobileContentViewportControls";
import { grade4StoryImages, SCHOOL_STORY_ASSET_VERSION } from "./SchoolStories";
import SchoolLayoutsMobile from "./SchoolLayoutsMobile";
import "@/components/kindergarten/kindergarten-mobile.css";
import "@/components/kindergarten/kindergarten-content-v3.css";
import "./grade4-mobile-v8.css";

const processSteps = getProcessSteps(albumSteps, "grade4");
const Grade4Picture = ({ image, className, loading }: PictureProps) => <picture>
  <source media="(max-width: 767px)" srcSet={`/grade4-stories/${image.slug}-mobile.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} />
  <img src={`/grade4-stories/${image.slug}.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} alt={image.alt} className={className} loading={loading} decoding="async" />
</picture>;

/** Opt-in route only: SchoolGrade4 keeps its original JSX above the mobile breakpoint. */
export default function SchoolGrade4Mobile() {
  return <KindergartenEnquiryShell enabled audience="grade4" className="grade4-mobile-v8 kindergarten-mobile-v1 kindergarten-mobile-content-v3 min-h-screen overflow-x-clip bg-background pb-16">
    <Helmet>
      <title>Выпускные альбомы для 4 класса в СПб | Дети в кадре</title>
      <meta name="description" content="Выпускные альбомы для 4 класса в Санкт-Петербурге: первая учительница, друзья и события начальной школы, выбор портрета родителями, бесплатная досъёмка, договор и доставка СДЭК." />
      <link rel="canonical" href="https://detivkadre.spb.ru/school/4" />
      <meta property="og:title" content="Выпускные альбомы для 4 класса — Дети в кадре" />
      <meta property="og:description" content="Четыре первых школьных года — в одной живой истории с понятными условиями и контролем родителей до печати." />
      <meta property="og:type" content="website" /><meta property="og:url" content="https://detivkadre.spb.ru/school/4" />
    </Helmet>
    <TopBar />
    <main>
      <section id="hero" className="g4-section kg-hero g4-hero bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <p className="g4-eyebrow">Выпускные альбомы для 4 класса</p>
        <h1>Четыре первых школьных года — в одной живой истории</h1>
        <p>Сохраним первую учительницу, друзей, уроки, перемены и события класса. Родители выбирают портрет ребёнка и подтверждают персональный разворот до печати.</p>
        <MobileSwipeRail count={grade4HeroImages.length} label="Примеры выпускных альбомов для 4 класса" itemLabel="Пример" className="g4-hero-gallery"
          renderItem={(index) => <picture><source media="(max-width: 767px)" srcSet={`${grade4HeroImages[index].basePath}-mobile.webp`} />
            <img src={`${grade4HeroImages[index].basePath}.webp`} alt={grade4HeroImages[index].alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
          </picture>} />
        <a href="/school/4#albums" className="g4-action" onClick={(event) => { event.preventDefault(); document.getElementById("albums")?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>Посмотреть альбомы и цены</a>
        <a href="/school/4#cta" className="g4-secondary-action">Рассчитать стоимость</a>
        <div className="g4-hero-benefits">{["Портрет ребёнка выбираете вы", "Бесплатно доснимем отсутствовавших", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"].map((item) => <p key={item}><Check size={18} aria-hidden="true" /><span>{item}</span></p>)}</div>
      </section>
      <AlbumPromoStrip />
      <MobileAlbumCatalog audience="grade4" />
      <CatalogViewportControls />
      <MobileStoryGallery images={grade4StoryImages} Picture={Grade4Picture} school />
      <section id="participants" className="g4-section bg-secondary/30">
        <header><p className="g4-eyebrow">У каждого своя задача</p><h2>Понятный процесс для родителей, класса и школы</h2>
          <p>Дети снимаются в знакомой школьной обстановке, родители контролируют персональный результат, а ответственный за класс ведёт согласование по понятным этапам.</p>
        </header>
        <MobileSwipeRail count={participantBenefits.length} label="Преимущества для участников" itemLabel="Карточка"
          renderItem={(index) => { const item = participantBenefits[index]; const Icon = item.icon; return <article className="g4-participant"><Icon size={26} aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></article>; }} />
      </section>
      <KindergartenProcessMobile steps={processSteps} audience="grade4" />
      <SchoolLayoutsMobile />
      <div className="g4-more-benefits"><MobileAdvantages><KindergartenAdvantages audience="grade4" /></MobileAdvantages></div>
      <KindergartenFAQ audience="grade4" compactMobile />
      <KindergartenEnquirySection audience="grade4" />
    </main>
    <MobileContentViewportControls />
    <Footer schoolPage schoolLevel="grade4" />
    <FabContact aboveMobileBar /><BackToTop />
    <div className="g4-sticky fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur"><a className="g4-action" href="/school/4#cta">Рассчитать стоимость</a></div>
  </KindergartenEnquiryShell>;
}
