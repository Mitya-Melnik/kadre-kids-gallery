import { Helmet } from "react-helmet";
import TopBar from "@/components/TopBar";
import AlbumPromoStrip from "@/components/AlbumPromoStrip";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { albumSteps, getProcessSteps } from "@/components/Process";
import { grade4HeroImages, participantBenefits as grade4Benefits } from "@/config/grade4Content";
import { MobileAlbumCatalog } from "@/components/kindergarten/KindergartenCatalog";
import { KindergartenEnquiryShell, KindergartenEnquirySection } from "@/components/kindergarten/KindergartenEnquiry";
import { MobileAdvantages, MobileStoryGallery, type PictureProps } from "@/components/kindergarten/KindergartenMobileContent";
import { MobileSwipeRail } from "@/components/kindergarten/MobileSwipeRail";
import KindergartenProcessMobile from "@/components/kindergarten/KindergartenProcessMobile";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";
import CatalogViewportControls from "@/components/kindergarten/CatalogViewportControls";
import MobileContentViewportControls from "@/components/kindergarten/MobileContentViewportControls";
import { grade4StoryImages, schoolStoryImages, SCHOOL_STORY_ASSET_VERSION } from "./SchoolStories";
import SchoolLayoutsMobile from "./SchoolLayoutsMobile";
import "@/components/kindergarten/kindergarten-mobile.css";
import "@/components/kindergarten/kindergarten-content-v3.css";
import "./grade4-mobile-v8.css";

import { schoolHeroImages, seniorParticipantBenefits } from "@/config/seniorContent";

const heroBenefitIcons = ["🖼️", "📷", "🎁", "📄"] as const;

const seniorProcessSteps = getProcessSteps(albumSteps, "school");
const grade4ProcessSteps = getProcessSteps(albumSteps, "grade4");
const Grade4Picture = ({ image, className, loading }: PictureProps) => <picture>
  <source media="(max-width: 767px)" srcSet={`/grade4-stories/${image.slug}-mobile.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} />
  <img src={`/grade4-stories/${image.slug}.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} alt={image.alt} className={className} loading={loading} decoding="async" />
</picture>;

const SeniorPicture = ({ image, className, loading }: PictureProps) => <picture>
  <source media="(max-width: 767px)" srcSet={`/school-stories/${image.slug}-mobile.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} />
  <img src={`/school-stories/${image.slug}.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} alt={image.alt} className={className} loading={loading} decoding="async" />
</picture>;

