import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenFAQ = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation(0.1);
  
  const [visibleCount, setVisibleCount] = useState(7);
  
  const faqs = [
    {
      emoji: "💰",
      question: "Вы берёте предоплату?",
      answer: "Да, 50% для брони даты. Заключаем договор. Остаток оплачивается после съёмки."
    },
    {
      emoji: "💊",
      question: "Что если ребёнок заболел или пропустил съёмку?",
      answer: "Сделаем бесплатную досъёмку — ваш ребёнок точно будет в альбоме."
    },
    {
      emoji: "📸",
      question: "Все фото будут доступны или только часть?",
      answer: "Отдаём все удачные кадры, а не только те, что попали в альбом."
    },
    {
      emoji: "⏰",
      question: "Когда будут готовы альбомы?",
      answer: "Обычно весь процесс занимает около 10–14 рабочих дней после съёмки и утверждения макетов. Мы гарантируем готовность к выпускному, если съёмка проведена заранее (дата фиксируется в договоре)."
    },
    {
      emoji: "🏥",
      question: "Что если ребенок заболел в день съемки?",
      answer: "Мы бесплатно доснимем отсутствующих детей в течение месяца после основной съемки."
    },
    {
      emoji: "📅",
      question: "Как долго длится фотосъемка в саду?",
      answer: "Обычно съемка занимает 3-4 часа. За это время мы успеваем сфотографировать всех детей индивидуально и группой, провести тематические кадры."
    },
    {
      emoji: "📷",
      question: "Сколько фотографий получает каждый ребенок?",
      answer: "В среднем для каждого ребенка получается 8-12 индивидуальных фотографий плюс групповые снимки. Все фото проходят обработку и ретушь."
    },
    {
      emoji: "🤖",
      question: "Как проходит обработка фото?",
      answer: "Да, мы используем AI-инструменты для ускорения обработки, но каждый финальный образ просматривает и дорабатывает ретушёр вручную. Благодаря этому лица и эмоции остаются живыми и натуральными."
    },
    {
      emoji: "🎨",
      question: "Можно выбрать дизайн альбома?",
      answer: "Да. На сайте доступно 12 готовых макетов, группа выбирает один для всего выпуска."
    },
    {
      emoji: "📦",
      question: "Что входит в пакет? Можно ли добавить опции?",
      answer: "Всё под ключ. В каждом пакете уже включены съёмка, индивидуальные портреты, групповая фотография и сами альбомы. Дополнительно можно заказать индивидуальные развороты (+350 ₽/разворот)."
    },
    {
      emoji: "🚚",
      question: "Как происходит доставка?",
      answer: "Готовые альбомы доставляем Яндекс-доставкой в ближайший к вам пункт выдачи."
    },
    {
      emoji: "👩‍🏫",
      question: "А альбом воспитателю?",
      answer: "Конечно! Альбом для воспитателя включен в стоимость и предоставляется бесплатно."
    }
  ];

  return (
    <section id="kindergarten-faq" className="py-20 bg-accent-soft">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ответы на вопросы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Самые частые вопросы от родителей и администрации детских садов
          </p>
        </div>
        
        <div 
          ref={accordionRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${accordionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.slice(0, visibleCount).map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-card rounded-xl px-6 shadow-soft hover:shadow-glow transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <div className="flex items-center gap-4 pr-4">
                    <span className="text-2xl flex-shrink-0">{faq.emoji}</span>
                    <span className="text-lg font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="ml-12">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {visibleCount < faqs.length ? (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setVisibleCount(prev => Math.min(prev + 5, faqs.length))}
                className="bg-gradient-card hover:bg-gradient-card/80 border-primary/20 text-foreground shadow-soft hover:shadow-glow transition-all duration-300 px-8 py-3"
              >
                Смотреть ещё
              </Button>
            </div>
          ) : (
            faqs.length > 7 && (
              <div className="text-center mt-8">
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => setVisibleCount(7)}
                  className="border border-border text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all duration-300"
                >
                  Свернуть
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default KindergartenFAQ;