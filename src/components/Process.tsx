import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Process = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.1);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.1);
  const [activeStep, setActiveStep] = useState(-1);
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  // Fallback for mobile visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Debug info
  console.log('Process component render:', { 
    titleVisible, 
    contentVisible, 
    activeStep, 
    isMobileVisible,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'unknown'
  });

  const steps = [
    {
      number: "1",
      title: "Запись на съемку",
      description: "Родители отмечаются в опросе в группе"
    },
    {
      number: "2", 
      title: "Напоминание",
      description: "За 24 часа до съёмки приходит уведомление в Telegram-боте"
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
      description: "7 дней на покупку, электронные файлы - доступны для покупки в любое время"
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
    <section id="process" className="py-12 md:py-20 bg-secondary/30">
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
        <div className="hidden md:block max-w-6xl mx-auto">
          <div ref={contentRef} className={`transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Horizontal Timeline */}
            <div className="relative">
              {/* Continuous gradient timeline tracks */}
              {/* Top row track (steps 1-4) */}
              <div className="absolute top-8 left-16 right-16 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full hidden lg:block shadow-sm"></div>
              {/* Bottom row track (steps 5-8) - positioned at center of second row circles */}
              <div className="absolute top-[212px] left-16 right-16 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full hidden lg:block shadow-sm"></div>
              
              {/* Steps grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 lg:gap-4">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`relative group transition-all duration-700 delay-${index * 100} ${
                      contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ 
                      transitionDelay: contentVisible ? `${index * 100}ms` : '0ms'
                    }}
                  >
                    {/* Step content */}
                    <div className="relative z-10 text-center hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer group-hover:drop-shadow-lg">
                      {/* Step icon */}
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto shadow-soft group-hover:shadow-xl transition-all duration-200">
                        {step.number}
                      </div>
                      
                      {/* Step title */}
                      <h3 className="text-base lg:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                        {step.title}
                      </h3>
                      
                      {/* Step description */}
                      <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-200 max-h-12 overflow-hidden">
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
          <div className={`transition-all duration-700 ${(contentVisible || isMobileVisible) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden bg-background shadow-soft">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-secondary/50 transition-all duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                    onClick={() => {
                      console.log('Mobile accordion clicked:', index, 'current activeStep:', activeStep);
                      setActiveStep(activeStep === index ? -1 : index);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center text-white font-bold text-sm">
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
            
            <div className={`text-center mt-8 transition-all duration-700 ${(contentVisible || isMobileVisible) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-lg text-primary font-semibold">
                Образцы привезем для каждой группы
              </p>
            </div>
          </div>
        </div>
        
        <div className={`text-center mt-16 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg text-primary font-semibold">
            Образцы привезем для каждой группы
          </p>
        </div>
      </div>
    </section>
  );
};

export default Process;