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

const Index = () => {
  useEffect(() => {
    if (!window.location.hash) return;
    window.requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
