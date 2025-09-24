import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

const KindergartenHero = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: advantagesRef, isVisible: advantagesVisible } = useScrollAnimation(0.1);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    {
      basePath: "/kindergarten/hero/slide-1",
      alt: "Групповая фотосессия детей в детском саду"
    },
    {
      basePath: "/kindergarten/hero/slide-2", 
      alt: "Выпускники детского сада"
    },
    {
      basePath: "/kindergarten/hero/slide-3",
      alt: "Праздничная фотосессия в детском саду"
    }
  ];

  const advantages = [
    {
      emoji: "📸",
      text: "<strong>Отдаем все</strong><br/>фотографии со съемки"
    },
    {
      emoji: "🆓",
      text: "<strong>Бесплатно доснимем</strong><br/>если заболели или не смогли прийти" 
    },
    {
      emoji: "⏰",
      text: "<strong>100% заказов</strong><br/>отдали вовремя"
    },
    {
      emoji: "✨",
      text: "<strong>Высокое качество съемки</strong><br/>в любых условиях и локациях"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-hero min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
          {/* Title - First on mobile, part of left column on desktop */}
          <div 
            ref={titleRef}
            className={`order-1 lg:order-1 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Каждая страница — кусочек детства, который не вернуть
            </h1>
          </div>

          {/* Photo slider - Second on mobile, right column on desktop */}
          <div className="order-2 lg:order-2 lg:row-span-2 relative w-full">
            <div className="relative w-full overflow-hidden rounded-xl shadow-glow">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <div 
                  className="flex w-full h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {heroImages.map((image, index) => (
                    <div key={index} className="min-w-full h-full flex-shrink-0">
                      <ResponsiveImage
                        basePath={image.basePath}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        type="gallery"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      currentSlide === index 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Advantages - Third on mobile, continues left column on desktop */}
          <div 
            ref={advantagesRef}
            className={`order-3 lg:order-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 transition-all duration-700 ${advantagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {advantages.map((advantage, index) => (
              <div
                key={index}
                className={`bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1`}
                style={{ 
                  transitionDelay: advantagesVisible ? `${index * 100}ms` : '0ms'
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{advantage.emoji}</span>
                  <p 
                    className="text-foreground font-medium leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: advantage.text }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KindergartenHero;