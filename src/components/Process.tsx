import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";

const Process = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation(0.1);
  const { ref: bottomRef, isVisible: bottomVisible } = useScrollAnimation(0.2);
  const [activeStep, setActiveStep] = useState(-1);
  const steps = [
    {
      number: "1",
      title: "Запись на съемку",
      shortTitle: "Бронь",
      description: "Родители отмечаются в опросе в группе"
    },
    {
      number: "2", 
      title: "Напоминание",
      shortTitle: "Уведомление",
      description: "За 24 часа до съёмки всем зарегистрированным родителям приходит уведомление в Telegram-боте"
    },
    {
      number: "3",
      title: "Фотосъёмка",
      shortTitle: "Съёмка",
      description: "Съёмка с 8:00/9:00 до 12:30 (можем остаться после тихого часа)"
    },
    {
      number: "4",
      title: "Обработка",
      shortTitle: "Обработка",
      description: "Через 7 дней все кадры готовы в личном кабинете"
    },
    {
      number: "5",
      title: "Выбор и оплата",
      shortTitle: "Покупка",
      description: "У вас 7 дней на покупку, электронные фото — доступно для покупки в любое время"
    },
    {
      number: "6",
      title: "Мгновенная загрузка",
      shortTitle: "Загрузка",
      description: "Оплатили — и всё: файлы сразу доступны для загрузки одним кликом"
    },
    {
      number: "7",
      title: "Доставка печати",
      shortTitle: "Доставка",
      description: "Напечатанные снимки привезём в сад в течение 14 дней"
    },
    {
      number: "8",
      title: "Отчёт",
      shortTitle: "Отчёт",
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
        
        {/* Desktop Timeline */}
        <div className="hidden md:block max-w-7xl mx-auto">
          <div ref={timelineRef} className={`transition-all duration-700 ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              {/* Timeline connecting line */}
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-primary"></div>
              
              {/* Timeline steps */}
              <div className="grid grid-cols-8 gap-4">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer transform transition-all duration-200 ease-in-out hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Step icon */}
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 relative z-10 shadow-soft group-hover:shadow-glow transition-all duration-200 ease-in-out">
                        {step.number}
                      </div>
                      
                      {/* Short title */}
                      <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                        {step.shortTitle}
                      </h3>
                      
                      {/* Mini description */}
                      <p className="text-xs text-muted-foreground leading-relaxed px-1 group-hover:text-foreground transition-colors duration-200">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden max-w-md mx-auto">
          <div ref={timelineRef} className={`transition-all duration-700 ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden bg-background shadow-soft">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gradient-card/50 transition-all duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                    onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.number}
                      </div>
                      <span className="font-semibold text-foreground">Шаг {step.number}: {step.title}</span>
                    </div>
                    <span className={`text-primary text-lg transition-transform duration-300 ease-in-out ${
                      activeStep === index ? 'rotate-90' : ''
                    }`}>
                      {activeStep === index ? '▼' : '►'}
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeStep === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                    style={{
                      height: activeStep === index ? 'auto' : '0px'
                    }}
                  >
                    <div className="p-4 pt-0">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
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