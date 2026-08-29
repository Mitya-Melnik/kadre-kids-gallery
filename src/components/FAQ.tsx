import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FAQ = () => {
  const [visibleCount, setVisibleCount] = useState(7);
  const faqs = [
    {
      question: "Минимальное количество детей для выезда?",
      answer: "От 40 детей в одном корпусе."
    },
    {
      question: "Выезжаете ли за КАД?",
      answer: "Да, базово — в пределах 40 км от КАД, дальше — по договорённости."
    },
    {
      question: "Есть ли у фотографов медицинские книжки?",
      answer: "Да, у всех сотрудников есть действующие медицинские книжки для работы с детьми."
    },
    {
      question: "Можно ли оформить фотосессию по договору?",
      answer: "Да, можем заключить договор с учётом ваших требований."
    },
    {
      question: "Вы привозите настоящие декорации?",
      answer: "Да, мы привозим студийный свет и тематический декор, без «вставок» в Photoshop."
    },
    {
      question: "Сколько детей фотографируете за съёмку?",
      answer: "Выезжаем на съемку от 40 детей; с 9:00–12:30 сфотографируем около 100 человек."
    },
    {
      question: "Когда будут готовы фотографии?",
      answer: "Все снимки будут доступны для выбора на сайте через 7 дней после съёмки."
    },
    {
      question: "Оплатил, когда фото в электронном виде?",
      answer: "Сразу после оплаты — файлы доступны для скачивания в личном кабинете."
    },
    {
      question: "Как проходит выбор и оплата?",
      answer: "Входите в личный кабинет на сайте по логину и паролю (присылаем), выбираете фото и оплачиваете онлайн."
    },
    {
      question: "Какие способы оплаты доступны?",
      answer: "Карты (дебетовые и кредитные), СБП, QR-код, безналичный перевод. Чек придёт на e-mail."
    },
    {
      question: "Чек предоставляете ?",
      answer: "Да, после оплаты чек автоматически отправляется на указанный в заказе e-mail."
    },
    {
      question: "Могу оформить заказ с мобильного телефона?",
      answer: "Наш сайт полностью адаптирован под смартфоны и планшеты."
    },
    {
      question: "Можно ли купить фото без регистрации?",
      answer: "Нет, для приватности доступ к фотографиям только после регистрации."
    },
    {
      question: "Сколько времени даётся на покупку?",
      answer: "7 дней; Электронные файлы можно докупить в любое время."
    },
    {
      question: "Как отследить статус заказа?",
      answer: "Статус заказа отображается в личном кабинете Seenday. Если останутся вопросы, напишите нам в MAX по рабочему номеру."
    },
    {
      question: "Когда будут готовы напечатанные фото?",
      answer: "Печатные фотографии доставляем в учреждение в течение 10 дней после закрытия заказа."
    },
    {
      question: "Нужно ли вносить предоплату?",
      answer: "Нет. Родители платят только за те фото, которые понравились."
    },
    {
      question: "Кто может получить доступ к фото?",
      answer: "У каждого сада есть свой логин и пароль, посторонние не попадут к снимкам."
    },
    {
      question: "Будут ли все кадры со съемки доступны родителям?",
      answer: "Конечно. Мы загружаем все сделанные фотографии, и родители сами выбирают лучшие."
    },
    {
      question: "Обрабатываете ли вы фотографии?",
      answer: "Обязательно! Трёхэтапная обработка гарантирует естественную цветокоррекцию, точную ретушь и сохранение индивидуальности каждого кадра."
    },
    {
      question: "Будут ли кадры живыми и эмоциональными?",
      answer: "Обязательно: атмосфера и игровые механики помогают детям раскрываться (снимаем даже ясли)."
    },
    {
      question: "Какие размеры печатных фото доступны?",
      answer: "10×15, 15×21, 21×30 и 30×45 см. Также есть магниты и фотографии на холсте."
    },
    {
      question: "Можно ли купить только цифровые фото?",
      answer: "Да, электронные файлы доступны к покупке отдельно."
    },
    {
      question: "Где и как посмотреть готовые фотографии со съёмки?",
      answer: "Воспитатель пришлёт в чат группы инструкцию и данные для входа в закрытую галерею Seenday."
    },
    {
      question: "Как связаться с вами в MAX?",
      answer: "Найдите рабочий профиль «Дети в кадре» в MAX по номеру +7 995 600-21-11."
    },
    {
      question: "Как проходит отчётность для администрации сада?",
      answer: "После съёмки мы предоставляем заведующей подробный отчёт по каждому ребёнку."
    },
    {
      question: "Чем вы можете быть полезны детскому саду помимо съёмки?",
      answer: "Мы оформляем помещения (баннеры, стенды, музыкальный зал), проводим фотосъемку сотрудников."
    },
    {
      question: "Какие дополнительные услуги вы предлагаете?",
      answer: "Выпускные альбомы для детского сада, начальной и старшей школы. Съёмка выпускных, детских праздников, утренников, семейные и индивидуальные фотосессии."
    },
    {
      question: "Кто поможет родителям, если возникнут сложности при покупке фотографий?",
      answer: "Если после прочтения инструкции у родителей все равно возникнут сложности — 📍Мы рядом"
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } as const;


  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ответы на самые популярные вопросы
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.slice(0, visibleCount).map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-card rounded-xl px-6 shadow-soft hover:shadow-glow transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {visibleCount < faqs.length ? (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setVisibleCount(prev => Math.min(prev + 7, faqs.length))}
                className="bg-gradient-card hover:bg-gradient-card/80 border-primary/20 text-foreground shadow-soft hover:shadow-glow transition-all duration-300"
              >
                Смотреть еще
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
        
        <div className="text-center mt-16">
          <div className="bg-gradient-card p-8 rounded-xl shadow-soft max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Остались вопросы?
            </h3>
            <p className="text-muted-foreground mb-6">
              Напишите нам в MAX по рабочему номеру или оставьте заявку на консультацию.
            </p>
            <Button variant="default" size="lg" onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>
              Связаться с поддержкой
            </Button>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
};

export default FAQ;
