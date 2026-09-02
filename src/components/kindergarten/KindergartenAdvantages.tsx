import { BookOpen, FileCheck2, Heart, ListChecks, UserCheck, UserRoundPlus } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenAdvantages = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  const advantages = [
    {
      icon: Heart,
      title: "Живые фотографии без принуждения",
      description: "Знакомимся с детьми, снимаем через игру и общение, сохраняя настоящие эмоции и характер ребёнка."
    },
    {
      icon: UserCheck,
      title: "Каждый родитель выбирает портрет",
      description: "После съёмки родители самостоятельно выбирают фотографию своего ребёнка в закрытой галерее."
    },
    {
      icon: ListChecks,
      title: "Организацию берём на себя",
      description: "Помогаем ответственному родителю пройти весь путь — от выбора альбома до получения готового тиража."
    },
    {
      icon: UserRoundPlus,
      title: "Не пропустим ни одного ребёнка",
      description: "Если ребёнок заболел или отсутствовал, бесплатно организуем дополнительную съёмку по договорённости."
    },
    {
      icon: FileCheck2,
      title: "Стоимость и сроки — в договоре",
      description: "Заранее фиксируем комплектацию, стоимость, даты съёмок, сроки подготовки макета, печати и доставки."
    },
    {
      icon: BookOpen,
      title: "Альбом, рассчитанный на годы",
      description: "Твёрдая фотообложка, плотные ламинированные страницы и развороты на 180 градусов."
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
            Почему группы выбирают «Дети в кадре»
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Детям комфортно, родителям всё понятно, а ответственному не приходится организовывать проект в одиночку.
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
