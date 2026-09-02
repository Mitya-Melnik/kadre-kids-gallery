import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { albumFaqs } from "@/components/FAQ";

const kindergartenQuestion = (question: string) => {
  if (question === "Фотографируете ли вы воспитателей и учителей?") return "Фотографируете ли вы воспитателей?";
  if (question === "Получит ли воспитатель или учитель бесплатный альбом?") return "Получат ли воспитатели бесплатные альбомы?";
  return question;
};

const kindergartenAnswer = (faq: (typeof albumFaqs)[number]) => {
  switch (faq.question) {
    case "Какие выпускные альбомы можно заказать?":
      return <>Можно выбрать один из пяти вариантов: <strong>«Альбом-папка»</strong> — компактный и самый доступный формат; <strong>«Альбом-трио»</strong> — больше фотографий ребёнка, друзей и воспитателей; <strong>«Наша группа»</strong> — полноценный альбом на 6 страниц; <strong>«История детства»</strong> — 10 страниц с личными фотографиями и событиями группы; <strong>«Большая история»</strong> — 14 страниц и до 3 съёмочных дней, включая выпускной. Посмотреть состав и стоимость каждого альбома можно в каталоге выше.</>;
    case "Можно ли выбрать дизайн?":
      return "Да. Группа выбирает два разных полноценных макета: один для мальчиков и один для девочек. Фотографии и данные каждого ребёнка остаются индивидуальными.";
    case "Фотографируете ли вы воспитателей и учителей?":
      return "Да. В альбом можно добавить портреты воспитателей и совместные фотографии с детьми.";
    case "Получит ли воспитатель или учитель бесплатный альбом?":
      return "Один альбом для воспитателя предоставляется бесплатно. На второй альбом для второго воспитателя действует скидка 50%.";
    case "Как проходит проверка макетов?":
      return "Каждый родитель проверяет данные и фотографии своего ребёнка. Ответственный родитель собирает замечания всей группы и передаёт их нам одним списком. На проверку предоставляется 7 дней. В стоимость входят до трёх согласованных этапов корректировок.";
    default:
      return "answerContent" in faq ? faq.answerContent : faq.answer;
  }
};

const KindergartenFAQ = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation(0.1);
  
  const [visibleCount, setVisibleCount] = useState(7);
  
  const faqs = albumFaqs;

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
                    <span className="text-lg font-semibold text-foreground">
                      {kindergartenQuestion(faq.question)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {kindergartenAnswer(faq)}
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
