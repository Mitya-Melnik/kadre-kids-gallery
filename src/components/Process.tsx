import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState } from "react";

const Process = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: carouselRef, isVisible: carouselVisible } = useScrollAnimation(0.1);
  const { ref: bottomRef, isVisible: bottomVisible } = useScrollAnimation(0.2);
  const [currentSlide, setCurrentSlide] = useState(0);
  const steps = [
    {
      number: "1",
      title: "Запись на съемку",
      description: "Родители отмечаются в опросе в группе"
    },
    {
      number: "2", 
      title: "Напоминание",
      description: "За 24 часа до съёмки всем зарегистрированным родителям приходит уведомление в Telegram-боте"
    },
    {
      number: "3",
      title: "Фотосъёмка",
      description: "Съёмка с 8:00/9:00 до 12:30 (можем остаться после тихого часа)"
    },
    {
      number: "4",
      title: "Обработка",
      description: "Через 7 дней все кадры готовы в личном кабинете"
    },
    {
      number: "5",
      title: "Выбор и оплата",
      description: "У вас 7 дней на покупку, электронные фото — доступно для покупки в любое время"
    },
    {
      number: "6",
      title: "Мгновенная загрузка",
      description: "Оплатили — и всё: файлы сразу доступны для загрузки одним кликом"
    },
    {
      number: "7",
      title: "Доставка печати",
      description: "Напечатанные снимки привезём в сад в течение 14 дней"
    },
    {
      number: "8",
      title: "Отчёт",
      description: "Предоставим полный отчёт по каждому ребёнку для администрации"
    }
  ];

  return (
    <section id="process" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Как проходит фотосессия
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Простой и прозрачный алгоритм позволит вам не переживать о деталях и наслаждаться результатом
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div ref={carouselRef} className={`transition-all duration-700 ${carouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Carousel 
              opts={{
                align: "center",
                loop: true,
                slidesToScroll: 1
              }}
              className="w-full"
              setApi={(api) => {
                if (api) {
                  api.on("select", () => {
                    setCurrentSlide(api.selectedScrollSnap());
                  });
                }
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {steps.map((step, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                    <div className="relative h-full">
                      <div className="bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-2 text-center group h-full cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          {step.number}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          Шаг {step.number}: {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-all duration-200" />
              <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-all duration-200" />
              
              {/* Mobile navigation arrows */}
              <CarouselPrevious className="md:hidden left-2 h-8 w-8 border border-primary/30 bg-background/90 backdrop-blur-sm" />
              <CarouselNext className="md:hidden right-2 h-8 w-8 border border-primary/30 bg-background/90 backdrop-blur-sm" />
            </Carousel>
            
            {/* Dots indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentSlide) === index
                      ? 'bg-primary scale-125'
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  onClick={() => {
                    // This would require carousel API to scroll to specific slide
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div ref={bottomRef} className={`text-center mt-16 transition-all duration-700 ${bottomVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg text-primary font-semibold">
            Приедем в сад и привезем образцы на каждую группу
          </p>
        </div>
      </div>
    </section>
  );
};

export default Process;