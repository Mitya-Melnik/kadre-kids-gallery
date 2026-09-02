import { Helmet } from "react-helmet";
import TopBar from "@/components/TopBar";
import KindergartenHero from "@/components/kindergarten/KindergartenHero";
import KindergartenGallery from "@/components/kindergarten/KindergartenGallery";
import KindergartenLayouts from "@/components/kindergarten/KindergartenLayouts";
import AlbumCatalog from "@/components/kindergarten/AlbumCatalog";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import KindergartenInlineCTA from "@/components/kindergarten/KindergartenInlineCTA";
import KindergartenMobileCTA from "@/components/kindergarten/KindergartenMobileCTA";
import Testimonials from "@/components/Testimonials";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";
import KindergartenCase from "@/components/kindergarten/KindergartenCase";

import Footer from "@/components/Footer";

const Kindergarten = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-16 md:pb-0">
      <Helmet>
        <title>Выпускные альбомы для детского сада в СПб | Дети в кадре</title>
        <meta 
          name="description" 
          content="Выпускные альбомы для детских садов Санкт-Петербурга: договор, до 3 съёмочных дней, выбор портрета, электронные фотографии и доставка СДЭК."
        />
        <meta name="keywords" content="выпускные альбомы детский сад, фотосъемка детский сад спб, фотограф в детский сад, выпускной детский сад" />
        <link rel="canonical" href="https://detivkadre.spb.ru/kindergarten" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Выпускные альбомы для детского сада - Дети в кадре" />
        <meta property="og:description" content="Фотосъёмка, макеты, печать, электронные фотографии и доставка СДЭК — с условиями и сроками в договоре." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://detivkadre.spb.ru/kindergarten" />
      </Helmet>

      <TopBar />
      
      <main>
        <KindergartenHero />
        <AlbumCatalog />
        <KindergartenCase />
        <Process initialType="album" fixedType="album" />
        <KindergartenLayouts />
        <KindergartenInlineCTA />
        <KindergartenGallery />
        <KindergartenAdvantages />
        <Testimonials />
        <KindergartenFAQ />
        <CTA initialDirection="album" initialAudience="kindergarten" fixedDirection="album" fixedAudience="kindergarten" />
      </main>
      
      <Footer />
      <KindergartenMobileCTA />
    </div>
  );
};

export default Kindergarten;
