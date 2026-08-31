import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

const Testimonials = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const testimonials = [
    {
      id: 1,
      name: "Мария, мама Алисы",
      role: "Алисе 5 лет",
      text: "Прекрасная съемка! Алиса была в восторге от декораций, а фотографии получились просто волшебными.",
      initials: "МА"
    },
    {
      id: 2, 
      name: "Елена, воспитатель",
      role: "Группа «Солнышко»",
      text: "Работали с фотографами очень профессионально. Дети были спокойны, организация на высшем уровне.",
      initials: "ЕВ"
    },
    {
      id: 3,
      name: "Анна, мама Максима",
      role: "Максиму 4 года",
      text: "Отличное качество фото и удобная система покупки через сайт. Рекомендую всем родителям!",
      initials: "АМ"
    },
    {
      id: 4,
      name: "Ирина, представитель сада",
      role: "Детский сад №15",
      text: "Дети в полном восторге! Качественные снимки и профессиональный подход к каждому ребенку.",
      initials: "ИС"
    },
    {
      id: 5,
      name: "Сергей, папа Артёма",
      role: "Артёму 6 лет",
      text: "Удобная система заказа и быстрая доставка фото. Сын очень доволен своими портретами!",
      initials: "СА"
    },
    {
      id: 6,
      name: "Ольга, представитель сада",
      role: "Администрация детского сада",
      text: "Сотрудничаем уже второй год. Родители всегда довольны результатом фотосессий.",
      initials: "ОС"
    },
    {
      id: 7,
      name: "Екатерина, мама Софии",
      role: "Софии 4 года",
      text: "Дочка стеснялась, но фотографы нашли подход. Снимки получились естественными и красивыми.",
      initials: "ЕС"
    },
    {
      id: 8,
      name: "Александра, мама Ани",
      role: "Ане 4 года",
      text: "Прекрасная организация процесса. Дети не устали, все прошло быстро и весело.",
      initials: "АА"
    },
    {
      id: 9,
      name: "Наталья, мама двойняшек",
      role: "Детям 5 лет",
      text: "Справились даже с моими непоседами! Фотографии превзошли все ожидания.",
      initials: "НМ"
    },
    {
      id: 10,
      name: "Марина, мама Ани",
      role: "Ане 4 года",
      text: "Отличное соотношение цены и качества. Обязательно закажем фотосессию и в следующем году.",
      initials: "МА"
    },
    {
      id: 11,
      name: "Татьяна, представитель сада",
      role: "Детский сад №7",
      text: "Работаем с командой уже 3 года. Всегда высокое качество и индивидуальный подход к детям.",
      initials: "ТС"
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Отзывы
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-lg p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border border-border h-full">
                    <div className="flex flex-col h-full">
                      {/* Avatar and Name */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold" aria-hidden="true">
                          {testimonial.initials}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-muted-foreground italic leading-relaxed flex-grow">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="hidden md:flex -left-12 w-10 h-10 hover:scale-110 hover:opacity-80 transition-all duration-200" />
            <CarouselNext className="hidden md:flex -right-12 w-10 h-10 hover:scale-110 hover:opacity-80 transition-all duration-200" />
          </Carousel>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index + 1 === current 
                    ? 'bg-primary scale-110' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
