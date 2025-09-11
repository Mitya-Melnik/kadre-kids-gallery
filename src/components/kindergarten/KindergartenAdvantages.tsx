import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenAdvantages = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  const advantages = [
    {
      emoji: "🌟",
      title: "Высокое качество",
      description: "Печать происходит на цифровом оборудовании HP Indigo и Ricoh Pro. Твердая фотообложка, развороты на 180 градусов, ламинированная поверхность, плотные листы. Технология сборки — через склеивание цельных разворотов между собой."
    },
    {
      emoji: "⏱️", 
      title: "100% заказов вовремя",
      description: "Сроки соблюдаем и не срываем дедлайны."
    },
    {
      emoji: "🎮",
      title: "Игра вместо позирования", 
      description: "Ребёнок расслаблен и в кадре настоящий."
    },
    {
      emoji: "💬",
      title: "Быстрая коммуникация",
      description: "Отвечаем быстро в мессенджерах и всегда на связи с родителями."
    },
    {
      emoji: "🎨",
      title: "Живая ретушь + AI",
      description: "Совмещаем алгоритмы и ручную ретушь — кадры остаются живыми и натуральными."
    },
    {
      emoji: "📸",
      title: "Техника",
      description: "Привозим собственное оборудование и создаём настоящую фотостудию прямо в детском саду."
    },
    {
      emoji: "✅", 
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`group bg-gradient-card p-8 rounded-xl transition-all duration-300 ease-out hover:shadow-glow hover:-translate-y-2 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: gridVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="text-center space-y-4">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300 ease-out">
                  {advantage.emoji}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {advantage.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KindergartenAdvantages;