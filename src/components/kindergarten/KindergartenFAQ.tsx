import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { albumFaqs } from "@/components/FAQ";

const albumQuestion = (question: string, audience: "kindergarten" | "school") => {
  if (audience === "school") {
    if (question === "Фотографируете ли вы воспитателей и учителей?") return "Фотографируете ли вы учителя?";
    if (question === "Получит ли воспитатель или учитель бесплатный альбом?") return "Получит ли учитель бесплатный альбом?";
    return question;
  }
  if (question === "Фотографируете ли вы воспитателей и учителей?") return "Фотографируете ли вы воспитателей?";
  if (question === "Получит ли воспитатель или учитель бесплатный альбом?") return "Получат ли воспитатели бесплатные альбомы?";
  return question;
};

const albumAnswer = (faq: (typeof albumFaqs)[number], audience: "kindergarten" | "school") => {
  const isSchool = audience === "school";
  switch (faq.question) {
    case "Какие выпускные альбомы можно заказать?":
      return <>Можно выбрать один из пяти вариантов: <strong>«Альбом-папка»</strong> — компактный и самый доступный формат; <strong>«Альбом-трио»</strong> — больше фотографий ребёнка, друзей и {isSchool ? "учителя" : "воспитателей"}; <strong>{isSchool ? "«Наш класс»" : "«Наша группа»"}</strong> — полноценный альбом на 6 страниц; <strong>«История детства»</strong> — 10 страниц с личными фотографиями и событиями {isSchool ? "класса" : "группы"}; <strong>«Большая история»</strong> — 14 страниц и до 3 съёмочных дней, включая выпускной. Все альбомы имеют формат 21×30 см. Посмотреть состав и стоимость каждого альбома можно в каталоге выше.</>;
    case "Можно ли выбрать дизайн?":
      return isSchool
        ? "Да. Для школьных альбомов доступно 6 дизайнов. Класс выбирает один общий дизайн, а если потребуется, можем подготовить два варианта — например, отдельно для мальчиков и девочек. Фотографии и данные каждого ребёнка остаются индивидуальными."
        : "Да. Группа выбирает два разных полноценных макета: один для мальчиков и один для девочек. Фотографии и данные каждого ребёнка остаются индивидуальными.";
    case "Есть ли минимальное количество альбомов?":
      return isSchool ? "Да. Минимальный тираж для школы — 15 альбомов одного выбранного формата." : faq.answer;
    case "Фотографируете ли вы воспитателей и учителей?":
      return isSchool ? "Да. В альбом можно добавить портрет учителя и совместные фотографии с учениками." : "Да. В альбом можно добавить портреты воспитателей и совместные фотографии с детьми.";
    case "Получит ли воспитатель или учитель бесплатный альбом?":
      return isSchool ? "Один альбом для классного руководителя предоставляется бесплатно." : "Один альбом для воспитателя предоставляется бесплатно. На второй альбом для второго воспитателя действует скидка 50%.";
    case "Как проходит проверка макетов?":
      return `Каждый родитель проверяет данные и фотографии своего ребёнка. Ответственный родитель собирает замечания ${isSchool ? "всего класса" : "всей группы"} и передаёт их нам одним списком. На проверку предоставляется 7 дней. В стоимость входят до трёх согласованных этапов корректировок.`;
    case "Что такое «Письмо в будущее»?":
      return `«Письмо в будущее» — это отдельный персональный разворот в альбоме «Большая история». На нём размещаются фотография ребёнка и его ответы на вопросы: кем он хочет стать, что любит делать, что ему запомнилось ${isSchool ? "в школе" : "в детском саду"} и что он хотел бы пожелать себе взрослому. Родители заполняют небольшую анкету, а мы оформляем ответы в стиле выбранного альбома. Так сохраняются не только фотографии, но и мысли ребёнка в этом возрасте.`;
    default:
      if ("answerContent" in faq) return faq.answerContent;
      return isSchool ? faq.answer.replace(/группы или класса/g, "класса").replace(/воспитателя или учителя/g, "учителя").replace(/второго воспитателя/g, "учителя") : faq.answer;
  }
};

const KindergartenFAQ = ({ audience = "kindergarten" }: { audience?: "kindergarten" | "school" }) => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation(0.1);
  
  const [visibleCount, setVisibleCount] = useState(7);
  
  const faqs = albumFaqs;

  return (
    <section id={audience === "school" ? "school-faq" : "kindergarten-faq"} className="py-20 bg-accent-soft">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ответы на вопросы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Самые частые вопросы от родителей и администрации {audience === "school" ? "школ" : "детских садов"}
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
                      {albumQuestion(faq.question, audience)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {albumAnswer(faq, audience)}
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
