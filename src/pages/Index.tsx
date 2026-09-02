import TopBar from "@/components/TopBar";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProductDirections from "@/components/ProductDirections";
import Gallery from "@/components/Gallery";
import Advantages from "@/components/Advantages";
import Testimonials from "@/components/Testimonials";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const Index = () => {
  useEffect(() => {
    if (!window.location.hash) return;

    const scrollToTarget = () => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "auto", block: "start" });
    };
    const animationFrame = window.requestAnimationFrame(scrollToTarget);
    const delayedScroll = window.setTimeout(scrollToTarget, 500);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(delayedScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        <meta name="description" content="Фотодни и выпускные альбомы для детских садов и школ Санкт-Петербурга. Бережная съёмка, закрытые галереи и понятные сроки." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://detivkadre.spb.ru/" />
      </Helmet>
      <TopBar />
      <Navigation />
      <Hero />
      <ProductDirections />
      <Advantages />
      <Gallery />
      <Testimonials />
      <Process />
      <Pricing />
      <CTA />
      <FAQ />
      <FabContact />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Index;
