import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, School } from "lucide-react";

const CTA = () => {
  const handleParentsClick = () => {
    // Трекинг клика родителей
    console.log('Клик: Родители - Чек-лист');
    window.open('https://t.me/your_bot?start=checklist', '_blank');
  };

  const handleAdminClick = () => {
    // Трекинг клика администрации
    console.log('Клик: Администрация - Презентация');
    window.open('https://t.me/your_bot?start=presentation', '_blank');
  };

  const handleChannelClick = () => {
    console.log('Клик: Подписка на канал');
    window.open('https://t.me/deti_v_kadre', '_blank');
  };

  return (
    <section id="cta" className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            Бесплатные материалы для родителей и детских садов
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Карточка для родителей */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover-lift">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Чек-лист для родителей: как подготовить ребёнка к фотосессии
                </CardTitle>
                <p className="text-white/80 text-lg">
                  Практичный чек-лист с советами психолога и фотографа
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="accent" 
                  size="xl" 
                  className="w-full shadow-accent shadow-lg mb-2"
                  onClick={handleParentsClick}
                >
                  Скачать чек-лист бесплатно
                </Button>
                <p className="text-white/50 text-sm">
                  👉 В один клик в Telegram
                </p>
              </CardContent>
            </Card>

            {/* Карточка для администрации */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover-lift">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Подарки для детского сада
                </CardTitle>
                <p className="text-white/80 text-lg">
                  Посмотреть, чем мы можем быть полезны
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="accent" 
                  size="xl" 
                  className="w-full shadow-accent shadow-lg mb-2"
                  onClick={handleAdminClick}
                >
                  Скачать презентацию
                </Button>
                <p className="text-white/50 text-sm">
                  👉 В один клик в Telegram
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ссылка на канал */}
          <div className="text-center">
            <button 
              onClick={handleChannelClick}
              className="text-white/70 hover:text-white transition-colors duration-200 text-sm underline underline-offset-4"
            >
              Подпишись на канал «Дети в кадре»
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;