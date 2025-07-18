import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation(0.3);
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation(0.2);
  
  const yearsCount = useCountUp({ end: 15, duration: 2000, delay: 500, trigger: statsVisible });
  const sessionsCount = useCountUp({ end: 2100, duration: 2500, delay: 700, trigger: statsVisible });
  const photosCount = useCountUp({ end: 168, duration: 2000, delay: 900, trigger: statsVisible });
  const institutionsCount = useCountUp({ end: 75, duration: 1800, delay: 1100, trigger: statsVisible });

  const formatNumber = (num: number, suffix: string) => {
    if (suffix === "k+") {
      return `${num}k+`;
    }
    if (suffix === "+") {
      return `${num}+`;
    }
    return `${num}`;
  };

  return (
    <section id="hero" className="relative min-h-screen bg-gradient-hero flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Выездные фотосессии<br />
              в детском саду
            </h1>
            <h2 className="text-lg md:text-2xl leading-relaxed text-muted-foreground">
              детям — комфортно, родителям — удобно
            </h2>
          </div>
          
          <div ref={statsRef} className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
                {formatNumber(yearsCount.count, "")}
              </div>
              <div className="text-sm text-muted-foreground">лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
                {formatNumber(sessionsCount.count, "+")}
              </div>
              <div className="text-sm text-muted-foreground">фотосессий</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
                {formatNumber(photosCount.count, "k+")}
              </div>
              <div className="text-sm text-muted-foreground">фотографий куплено</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
                {formatNumber(institutionsCount.count, "+")}
              </div>
              <div className="text-sm text-muted-foreground">учреждений оформлено</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="default" 
              size="xl"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 shadow-glow hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95"
              onClick={() => {
                const element = document.querySelector("#cta");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Заказать съемку
            </Button>
            <Button 
              variant="secondary" 
              size="xl"
              className="px-8 py-4 hover:scale-105 transition-all duration-200 ease-in-out active:scale-95"
              onClick={() => {
                const element = document.querySelector("#gallery");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Наши работы
            </Button>
          </div>
          
          {/* Ключевые ценности */}
          <div ref={valuesRef} className={`grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto transition-all duration-700 delay-200 ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-primary/20">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm font-medium text-foreground">Доступ по паролю</div>
              <div className="text-xs text-muted-foreground">Фото только для родителей</div>
            </div>
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-primary/20">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-medium text-foreground">Без предоплаты</div>
              <div className="text-xs text-muted-foreground">Заказывайте только понравившиеся снимки</div>
            </div>
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-primary/20">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-foreground">Поддержка 24/7</div>
              <div className="text-xs text-muted-foreground">Через Telegram-бот</div>
            </div>
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-primary/20">
              <div className="text-2xl mb-2">🎭</div>
              <div className="text-sm font-medium text-foreground">Игра вместо позирования</div>
              <div className="text-xs text-muted-foreground">Ребёнок расслаблен и в кадре настоящий</div>
            </div>
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-primary/20">
              <div className="text-2xl mb-2">🌿</div>
              <div className="text-sm font-medium text-foreground">Атмосферные декорации</div>
              <div className="text-xs text-muted-foreground">пространство для искренних улыбок</div>
            </div>
            <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 border border-primary/20">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-sm font-medium text-foreground">Оплата без хлопот</div>
              <div className="text-xs text-muted-foreground">Карты, СБП, QR, чек на e-mail</div>
            </div>
          </div>

          
          <p className="text-foreground mt-8 italic font-semibold">
            "Ценим моменты и создаем их для вас"
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;