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

          {/* Центр - Социальные сети (только для десктопа) */}
          <div className="flex-1 justify-center hidden sm:flex">
            <div className="flex items-center gap-6">
              {/* WhatsApp */}
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

              {/* Telegram */}
              <a 
                href="https://t.me/your_telegram" 
                className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>

              {/* VKontakte */}
              <a 
                href="https://vk.com/your_vk" 
                className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-800 hover:text-blue-900 hover:bg-blue-100 transition-colors"
                aria-label="VKontakte"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.713-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.558c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.795.78 1.203 1.254.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Социальные сети для мобильных */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/79956002111" 
              className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 hover:text-green-700 hover:bg-green-100 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>

            {/* Telegram */}
            <a 
              href="https://t.me/your_telegram" 
              className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-colors"
              aria-label="Telegram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>

            {/* VKontakte */}
            <a 
              href="https://vk.com/your_vk" 
              className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-800 hover:text-blue-900 hover:bg-blue-100 transition-colors"
              aria-label="VKontakte"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.713-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.558c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.795.78 1.203 1.254.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
              </svg>
            </a>
          </div>
          
          {/* Правая часть - кнопка и меню */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Кнопка для десктопа */}
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:inline-flex px-6 py-3 shadow-soft hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95"
              onClick={() => window.open("https://seenday.com/ru/login", "_blank")}
            >
              Личный кабинет
            </Button>
            
            {/* Кнопка для мобильных */}
            <Button 
              variant="default" 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground sm:hidden px-4 py-2 shadow-soft hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out active:scale-95"
              onClick={() => window.open("https://seenday.com/ru/login", "_blank")}
            >
              Кабинет
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
                <div className="flex flex-col h-full overflow-y-auto py-4">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Меню</h2>
                  
                  <nav className="flex flex-col gap-1">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSection(item.href)}
                        className="text-left p-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground hover:text-primary text-lg font-medium"
                      >
                        {item.name}
                      </button>
                    ))}
                    
                    {/* Кнопка "Заказать съемку" в меню */}
                    <Button 
                      variant="hero" 
                      className="mt-3 w-full text-base"
                      onClick={() => scrollToSection("#cta")}
                    >
                      Заказать съемку
                    </Button>
                  </nav>

                  {/* Контакты */}
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                    <h3 className="text-base font-semibold text-foreground">Контакты</h3>
                    
                    {/* Телефон */}
                    <a 
                      href="tel:+79956002111" 
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-base font-medium text-foreground">+7 995 600 2111</div>
                      </div>
                    </a>

                    {/* Социальные сети */}
                    <div className="space-y-1">
                      {/* WhatsApp */}
                      <a 
                        href="https://wa.me/79956002111" 
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                        </div>
                        <span className="text-base font-medium text-green-600">WhatsApp</span>
                      </a>

                      {/* Telegram */}
                      <a 
                        href="https://t.me/your_telegram" 
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </div>
                        <span className="text-base font-medium text-blue-600">Telegram</span>
                      </a>

                      {/* VKontakte */}
                      <a 
                        href="https://vk.com/your_vk" 
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-800" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.713-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.558c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.795.78 1.203 1.254.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
                          </svg>
                        </div>
                        <span className="text-base font-medium text-blue-800">ВКонтакте</span>
                      </a>
                    </div>
                  </div>
                  
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