/** Opt-in route only: SchoolGrade4 keeps its original JSX above the mobile breakpoint. */
export default function SchoolMobilePage({ audience = "grade4" }: { audience?: "grade4" | "school" }) {
  const senior = audience === "school";
  const pagePath = senior ? "/school/9-11" : "/school/4";
  const heroImages = senior ? schoolHeroImages : grade4HeroImages;
  const participantBenefits = senior ? seniorParticipantBenefits : grade4Benefits;
  const processSteps = senior ? seniorProcessSteps : grade4ProcessSteps;
  const heading = senior ? "История класса, которую захочется пересматривать" : "Четыре первых школьных года — в одной живой истории";
  const intro = senior ? "Живые портреты, друзья и важные события школьной жизни — в современном выпускном альбоме с понятными условиями и сроками." : "Сохраним первую учительницу, друзей, уроки, перемены и события класса. Родители выбирают портрет ребёнка и подтверждают персональный разворот до печати.";
  return <KindergartenEnquiryShell enabled audience={audience} className={`grade4-mobile-v8 ${senior ? "senior-mobile-v9 " : ""}kindergarten-mobile-v1 kindergarten-mobile-content-v3 min-h-screen overflow-x-clip bg-background pb-16`}>
    <Helmet>
      <title>{senior ? "Выпускные альбомы для 9 и 11 классов в СПб | Дети в кадре" : "Выпускные альбомы для 4 класса в СПб | Дети в кадре"}</title>
      <meta name="description" content={senior ? "Современные выпускные альбомы для 9 и 11 классов Санкт-Петербурга: личный выбор портрета, бесплатная досъёмка, проверка макетов, договор, печать и доставка СДЭК." : "Выпускные альбомы для 4 класса в Санкт-Петербурге: первая учительница, друзья и события начальной школы, выбор портрета родителями, бесплатная досъёмка, договор и доставка СДЭК."} />
      <link rel="canonical" href={`https://detivkadre.spb.ru${pagePath}`} />
      <meta property="og:title" content={senior ? "Выпускные альбомы для 9 и 11 классов — Дети в кадре" : "Выпускные альбомы для 4 класса — Дети в кадре"} />
      <meta property="og:description" content={senior ? "Живые портреты, друзья и важные события школьной жизни — в современном выпускном альбоме с понятными условиями и сроками." : "Четыре первых школьных года — в одной живой истории с понятными условиями и контролем родителей до печати."} />
      <meta property="og:type" content="website" /><meta property="og:url" content={`https://detivkadre.spb.ru${pagePath}`} />
    </Helmet>
    <TopBar />
    <main>
      <section id="hero" className="g4-section kg-hero g4-hero bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <p className="g4-eyebrow">{senior ? "Выпускные альбомы для 9 и 11 классов" : "Выпускные альбомы для 4 класса"}</p>
        <h1>{heading}</h1>
        <p>{intro}</p>
        <MobileSwipeRail count={heroImages.length} label={senior ? "Примеры школьных выпускных альбомов" : "Примеры выпускных альбомов для 4 класса"} itemLabel="Пример" className="g4-hero-gallery"
          renderItem={(index) => <picture><source media="(max-width: 767px)" srcSet={`${heroImages[index].basePath}-mobile.webp`} />
            <img src={`${heroImages[index].basePath}.webp`} alt={heroImages[index].alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
          </picture>} />
        <a href={`${pagePath}#albums`} className="g4-action" onClick={(event) => { event.preventDefault(); document.getElementById("albums")?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>Посмотреть альбомы и цены</a>
        <a href={`${pagePath}#cta`} className="g4-secondary-action">Рассчитать стоимость</a>
        <div className="g4-hero-benefits">{(senior ? ["Личный выбор портрета и разворота", "Бесплатная досъёмка отсутствующих", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"] : ["Портрет ребёнка выбираете вы", "Бесплатно доснимем отсутствовавших", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"]).map((item, index) => <p key={item}><span className="g4-benefit-icon" aria-hidden="true">{heroBenefitIcons[index]}</span><span>{item}</span></p>)}</div>
      </section>
      <AlbumPromoStrip />
      <MobileAlbumCatalog audience={audience} />
      <CatalogViewportControls />
      <MobileStoryGallery images={senior ? schoolStoryImages : grade4StoryImages} Picture={senior ? SeniorPicture : Grade4Picture} school senior={senior} />
      <section id="participants" className="g4-section bg-secondary/30">
        <header><p className="g4-eyebrow">У каждого своя задача</p><h2>{senior ? "Понятный процесс для класса и школы" : "Понятный процесс для родителей, класса и школы"}</h2>
          <p>{senior ? "Выпускники участвуют в выборе, родители контролируют персональные страницы, а школа заранее знает график и условия работы." : "Дети снимаются в знакомой школьной обстановке, родители контролируют персональный результат, а ответственный за класс ведёт согласование по понятным этапам."}</p>
        </header>
        <MobileSwipeRail count={participantBenefits.length} label="Преимущества для участников" itemLabel="Карточка"
          renderItem={(index) => { const item = participantBenefits[index]; const Icon = item.icon; return <article className="g4-participant"><Icon size={26} aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></article>; }} />
      </section>
      <KindergartenProcessMobile steps={processSteps} audience={audience} />
      <SchoolLayoutsMobile audience={audience} />
      <div className="g4-more-benefits"><MobileAdvantages><KindergartenAdvantages audience={audience} /></MobileAdvantages></div>
      <KindergartenFAQ audience={audience} compactMobile />
      <KindergartenEnquirySection audience={audience} />
    </main>
    <MobileContentViewportControls />
    <Footer schoolPage schoolLevel={senior ? "grade9_11" : "grade4"} />
    <FabContact aboveMobileBar /><BackToTop />
    <div className="g4-sticky fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur"><a className="g4-action" href={`${pagePath}#cta`}>Рассчитать стоимость</a></div>
  </KindergartenEnquiryShell>;
}
