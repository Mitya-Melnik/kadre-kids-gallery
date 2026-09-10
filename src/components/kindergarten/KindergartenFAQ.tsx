import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { albumFaqs } from "@/components/FAQ";

type AlbumFaqItem = {
  question: string;
  answer: string;
  answerContent?: ReactNode;
};

type AlbumAudience = "kindergarten" | "school" | "grade4";

const schoolGuaranteeFaqs: AlbumFaqItem[] = [
  {
    question: "Как подтверждаются имя и персональный разворот?",
    answer: "Перед передачей альбомов в печать каждая семья отдельно проверяет и подтверждает имя выпускника, выбранный портрет и персональный разворот.",
  },
  {
    question: "Сколько разных фотографий будет у каждого выпускника?",
    answer: "Минимальное количество разных фотографий зависит от выбранного формата альбома. Заранее указываем его в предложении и фиксируем в договоре, чтобы каждый выпускник был полноценно представлен в своём альбоме.",
  },
  {
    question: "Что будет, если после печати обнаружится наша ошибка?",
    answer: "Если в напечатанном альбоме обнаружится допущенная нами ошибка, мы исправим макет и бесплатно перепечатаем альбом.",
  },
];

const albumQuestion = (question: string, audience: AlbumAudience) => {
  if (audience === "school" || audience === "grade4") {
    if (question === "Фотографируете ли вы воспитателей и учителей?") return "Фотографируете ли вы учителя?";
    if (question === "Получит ли воспитатель или учитель бесплатный альбом?") return "Получит ли учитель бесплатный альбом?";
    if (question === "Что делать, если ребёнок пропустил съёмку?") return audience === "grade4" ? question : "Что делать, если выпускник пропустил съёмку?";
    if (question === "Как родители выбирают портрет ребёнка?") return audience === "grade4" ? question : "Как выпускник выбирает портрет для альбома?";
    if (question === "Сколько разных фотографий будет у каждого выпускника?") return audience === "grade4" ? "Сколько разных фотографий будет у каждого ребёнка?" : question;
    return question;
  }
  if (question === "Фотографируете ли вы воспитателей и учителей?") return "Фотографируете ли вы воспитателей?";
  if (question === "Получит ли воспитатель или учитель бесплатный альбом?") return "Получат ли воспитатели бесплатные альбомы?";
  if (question === "Как проходит проверка макетов?") return "Как проверяются имя и персональные страницы?";
  return question;
};

