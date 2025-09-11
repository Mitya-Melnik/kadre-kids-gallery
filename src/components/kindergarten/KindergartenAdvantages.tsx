import { Star, Clock, Gamepad2, MessageCircle, Palette, Camera, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenAdvantages = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  const advantages = [
    {
      icon: Star,
      title: "Высокое качество",
      description: "Печать происходит на цифровом оборудовании HP Indigo и Ricoh Pro. Твердая фотообложка, развороты на 180 градусов, ламинированная поверхность, плотные листы. Технология сборки — через склеивание цельных разворотов между собой."
    },
    {
      icon: Clock,
      title: "100% заказов вовремя",
      description: "Сроки соблюдаем и не срываем дедлайны."
    },
    {
      icon: Gamepad2,
      title: "Игра вместо позирования", 
      description: "Ребёнок расслаблен и в кадре настоящий."
    },
    {
      icon: MessageCircle,
      title: "Быстрая коммуникация",
      description: "Отвечаем быстро в мессенджерах и всегда на связи с родителями."
    },
    {
      icon: Palette,
      title: "Живая ретушь + AI",
      description: "Совмещаем алгоритмы и ручную ретушь — кадры остаются живыми и натуральными."
    },
    {
      icon: Camera,
      title: "Техника",
      description: "Привозим собственное оборудование и создаём настоящую фотостудию прямо в детском саду."
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`bg-gradient-card p-8 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-2 text-center group ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: gridVisible ? `${index * 100}ms` : '0ms',
                transitionDuration: '700ms'
              }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <advantage.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {advantage.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KindergartenAdvantages;