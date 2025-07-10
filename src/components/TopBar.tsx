import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Главная", href: "#hero" },
    { name: "О нас", href: "#values" },
    { name: "Галерея", href: "#gallery" },
    { name: "Преимущества", href: "#advantages" },
    { name: "Как проходит съемка", href: "#process" },
    { name: "Стоимость", href: "#pricing" },
    { name: "Вопросы и ответы", href: "#faq" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-border py-3 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Левая часть - логотип и дескриптор */}
          <div className="flex items-center gap-4">
            {/* Логотип */}
            <img 
              src="/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png" 
              alt="ЛЕМП ВКАДР" 
              className="h-8 sm:h-10"
            />
            
            {/* Дескриптор - только для десктопа */}
            <div className="hidden sm:block text-sm text-foreground/70 leading-tight">
              <div>фотосессии</div>
              <div>в детском саду</div>
            </div>
          </div>

          {/* Центр - WhatsApp (только для десктопа) */}
          <div className="flex-1 justify-center hidden sm:flex">
            <a 
              href="https://wa.me/79956002111" 
              className="flex flex-col items-center gap-1 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="font-medium text-foreground">WhatsApp</span>
              </div>
              <span className="text-sm text-foreground/70">+7 995 600 2111</span>
            </a>
          </div>

          {/* WhatsApp для мобильных */}
          <a 
            href="https://wa.me/79956002111" 
            className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-100 transition-colors sm:hidden"
            aria-label="WhatsApp"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
          
          {/* Правая часть - кнопка и меню */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Кнопка для десктопа */}
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:inline-flex px-6 py-3 shadow-soft hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95"
              onClick={() => scrollToSection("#cta")}
            >
              Пригласить в сад
            </Button>
            
            {/* Кнопка для мобильных */}
            <Button 
              variant="default" 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground sm:hidden px-4 py-2 shadow-soft hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95"
              onClick={() => scrollToSection("#cta")}
            >
              Пригласить
            </Button>
            
            {/* Гамбургер меню */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-80 animate-slide-in-right">
                <div className="flex flex-col gap-6 mt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Меню</h2>
                  
                  <nav className="flex flex-col gap-4">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(item.href)}
                        className="text-left p-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground hover:text-primary"
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                  
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;