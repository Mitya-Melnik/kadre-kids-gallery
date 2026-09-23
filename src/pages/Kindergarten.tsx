import { Fragment } from "react";
import { Helmet } from "react-helmet";
import TopBar from "@/components/TopBar";
import AlbumPromoStrip from "@/components/AlbumPromoStrip";
import KindergartenHero from "@/components/kindergarten/KindergartenHero";
import KindergartenGallery from "@/components/kindergarten/KindergartenGallery";
import KindergartenLayouts from "@/components/kindergarten/KindergartenLayouts";
import AlbumCatalog from "@/components/kindergarten/KindergartenCatalog";
import CatalogViewportControls from "@/components/kindergarten/CatalogViewportControls";
import { MobileAdvantages, useKindergartenMobile } from "@/components/kindergarten/KindergartenMobileContent";
import "@/components/kindergarten/kindergarten-mobile.css";
import "@/components/kindergarten/kindergarten-content-v3.css";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import KindergartenInlineCTA from "@/components/kindergarten/KindergartenInlineCTA";
import KindergartenMobileCTA from "@/components/kindergarten/KindergartenMobileCTA";
import Testimonials from "@/components/Testimonials";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";
import KindergartenCase from "@/components/kindergarten/KindergartenCase";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

const Kindergarten = () => {
  const mobile = useKindergartenMobile();
  const sections = {
    hero: <KindergartenHero />,
    promotion: <AlbumPromoStrip />,
    advantages: mobile ? <MobileAdvantages><KindergartenAdvantages /></MobileAdvantages> : <KindergartenAdvantages />,
    catalog: <AlbumCatalog />,
    controls: <CatalogViewportControls />,
    story: <KindergartenCase />,
    // Keep all six existing steps, descriptions and timings, with no disclosure.
    process: <Process initialType="album" fixedType="album" />,
    layouts: <KindergartenLayouts />,
    inline: <KindergartenInlineCTA />,
    gallery: <KindergartenGallery compactMobile={mobile} />,
    reviews: <Testimonials compactMobile={mobile} />,
    questions: <KindergartenFAQ compactMobile={mobile} />,
    form: <CTA initialDirection="album" initialAudience="kindergarten" fixedDirection="album" fixedAudience="kindergarten" />,
  };
  const order: (keyof typeof sections)[] = mobile
    ? ["hero", "promotion", "catalog", "controls", "gallery", "story", "advantages", "process", "layouts", "inline", "reviews", "questions", "form"]
    : ["hero", "promotion", "advantages", "catalog", "controls", "story", "process", "layouts", "inline", "gallery", "reviews", "questions", "form"];

  return (
    <div className="kindergarten-mobile-v1 kindergarten-mobile-content-v3 min-h-screen overflow-x-clip bg-background pb-16 md:pb-0">
      <Helmet>
        <title>Выпускные альбомы для детского сада в СПб | Дети в кадре</title>
        <meta name="description" content="Выпускные альбомы для детских садов Санкт-Петербурга: договор, до 3 съёмочных дней, выбор портрета, электронные фотографии и доставка СДЭК." />
        <meta name="keywords" content="выпускные альбомы детский сад, фотосъемка детский сад спб, фотограф в детский сад, выпускной детский сад" />
        <link rel="canonical" href="https://detivkadre.spb.ru/kindergarten" />
        <meta property="og:title" content="Выпускные альбомы для детского сада - Дети в кадре" />
        <meta property="og:description" content="Фотосъёмка, макеты, печать, электронные фотографии и доставка СДЭК — с условиями и сроками в договоре." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://detivkadre.spb.ru/kindergarten" />
      </Helmet>
      <TopBar />
      <main>{order.map((name) => <Fragment key={name}>{sections[name]}</Fragment>)}</main>
      <Footer kindergartenPage />
      <FabContact aboveMobileBar />
      <BackToTop aboveMobileBar />
      <KindergartenMobileCTA />
    </div>
  );
};

export default Kindergarten;
