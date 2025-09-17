import { Star, Clock, Gamepad2, MessageCircle, Palette, Camera, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenAdvantages = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  const advantages = [
    {
      icon: Star,
      title: "Высокое качество",
      description: "Печать на цифровом оборудовании HP Indigo и Ricoh Pro. Твердая фотообложка, развороты на 180 градусов, ламинированная поверхность, плотные листы."
    },
    {
      icon: Clock,
      title: "100% заказов вовремя",
      description: "Сроки соблюдаем и не срываем дедлайны."
    },
    {
      icon: Gamepad2,
      title: "Игра вместо позирования", 
      description: "Съёмка проходит в игровой форме: дети не зажимаются и улыбаются искренне."
    },
    {
      icon: MessageCircle,
      title: "Быстрая коммуникация",
      description: "Отвечаем быстро в мессенджерах и всегда на связи с родителями."
    },
    {
      icon: Palette,
      title: "Живая ретушь + AI",
      description: "Технологии помогают ускорить процесс, а ретушёр сохраняет естественность обработки."
    },
    {
      icon: Camera,
      title: "Техника",
      description: "Привозим оборудование и создаём настоящую фотостудию прямо в детском саду."
    },
    {
      icon: CheckCircle, 
      title: "Все документы и разрешения",
      description: "У нас есть полный комплект документов и все разрешения на съёмку в соответствии с требованиями детских садов."
    }
  ];

  return (
    <section id="kindergarten-advantages" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Преимущества
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Почему детские сады выбирают именно нас
          </p>
        </div>
        
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-7xl mx-auto"
        >
          {advantages.map((advantage, index) => {
            // Определяем размер карточки на основе длины текста и визуального баланса
            let cardSize = 'col-span-1 md:col-span-2 lg:col-span-2'; // стандартный размер
            
            if (index === 0) {
              // "Высокое качество" - очень длинный текст
              cardSize = 'col-span-1 md:col-span-4 lg:col-span-4';
            } else if (index === 1 || index === 3) {
              // "100% заказов" и "Быстрая коммуникация" - короткие
              cardSize = 'col-span-1 md:col-span-2 lg:col-span-2';
            } else if (index === 2) {
              // "Игра вместо позирования" - средний
              cardSize = 'col-span-1 md:col-span-2 lg:col-span-2';
            } else if (index === 4) {
              // "Живая ретушь + AI" - средне-длинный
              cardSize = 'col-span-1 md:col-span-2 lg:col-span-3';
            } else if (index === 5) {
              // "Техника" - средний
              cardSize = 'col-span-1 md:col-span-2 lg:col-span-3';
            } else if (index === 6) {
              // "Все документы и разрешения" - длинный
              cardSize = 'col-span-1 md:col-span-4 lg:col-span-4';
            }
            
            return (
              <div
                key={index}
                className={`${cardSize} bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-2 group ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ 
                  transitionDelay: gridVisible ? `${index * 100}ms` : '0ms',
                  transitionDuration: '700ms'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <advantage.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {advantage.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KindergartenAdvantages;