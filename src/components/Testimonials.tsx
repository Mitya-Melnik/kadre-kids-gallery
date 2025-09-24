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
      name: "Светлана Васильева",
      role: "Мама выпускницы",
      text: "Выпускной альбом получился потрясающим! Каждая страница как произведение искусства. Дочка до сих пор с гордостью показывает его друзьям.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 2, 
      name: "Анжелика Романова",
      role: "Воспитатель подготовительной группы",
      text: "Альбомы стали прекрасным подарком на память. Родители были в восторге от качества печати и оформления. Детские эмоции переданы очень живо!",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Екатерина Морозова", 
      role: "Мама выпускника",
      text: "Заказывала альбом для сына - результат превзошёл ожидания. Красивые развороты, качественные материалы. Это память на всю жизнь!",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Олеся Крылова",
      role: "Заведующая детским садом",
      text: "Сотрудничаем третий год. Выпускные альбомы всегда становятся настоящим сюрпризом для детей и родителей. Профессиональный подход к каждой детали!",
      avatar: "https://images.unsplash.com/photo-1569913486515-b74bf751574?w=120&h=120&fit=crop&crop=face&auto=format"
    },
    {
      id: 5,
      name: "Наталья Соколова",
      role: "Мама выпускницы",
      text: "Дочка была так счастлива получить свой выпускной альбом! Качество печати отличное, дизайн очень стильный. Спасибо за прекрасную работу!",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Виктория Федорова",
      role: "Мама выпускника",
      text: "Выпускной альбом стал лучшим подарком на окончание детского сада. Сын с удовольствием листает его и вспоминает друзей из группы.",
      avatar: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=120&h=120&fit=crop&crop=face&auto=format"
    },
    {
      id: 7,
      name: "Дарья Никитина",
      role: "Мама выпускницы",
      text: "Очень довольна выбором! Альбом сделан с душой - видно, что каждая фотография продумана. Дочка теперь мечтает стать фотографом!",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face&auto=format"
    },
    {
      id: 8,
      name: "Алёна Павлова",
      role: "Мама выпускника",
      text: "Заказала альбом как сюрприз для сына. Когда он увидел себя на обложке, эмоции были непередаваемые! Качество превосходное, рекомендую всем.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 9,
      name: "Ирина Белова",
      role: "Воспитатель",
      text: "Выпускные альбомы всегда получаются особенными. Дети с нетерпением ждут их получения. Это прекрасная традиция, которая создаёт тёплые воспоминания.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face&auto=format"
    },
    {
      id: 10,
      name: "Марина Александрова",
      role: "Мама выпускницы",
      text: "Альбом стал семейной реликвией! Такое качество печати и внимание к деталям встретишь не часто. Дочка показывает его всем родственникам с гордостью.",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop&crop=face&auto=format"
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
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
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