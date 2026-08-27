import { Menu, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuItems = [
    { name: "Главная", href: "/" },
    { name: "Выпускные альбомы", href: "/kindergarten" },
    { name: "Фотодни", href: "/#gallery" },
    { name: "Почему мы", href: "/#advantages" },
    { name: "Как проходит съёмка", href: "/#process" },
    { name: "Стоимость фотографий", href: "/#pricing" },
    { name: "Вопросы и ответы", href: "/#faq" },
  ];

  const handleMenuClick = (href: string) => {
    if (href.startsWith("/#") && window.location.pathname === "/") {
      document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
    setIsMenuOpen(false);
  };

  const openParentGallery = () => {
    window.open("https://seenday.com/ru/login", "_blank", "noopener,noreferrer");
  };

  return (
    <header className={`sticky top-0 z-50 border-b border-border py-3 transition-all duration-300 ${
      isScrolled ? "bg-background/90 shadow-soft backdrop-blur" : "bg-background"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <a href="/" className="block flex-none" aria-label="Дети в кадре — главная">
              <img
                src="/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png"
                alt="Дети в кадре"
                className="h-8 transition-opacity hover:opacity-90 sm:h-10"
              />
            </a>
            <div className="hidden border-l border-border pl-4 text-xs leading-tight text-muted-foreground sm:block">
              <div>фотодни и альбомы</div>
              <div>для детских садов и школ</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Основная навигация">
            <button onClick={() => handleMenuClick("/kindergarten")} className="text-sm font-medium hover:text-primary">
              Выпускные альбомы
            </button>
            <button onClick={() => handleMenuClick("/#gallery")} className="text-sm font-medium hover:text-primary">
              Фотодни
            </button>
            <button onClick={() => handleMenuClick("/#advantages")} className="text-sm font-medium hover:text-primary">
              Почему мы
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href="tel:+79956002111" className="hidden items-center gap-2 text-sm font-semibold text-foreground hover:text-primary md:flex">
              <Phone className="h-4 w-4 text-primary" />
              +7 995 600-21-11
            </a>
            <Button size="sm" className="shadow-soft sm:px-4" onClick={openParentGallery}>
              <span className="hidden sm:inline">Получить фотографии</span>
              <span className="sm:hidden">Получить фото</span>
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-lg" aria-label="Открыть меню">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex h-full flex-col justify-between py-4">
                  <div>
                    <h2 className="mb-5 text-2xl font-bold text-foreground">Меню</h2>
                    <nav className="flex flex-col gap-1">
                      {menuItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => handleMenuClick(item.href)}
                          className="rounded-lg p-3 text-left text-base font-medium text-foreground transition-colors hover:bg-accent/60 hover:text-primary"
                        >
                          {item.name}
                        </button>
                      ))}
                    </nav>
                    <Button className="mt-5 w-full" onClick={() => handleMenuClick("/#cta")}>
                      Обсудить съёмку
                    </Button>
                  </div>

                  <div className="space-y-3 border-t border-border pt-5">
                    <a href="tel:+79956002111" className="flex items-center gap-3 font-semibold text-foreground hover:text-primary">
                      <Phone className="h-5 w-5 text-primary" />
                      +7 995 600-21-11
                    </a>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      До запуска MAX-бота для связи доступны действующие каналы.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="https://wa.me/79956002111"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent/60"
                      >
                        WhatsApp
                      </a>
                      <a
                        href="https://t.me/detivkadre_spb"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent/60"
                      >
                        Telegram
                      </a>
                      <span
                        className="cursor-default rounded-lg border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground"
                        title="Ссылка появится после создания группы"
                      >
                        ВКонтакте — скоро
                      </span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
