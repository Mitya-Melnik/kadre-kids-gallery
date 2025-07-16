import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Pricing = () => {
  const packages = [
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
      note: "При заказе от 1890₽ — в подарок!",
      popular: true
    },
    {
      id: "print",
      title: "Печать фото",
      price: "От 410 ₽",
      description: "Классическая печать разных форматов",
      items: [
        { size: "10×15", price: "410 ₽", note: "Классический размер для альбома" },
        { size: "15×21", price: "479 ₽", note: "Увеличенный формат" },
        { size: "21×30", price: "600 ₽", note: "Для рамки на стол" },
        { size: "30×45", price: "900 ₽", note: "Большой формат для стены" }
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
        { size: "Холст 20×30", price: "2900 ₽", note: "Художественная печать" },
        { size: "Холст 30×45", price: "4500 ₽", note: "Большой художественный холст" }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Стоимость
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Прозрачные цены без скрытых платежей.<br />
            Заказывайте только понравившиеся снимки
          </p>
        </div>
        
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
                          <span className="bg-gradient-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                          <span className="bg-gradient-accent text-white px-2 py-1 rounded-full text-xs font-semibold">
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
      </div>
    </section>
  );
};

export default Pricing;