import { Helmet } from "react-helmet";
import TopBar from "@/components/TopBar";
import KindergartenHero from "@/components/kindergarten/KindergartenHero";
import KindergartenBanner from "@/components/kindergarten/KindergartenBanner";
import KindergartenGallery from "@/components/kindergarten/KindergartenGallery";
import KindergartenLayouts from "@/components/kindergarten/KindergartenLayouts";
import AlbumCatalog from "@/components/kindergarten/AlbumCatalog";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import Testimonials from "@/components/Testimonials";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";

import Footer from "@/components/Footer";

const Kindergarten = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        <title>Выпускные альбомы для детского сада и школы | Дети в кадре</title>
        <meta 
          name="description" 
          content="Выпускные альбомы для детских садов и школ Санкт-Петербурга: договор, 1–3 съёмочных дня, выбор портрета, электронные фотографии и доставка СДЭК."
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
        <KindergartenBanner />
        <KindergartenGallery />
        <AlbumCatalog />
        <KindergartenLayouts />
        <KindergartenAdvantages />
        <Testimonials />
        <KindergartenFAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Kindergarten;
