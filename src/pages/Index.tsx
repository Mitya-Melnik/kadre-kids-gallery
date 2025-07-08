import TopBar from "@/components/TopBar";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Advantages from "@/components/Advantages";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      <Hero />
      <Advantages />
      <Gallery />
      <Testimonials />
      <Pricing />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
