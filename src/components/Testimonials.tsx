import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Testimonials = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation(0.1);

  const testimonials = [
    {
      id: 1,
      name: "Мария Петрова",
      role: "Мама Алисы, 5 лет",
      text: "Прекрасная съемка! Алиса была в восторге от декораций, а фотографии получились просто волшебными.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 2, 
      name: "Елена Козлова",
      role: "Воспитатель группы «Солнышко»",
      text: "Работали с фотографами очень профессионально. Дети были спокойны, организация на высшем уровне.",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=120&h=120&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Анна Смирнова", 
      role: "Мама Максима, 4 года",
      text: "Отличное качество фото и удобная система покупки через Telegram-бот. Рекомендую всем родителям!",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Отзывы родителей и педагогов
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Что говорят о нашей работе те, кто уже воспользовался нашими услугами
          </p>
        </div>
        
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-background rounded-xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-103 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: cardsVisible ? `${index * 150}ms` : '0ms',
                transitionDuration: '700ms'
              }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-3">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;