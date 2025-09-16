import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenHero = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: advantagesRef, isVisible: advantagesVisible } = useScrollAnimation(0.1);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroImages = [
    {
      src: "/placeholder.svg",
      alt: "Групповая фотосессия детей в детском саду"
    },
    {
      src: "/placeholder.svg", 
      alt: "Выпускники детского сада"
    },
    {
      src: "/placeholder.svg",
      alt: "Праздничная фотосессия в детском саду"
    }
  ];

  const advantages = [
    {
      emoji: "📸",
      text: "Отдаем все фотографии со съемки"
    },
    {
      emoji: "🆓",
      text: "Бесплатно доснимем если заболели или не смогли прийти" 
    },
    {
      emoji: "⏰",
      text: "100% заказов отдали вовремя"
    },
    {
      emoji: "✨",
      text: "Высокое качество съемки в любых условиях и локациях"
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Каждая страница — кусочек детства, который не вернуть
            </h1>
          </div>

          {/* Photo slider - Second on mobile, right column on desktop */}
          <div className="order-2 lg:order-2 lg:row-span-2 relative">
            <div className="relative overflow-hidden rounded-xl shadow-glow">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroImages.map((image, index) => (
                  <div key={index} className="min-w-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
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
                  <p className="text-foreground font-medium leading-relaxed">
                    {advantage.text}
                  </p>
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