import React from "react";
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
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Kindergarten = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Выпускные альбомы для детского сада - Фотосъемка в детских садах Санкт-Петербурга</title>
        <meta 
          name="description" 
          content="Профессиональная фотосъемка и выпускные альбомы для детских садов в СПб. Без предоплаты, все фото включены, выезд с декорациями. Скидка 15% до 1 октября." 
        />
        <meta name="keywords" content="выпускные альбомы детский сад, фотосъемка детский сад спб, фотограф в детский сад, выпускной детский сад" />
        <link rel="canonical" href="/kindergarten" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Выпускные альбомы для детского сада - Дети в кадре" />
        <meta property="og:description" content="Профессиональная фотосъемка в детских садах. Без предоплаты, все фото включены." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/kindergarten" />
      </Helmet>

      <TopBar />
      
      <main>
        <KindergartenHero />
        <KindergartenBanner />
        <KindergartenGallery />
        <KindergartenLayouts />
        <AlbumCatalog />
        <KindergartenAdvantages />
        <Testimonials />
        <KindergartenFAQ />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Kindergarten;