const albumAnswer = (faq: AlbumFaqItem, audience: AlbumAudience) => {
  const isSchool = audience === "school" || audience === "grade4";
  const isGrade4 = audience === "grade4";
  switch (faq.question) {
    case "Какие выпускные альбомы можно заказать?":
      return isSchool
        ? <>Выбор разделён на три понятных уровня: <strong>«Доступная память о классе»</strong> — альбом-папка, трио или альбом на 6 страниц; <strong>«Школьные годы»</strong> — 10 страниц с личными фотографиями, друзьями и событиями класса; <strong>«Большая история»</strong> — 14 страниц и до 3 съёмочных дней, включая выпускной. Все альбомы имеют формат 21×30 см.</>
        : <>Выбор разделён на три понятных варианта: <strong>«Память о группе»</strong> — альбом-папка, трио или альбом на 6 страниц; <strong>«История детства»</strong> — 10 страниц с личными фотографиями и событиями группы; <strong>«Большая история»</strong> — 14 страниц и до 3 съёмочных дней, включая выпускной. Состав и стоимость каждого формата можно сравнить в каталоге выше.</>;
    case "Можно ли выбрать дизайн?":
      return isSchool
        ? `Да. Для школьных альбомов доступно 6 дизайнов. Класс выбирает один общий дизайн, а фотографии, имя и персональные страницы каждого ${isGrade4 ? "ребёнка" : "выпускника"} остаются индивидуальными.`
        : "Да. Группа выбирает два разных полноценных макета: один для мальчиков и один для девочек. Фотографии и данные каждого ребёнка остаются индивидуальными.";
    case "Есть ли минимальное количество альбомов?":
      return isSchool ? "Да. Минимальный тираж для школы — 15 альбомов одного выбранного формата." : faq.answer;
    case "Фотографируете ли вы воспитателей и учителей?":
      return isSchool ? `Да. В альбом можно добавить портрет ${isGrade4 ? "первого учителя" : "учителя"} и совместные фотографии с учениками.` : "Да. В альбом можно добавить портреты воспитателей и совместные фотографии с детьми.";
    case "Получит ли воспитатель или учитель бесплатный альбом?":
      return isSchool ? "Один альбом для классного руководителя предоставляется бесплатно." : "Один альбом для воспитателя предоставляется бесплатно. На второй альбом для второго воспитателя действует скидка 50%.";
    case "Что делать, если ребёнок пропустил съёмку?":
      return isSchool
        ? `Если ${isGrade4 ? "ребёнок" : "выпускник"} заболел или отсутствовал в основной день, бесплатно организуем дополнительную съёмку по договорённости, чтобы ${isGrade4 ? "он" : "выпускник"} не остался без личного портрета.`
        : faq.answer;
    case "Как родители выбирают портрет ребёнка?":
      return isSchool
        ? isGrade4
          ? "После съёмки родители выбирают основной портрет ребёнка в закрытой галерее. До печати семья отдельно подтверждает имя, портрет и персональный разворот. Общие фотографии для альбома отбирает наша команда."
          : "После съёмки выпускник вместе с родителями выбирает основной портрет в закрытой галерее. До печати семья отдельно подтверждает имя, портрет и персональный разворот. Общие фотографии для альбома отбирает наша команда."
        : faq.answer;
    case "Как проходит проверка макетов?":
      return `Каждый родитель проверяет данные и фотографии своего ребёнка. Ответственный родитель собирает замечания ${isSchool ? "всего класса" : "всей группы"} и передаёт их нам одним списком. На проверку предоставляется 7 дней. В стоимость входят до трёх согласованных этапов корректировок.`;
    case "Что такое «Письмо в будущее»?":
      return isSchool
        ? isGrade4
          ? "«Письмо в будущее» — это отдельный персональный разворот в альбоме «Большая история». На нём размещаются фотография ребёнка, его любимые школьные воспоминания, мечты и короткое послание себе будущему. Ответы собираем небольшой анкетой и оформляем в стиле выбранного альбома."
          : "«Письмо в будущее» — это отдельный персональный разворот в альбоме «Большая история». На нём размещаются фотография выпускника, важные воспоминания о классе, планы после школы и короткое послание себе через несколько лет. Ответы собираем небольшой анкетой и оформляем в стиле выбранного альбома."
        : "«Письмо в будущее» — это отдельный персональный разворот в альбоме «Большая история». На нём размещаются фотография ребёнка и его ответы на вопросы: кем он хочет стать, что любит делать, что ему запомнилось в детском саду и что он хотел бы пожелать себе взрослому. Родители заполняют небольшую анкету, а мы оформляем ответы в стиле выбранного альбома. Так сохраняются не только фотографии, но и мысли ребёнка в этом возрасте.";
    default:
      if (faq.answerContent) return faq.answerContent;
      if (!isSchool) return faq.answer;
      return faq.answer
        .replace(/группы или класса/g, "класса")
        .replace(/воспитателя или учителя/g, "учителя")
        .replace(/второго воспитателя/g, "учителя")
        .replace(/каждого выпускника/g, isGrade4 ? "каждого ребёнка" : "каждого выпускника")
        .replace(/выпускника/g, isGrade4 ? "ребёнка" : "выпускника");
  }
};

const KindergartenFAQ = ({ audience = "kindergarten" }: { audience?: AlbumAudience }) => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation(0.1);
  
  const [visibleCount, setVisibleCount] = useState(7);
  
  const priorityQuestions = [
    "Какие выпускные альбомы можно заказать?",
    "Что входит в стоимость?",
    "Как родители выбирают портрет ребёнка?",
    "Что делать, если ребёнок пропустил съёмку?",
    "Как проходит проверка макетов?",
    "Когда будут готовы альбомы?",
    "Заключаете ли вы договор?",
  ];
  const kindergartenFaqs = [
    ...priorityQuestions.map((question) => albumFaqs.find((faq) => faq.question === question)).filter(Boolean),
    ...albumFaqs.filter((faq) => !priorityQuestions.includes(faq.question)),
  ] as AlbumFaqItem[];
  const schoolFaqs: AlbumFaqItem[] = [
    ...(priorityQuestions.slice(0, 4).map((question) => albumFaqs.find((faq) => faq.question === question)).filter(Boolean) as AlbumFaqItem[]),
    schoolGuaranteeFaqs[0],
    schoolGuaranteeFaqs[1],
    schoolGuaranteeFaqs[2],
    ...albumFaqs.filter((faq) => !priorityQuestions.slice(0, 4).includes(faq.question)),
  ];
  const faqs: AlbumFaqItem[] = audience === "school" || audience === "grade4" ? schoolFaqs : kindergartenFaqs;
  const isSchoolAudience = audience === "school" || audience === "grade4";

  return (
    <section id={isSchoolAudience ? "school-faq" : "kindergarten-faq"} className="py-20 bg-accent-soft">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ответы на вопросы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Самые частые вопросы от родителей и администрации {isSchoolAudience ? "школ" : "детских садов"}
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
