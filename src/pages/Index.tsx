import TopBar from "@/components/TopBar";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Values from "@/components/Values";
import Gallery from "@/components/Gallery";
import Advantages from "@/components/Advantages";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navigation />
      <Hero />
      <Values />
      <Gallery />
      <Advantages />
      <Process />
      <Pricing />
      <CTA />
      <FAQ />
    </div>
  );
};

export default Index;
