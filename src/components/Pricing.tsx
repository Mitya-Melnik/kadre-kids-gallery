import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [pricingType, setPricingType] = useState<"photo-day" | "albums">("photo-day");

  const photoDayPackages = [
    {
      id: "photoshoot",
      title: "Фотосъёмка",
      price: "Бесплатно",
      description: "Бесплатно! Заказывайте только понравившиеся снимки",
      popular: false
    },
    {
      id: "online",
      title: "Файлы онлайн",
      price: "399 ₽",
      description: "Цифровые фотографии в высоком качестве",
      note: "При заказе печатных фото от 1890₽ — в подарок!",
      popular: true
    },
    {
      id: "print",
      title: "Печать фото",
      price: "От 410 ₽",
      description: "Классическая печать разных форматов",
      items: [
        { size: "10×15", price: "410 ₽", note: "Классический размер, четверть А4" },
        { size: "15×21", price: "479 ₽", note: "Увеличенный формат, половина А4" },
        { size: "21×30", price: "600 ₽", note: "Для рамки на стол, А4" },
        { size: "30×45", price: "900 ₽", note: "Большой формат для стены, А3" }
      ]
    },
    {
      id: "gifts",
      title: "Фото-подарки",
      price: "От 500 ₽",
      description: "Магниты и художественная печать на холсте",
      items: [
        { size: "Магнит 7×10", price: "500 ₽", note: "На холодильник" },
        { size: "Магнит 10×15", price: "550 ₽", note: "Увеличенный магнит" },
        { size: "Картина на холсте 20×30, А4", price: "2900 ₽", note: "Художественная печать" },
        { size: "Картина на холсте 30×45, А3", price: "4500 ₽", note: "Большой художественный холст" }
      ]
    }
  ];

  const albumPackages = [
    {
      id: "folder",
      title: "Альбом-папка",
      price: "2 700 ₽",
      description: "Компактный выпускной альбом",
      items: [
        { size: "Формат", price: "20×30 см", note: "Твёрдая обложка и один разворот" },
        { size: "Фотосъёмка", price: "1 день", note: "Портреты выпускников и общие фотографии" }
      ]
    },
    {
      id: "trio",
      title: "Альбом-трио",
      price: "2 950 ₽",
      description: "Три плотных разворота с главными кадрами",
      items: [
        { size: "Формат", price: "20×30 см", note: "Твёрдая обложка и три разворота" },
        { size: "Фотосъёмка", price: "1 день", note: "Портреты, друзья и общие фотографии" }
      ]
    },
    {
      id: "six-pages",
      title: "Альбом, 6 страниц",
      price: "3 300 ₽",
      description: "Небольшая история выпускной группы",
      items: [
        { size: "Объём", price: "6 страниц", note: "Портреты ребёнка, друзей и воспитателей" },
        { size: "Фотосъёмка", price: "1 день", note: "Живые и постановочные кадры" }
      ]
    },
    {
      id: "ten-pages",
      title: "Альбом, 10 страниц",
      price: "3 900 ₽",
      description: "Больше личных кадров и событий группы",
      popular: true,
      items: [
        { size: "Объём", price: "10 страниц", note: "Полная история группы в одном альбоме" },
        { size: "Фотосъёмка", price: "1 день", note: "Портреты, друзья и общие моменты" }
      ]
    },
    {
      id: "fourteen-pages",
      title: "Альбом, 14 страниц",
      price: "6 500 ₽",
      description: "Максимальная версия выпускного альбома",
      items: [
        { size: "Объём", price: "14 страниц", note: "Расширенная персональная история ребёнка" },
        { size: "Фотосъёмка", price: "до 3 дней", note: "Больше образов, сюжетов и живых кадров" }
      ]
    }
  ];

  const packages = pricingType === "photo-day" ? photoDayPackages : albumPackages;

  return (
    <section id="pricing" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Стоимость
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Прозрачные цены без скрытых платежей
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-muted p-1" role="tablist" aria-label="Выбор направления">
            <button
              type="button"
              role="tab"
              aria-selected={pricingType === "photo-day"}
              onClick={() => setPricingType("photo-day")}
              className={`rounded-lg px-5 py-3 text-sm md:text-base font-semibold transition-all ${pricingType === "photo-day" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Фотодни
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={pricingType === "albums"}
              onClick={() => setPricingType("albums")}
              className={`rounded-lg px-5 py-3 text-sm md:text-base font-semibold transition-all ${pricingType === "albums" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Выпускные альбомы
            </button>
          </div>
        </div>

        {pricingType === "albums" && (
          <p className="text-center text-muted-foreground mb-8">
            Цены на выпускные альбомы для детского сада
          </p>
        )}
        
        {/* Desktop версия - вертикальный аккордеон */}
        <div className="hidden md:block max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {packages.map((pkg) => (
              <AccordionItem 
                key={pkg.id} 
                value={pkg.id} 
                className={`border border-border rounded-xl overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                <AccordionTrigger className="hover:no-underline px-6 py-4 bg-gradient-card hover:bg-gradient-card/80 transition-all duration-200 ease-in-out hover:scale-[1.01]">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          {pkg.title}
                        </h3>
                        {pkg.popular && (
                          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                            Популярное
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pkg.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {pkg.price}
                      </div>
                      {pkg.note && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {pkg.note}
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {pkg.items ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {pkg.items.map((item, index) => (
                        <div key={index} className="bg-background p-4 rounded-lg border border-border">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-foreground">{item.size}</h4>
                            <span className="text-lg font-bold text-primary">{item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center mt-4">
                      <p className="text-muted-foreground mb-4">
                        После съемки на сайте выбираете понравившиеся фотографии и оплачиваете онлайн
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Mobile версия - вертикальный аккордеон */}
        <div className="md:hidden max-w-md mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {packages.map((pkg) => (
              <AccordionItem 
                key={pkg.id} 
                value={pkg.id} 
                className={`border border-border rounded-xl overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                <AccordionTrigger className="hover:no-underline px-4 py-4 bg-gradient-card hover:bg-gradient-card/80 transition-all duration-200 ease-in-out hover:scale-[1.01] [&[data-state=open]>div>span]:rotate-90">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {pkg.title}
                        </h3>
                        {pkg.popular && (
                          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                            Популярное
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {pkg.price}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pkg.description}
                      </p>
                      {pkg.note && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {pkg.note}
                        </p>
                      )}
                    </div>
                    <span className="text-primary text-lg transition-transform duration-300 ease-in-out">
                      ▶
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {pkg.items ? (
                    <div className="space-y-3 mt-4">
                      {pkg.items.map((item, index) => (
                        <div key={index} className="bg-background p-3 rounded-lg border border-border">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium text-foreground">{item.size}</h4>
                            <span className="text-lg font-bold text-primary">{item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-muted-foreground">
                        После съемки на сайте выбираете понравившиеся фотографии и оплачиваете онлайн
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {pricingType === "photo-day" ? (
        <div className="mt-16 bg-accent-soft p-8 rounded-xl max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Специальное предложение
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            При заказе печатной продукции от 1890 рублей — электронные версии всех фотографий в подарок!
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold">
              Экономия до 399 ₽ на каждом фото
            </div>
          </div>
        </div>
        ) : (
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/kindergarten">Посмотреть альбомы подробнее</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
