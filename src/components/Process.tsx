import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Process = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.1);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.05);
  const [activeStep, setActiveStep] = useState(-1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 2;

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + slidesToShow >= steps.length ? 0 : prev + slidesToShow));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - slidesToShow < 0 ? Math.max(0, steps.length - slidesToShow) : prev - slidesToShow));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index * slidesToShow);
  };

  const totalSlides = Math.ceil(steps.length / slidesToShow);

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
        
        {/* Desktop Slider */}
        <div className="hidden md:block max-w-5xl mx-auto">
          <div ref={contentRef} className={`transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              {/* Slider container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
                >
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className="flex-none w-1/2 px-4"
                    >
                      <div className="bg-background rounded-xl p-6 shadow-soft border border-border transition-all duration-300 ease hover:scale-[1.02] hover:shadow-glow cursor-pointer">
                        <div className="flex flex-col items-center text-center">
                          {/* Step icon */}
                          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-soft">
                            {step.number}
                          </div>
                          
                          {/* Step title */}
                          <h3 className="text-lg font-semibold text-foreground mb-3">
                            {step.title}
                          </h3>
                          
                          {/* Step description */}
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-soft hover:shadow-glow transition-all duration-200 hover:scale-110"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center shadow-soft hover:shadow-glow transition-all duration-200 hover:scale-110"
                disabled={currentSlide >= steps.length - slidesToShow}
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    Math.floor(currentSlide / slidesToShow) === index
                      ? 'bg-primary shadow-glow'
                      : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden max-w-md mx-auto">
          <div ref={contentRef} className={`transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="border border-border rounded-xl overflow-hidden bg-background shadow-soft">
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gradient-card/50 transition-all duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                    onClick={() => setActiveStep(activeStep === index ? -1 : index)}
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
          </div>
        </div>
        
        <div className={`text-center mt-16 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg text-primary font-semibold">
            Приедем в сад и привезем образцы на каждую группу
          </p>
        </div>
      </div>
    </section>
  );
};

export default Process;