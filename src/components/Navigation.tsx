import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-16 right-4 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="hero" 
            size="icon" 
            className="rounded-full shadow-glow"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-80">
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
            
            <div className="mt-8 pt-6 border-t border-border">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={() => scrollToSection("#cta")}
              >
                Получить презентацию
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;