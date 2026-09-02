import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { reachGoal } from "@/lib/analytics";

const KindergartenHero = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: advantagesRef, isVisible: advantagesVisible } = useScrollAnimation(0.1);
  
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  
  const heroImages = [
    {
      basePath: "/kindergarten/hero-square/slide-1",
      alt: "Макет альбома Цветные Карандаши"
    },
    {
      basePath: "/kindergarten/hero-square/slide-2", 
      alt: "Макет альбома Ушастики"
    },
    {
      basePath: "/kindergarten/hero-square/slide-3",
      alt: "Макет альбома Белочки"
    }
  ];

  const advantages = [
    {
      emoji: "🎁",
      text: "<strong>Все удачные фотографии</strong><br/>со съёмки — в подарок"
    },
    {
      emoji: "▦",
      text: "<strong>Более 10 вариантов дизайна</strong><br/>на выбор группы"
    },
    {
      emoji: "📄",
      text: "<strong>Работаем по договору</strong><br/>фиксируем условия и сроки"
    },
    {
      emoji: "♡",
      text: "<strong>Организацию берём на себя</strong><br/>от выбора до готового тиража"
    }
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (event: React.MouseEvent<HTMLAnchorElement>, selector: string) => {
    event.preventDefault();
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-gradient-hero min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
          {/* Title - First on mobile, part of left column on desktop */}
          <div 
            ref={titleRef}
            className={`order-1 lg:order-1 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <p className="mb-4 font-semibold uppercase tracking-[0.14em] text-primary">
              Выпускные альбомы для детского сада
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Выпускной альбом, который хочется пересматривать
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Живые фотографии ребёнка, друзей, воспитателей и событий группы — в одном альбоме на память о детстве.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="/kindergarten#albums" onClick={(event) => { scrollTo(event, "#albums"); reachGoal("album_catalog_open", { audience: "kindergarten" }); }}>
                  Посмотреть альбомы и цены
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/kindergarten#cta" onClick={(event) => { scrollTo(event, "#cta"); reachGoal("consultation_click", { page: "kindergarten" }); }}>
                  Получить консультацию
                </a>
              </Button>
            </div>
          </div>

          {/* Photo slider - Second on mobile, right column on desktop */}
          <div className="order-2 lg:order-2 lg:row-span-2 relative w-full max-w-md mx-auto lg:max-w-none">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {heroImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-glow">
                      <ResponsiveImage
                        basePath={image.basePath}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        type="cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      current === index 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Перейти к слайду ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
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
