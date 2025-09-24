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
      question: "Вы работаете по предоплате?",
      answer: "Нет, предоплата не требуется. Родители оплачивают только те фотографии, которые им понравились, после просмотра всех снимков в личном кабинете."
    },
    {
      emoji: "🏢",
      question: "Кто оплачивает и бронирует студию?",
      answer: "Мы полностью берем на себя организацию съемки. Студию бронируем и оплачиваем самостоятельно, детский сад ничего не доплачивает."
    },
    {
      emoji: "👩‍🏫",
      question: "А альбом воспитателю?",
      answer: "Конечно! Альбом для воспитателя включен в стоимость и предоставляется бесплатно как благодарность за помощь в организации съемки."
    },
    {
      emoji: "📅",
      question: "Как долго длится съемка в детском саду?",
      answer: "Обычно съемка занимает 3-4 часа. За это время мы успеваем сфотографировать всех детей индивидуально и группой, провести тематические кадры."
    },
    {
      emoji: "👶",
      question: "Работаете ли вы с детьми ясельного возраста?",
      answer: "Да, мы специализируемся на работе с детьми всех возрастов, включая ясельные группы. У нас есть особые подходы для малышей 2-3 лет."
    },
    {
      emoji: "🎭",
      question: "Какие декорации вы привозите?",
      answer: "Мы привозим полноценные тематические декорации: фоны, реквизит, освещение. Создаем мини-студию прямо в детском саду без необходимости куда-то ехать."
    },
    {
      emoji: "📸",
      question: "Сколько фотографий получает каждый ребенок?",
      answer: "В среднем каждый ребенок получает 15-20 индивидуальных фотографий плюс групповые снимки. Все фото проходят обработку и ретушь."
    },
    {
      emoji: "💊",
      question: "Что если ребенок заболел в день съемки?",
      answer: "Мы бесплатно доснимем отсутствующих детей в течение месяца после основной съемки. Здоровье детей - приоритет."
    },
    {
      emoji: "📋",
      question: "Какие документы нужны для съемки?",
      answer: "У нас есть все необходимые документы: медкнижки, лицензии, страховка. Также поможем оформить согласия родителей на съемку."
    },
    {
      emoji: "💻",
      question: "Как родители увидят и выберут фотографии?",
      answer: "Через 7 дней все фото появляются в личном кабинете на нашем сайте. Каждая семья получает уникальный логин и пароль."
    },
    {
      emoji: "🎁",
      question: "Есть ли скидки для больших групп?",
      answer: "Да, действуют скидки для групп от 25 детей. Также есть специальные предложения при заказе нескольких групп из одного сада."
    },
    {
      emoji: "🚗",
      question: "Выезжаете ли в область?",
      answer: "Да, выезжаем по всей Ленинградской области. Базово - в пределах 40 км от КАД, дальше - по договоренности."
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