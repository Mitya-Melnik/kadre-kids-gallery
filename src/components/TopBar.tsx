import { Menu, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { contacts } from "@/config/contacts";
import { reachGoal } from "@/lib/analytics";
import { useLocation } from "react-router-dom";

const TopBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mainMenuItems = [
    { name: "Главная", href: "/" },
    { name: "Выпускные альбомы", href: "/kindergarten" },
    { name: "Фотодни", href: "/#gallery" },
    { name: "Почему мы", href: "/#advantages" },
    { name: "Как проходит съёмка", href: "/#process" },
    { name: "Стоимость фотографий", href: "/#pricing" },
    { name: "Вопросы и ответы", href: "/#faq" },
  ];
  const albumMenuItems = [
    { name: "Главная", href: "/" },
    { name: "Альбомы и цены", href: "#albums" },
    { name: "Как создаётся альбом", href: "#process" },
    { name: "Макеты", href: "#layouts" },
    { name: "Примеры съёмки", href: "#gallery" },
    { name: "Вопросы и ответы", href: "#kindergarten-faq" },
  ];
  const isAlbumPage = location.pathname === "/kindergarten";
  const menuItems = isAlbumPage ? albumMenuItems : mainMenuItems;

  const handleMenuClick = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
      return;
    }
    if (href.startsWith("/#") && window.location.pathname === "/") {
      document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = href;
    }
    setIsMenuOpen(false);
  };

  const openParentGallery = () => {
    reachGoal("get_photos_click");
    window.open(contacts.seendayUrl, "_blank", "noopener,noreferrer");
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
            {(isAlbumPage ? albumMenuItems.slice(1, 4) : mainMenuItems.slice(1, 4)).map((item) => (
              <button key={item.href} onClick={() => handleMenuClick(item.href)} className="text-sm font-medium hover:text-primary">
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={contacts.phone.href} className="hidden shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground hover:text-primary md:flex">
              <Phone className="h-4 w-4 text-primary" />
              {contacts.phone.display}
            </a>
            <Button size="sm" className="px-3 text-xs shadow-soft sm:px-4 sm:text-sm" onClick={openParentGallery}>
              Получить фотографии
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
                    <a href={contacts.phone.href} className="flex items-center gap-3 font-semibold text-foreground hover:text-primary">
                      <Phone className="h-5 w-5 text-primary" />
                      {contacts.phone.display}
                    </a>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Напишите нам в MAX — найдите рабочий профиль по номеру телефона.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contacts.max.inviteUrl ? (
                        <a href={contacts.max.inviteUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent/60">
                          Написать в MAX
                        </a>
                      ) : (
                        <span className="rounded-lg border border-border px-4 py-2 text-sm font-medium">
                          MAX: {contacts.max.display}
                        </span>
                      )}
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
