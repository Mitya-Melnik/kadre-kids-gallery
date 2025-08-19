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
    <section id="cta" className="py-20 bg-accent-soft">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16">
            Бесплатные материалы для родителей и детских садов
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-stretch">
            {/* Карточка для родителей */}
            <Card className="bg-background border border-border hover:shadow-glow transition-all duration-300 hover-lift flex flex-col h-full">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Чек-лист для родителей: как подготовить ребёнка к фотосессии
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Практичный чек-лист с советами психолога и фотографа
                </p>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-end">
                <Button 
                  variant="default" 
                  size="xl" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 shadow-glow hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95 mb-2"
                  onClick={handleParentsClick}
                >
                  Скачать чек-лист бесплатно
                </Button>
                <p className="text-muted-foreground/70 text-sm">
                  👉 В один клик в Telegram
                </p>
              </CardContent>
            </Card>

            {/* Карточка для администрации */}
            <Card className="bg-background border border-border hover:shadow-glow transition-all duration-300 hover-lift flex flex-col h-full">
              <CardHeader className="text-center pb-4 flex-shrink-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Подарки для детского сада
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Презентация с услугами: фотосъёмка, баннеры, оформление стендов
                </p>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-end">
                <Button 
                  variant="default" 
                  size="xl" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 shadow-glow hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95 mb-2"
                  onClick={handleAdminClick}
                >
                  Скачать презентацию
                </Button>
                <p className="text-muted-foreground/70 text-sm">
                  👉 В один клик в Telegram
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ссылка на канал */}
          <div className="text-center">
            <button 
              onClick={handleChannelClick}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm underline underline-offset-4"
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