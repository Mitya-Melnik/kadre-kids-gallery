import { useEffect, useState } from "react";
import { Camera, GraduationCap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type FaqType = "photo-day" | "album";

const photoDayFaqs = [
  { question: "Где и когда можно посмотреть фотографии?", answer: "Через 7 дней после съёмки воспитатель или представитель класса передаст родителям ссылку и данные для входа в закрытую галерею Seenday." },
  { question: "Кто сможет увидеть фотографии?", answer: "Доступ получают родители детского сада или школы. В закрытой галерее фотографии разделены по группам или классам." },
  { question: "Нужно ли оплачивать фотосъёмку заранее?", answer: "Нет. Фотосъёмка бесплатная — родители оплачивают только те фотографии и товары, которые им понравились." },
  { question: "Как выбрать и оплатить фотографии?", answer: "В закрытой галерее Seenday можно посмотреть фотографии, выбрать понравившиеся кадры и товары, а затем оплатить заказ онлайн. Доступны дебетовые и кредитные карты, СБП, оплата по QR-коду и безналичный перевод. Чек придёт на указанный в заказе e-mail." },
  { question: "Когда можно скачать электронные фотографии?", answer: "Электронные файлы становятся доступны для скачивания в течение 5 минут после оплаты заказа." },
  { question: "Когда доставят напечатанные фотографии?", answer: "Печатные фотографии доставляем в детский сад или школу в течение 10 дней после закрытия общего периода заказов." },
  { question: "Сколько времени даётся на оформление заказа?", answer: "Галерея открыта для выбора и оформления печатного заказа в течение 7 дней. После закрытия этого периода все печатные заказы группы или класса одновременно передаются в производство." },
  { question: "Нужна ли регистрация?", answer: "Да. Регистрация защищает фотографии, сохраняет заказы и открывает доступ к купленным файлам. Она занимает около 1 минуты: зарегистрироваться можно через Т-Банк, Сбер ID или по номеру телефона." },
  { question: "Все ли фотографии со съёмки попадут в галерею?", answer: "В галерею загружаем все удачные обработанные фотографии. Технические дубли, моргания и неудачные кадры предварительно убираем." },
  { question: "Что делать, если ребёнок стесняется фотографироваться?", answer: "Мы снимаем в знакомой ребёнку обстановке, через игру и общение. Не заставляем позировать и даём время привыкнуть к фотографу и декорациям." },
  { question: "Используете ли вы настоящие декорации?", answer: "Да. Мы привозим в учреждение мобильную фотостудию: тематические декорации, реквизит и профессиональный свет. Фон не подставляется вместо реальной фотозоны после съёмки." },
  { question: "Обрабатываете ли вы фотографии?", answer: "Да. Все кадры для галереи проходят цветокоррекцию и аккуратную ретушь. При этом мы сохраняем естественную внешность и эмоции ребёнка." },
  { question: "Какие товары можно заказать?", answer: "Доступны фотографии 10×15, 15×21, 21×30 и 30×45 см, электронные файлы, магниты и фотографии на холсте." },
  { question: "Есть ли у фотографов медицинские книжки?", answer: "Да. У всех сотрудников, работающих с детьми в учреждениях, есть действующие медицинские книжки." },
  { question: "Можно ли заключить договор?", answer: "Да. Условия съёмки, сроки и ответственность сторон можем зафиксировать в договоре." },
  { question: "Какое минимальное количество детей необходимо?", answer: "Фотодень организуем при участии от 40 детей в одном корпусе. Если детей меньше, возможность выезда обсуждаем отдельно." },
  { question: "Выезжаете ли вы за пределы КАД?", answer: "Да. Базово выезжаем на расстояние до 40 км от КАД. Более дальние выезды обсуждаем индивидуально." },
  { question: "Как проходит отчётность для администрации?", answer: "После фотодня предоставляем администрации прозрачный отчёт по оформленным заказам и оплатам." },
  { question: "Чем ещё мы можем быть полезны детскому саду или школе?", answer: "Помимо фотодней, мы создаём выпускные альбомы, фотографируем сотрудников и помогаем с оформлением учреждения: изготавливаем баннеры, информационные стенды и оформление для музыкальных залов." },
  { question: "Куда обратиться, если возникли сложности с заказом?", answer: "Напишите нам в MAX по рабочему номеру +7 995 600-21-11. Поможем войти в галерею, оформить заказ или найти купленные электронные фотографии." },
] as const;

// eslint-disable-next-line react-refresh/only-export-components
export const albumFaqs = [
  { question: "Какие выпускные альбомы можно заказать?", answer: "Можно выбрать один из пяти вариантов: «Альбом-папка» — компактный и самый доступный формат; «Альбом-трио» — больше фотографий ребёнка, друзей и воспитателей; «Наша группа» — полноценный альбом на 6 страниц; «История детства» — 10 страниц с личными фотографиями и событиями группы; «Большая история» — 14 страниц и до 3 съёмочных дней, включая выпускной. Все варианты можно заказать как для детского сада, так и для школы. Посмотреть состав и стоимость каждого альбома можно в каталоге выше." },
  { question: "Можно ли выбрать дизайн?", answer: "Да. Группа или класс выбирает два разных полноценных макета: один для мальчиков и один для девочек. Фотографии и данные каждого ребёнка остаются индивидуальными." },
  { question: "Что входит в стоимость?", answer: "В стоимость входят фотосъёмка, обработка фотографий, подготовка и проверка макетов, печать альбомов, все удачные обработанные электронные фотографии и доставка СДЭК до выбранного пункта выдачи. Точная комплектация фиксируется в договоре." },
  { question: "Заключаете ли вы договор?", answer: "Да. В договоре фиксируем стоимость, комплектацию, даты съёмок, сроки изготовления и ответственность сторон." },
  { question: "Нужна ли предоплата?", answer: "Да. Для бронирования даты вносится предоплата 50%. Оставшиеся 50% оплачиваются после утверждения макетов перед передачей тиража в печать." },
  { question: "Есть ли минимальное количество альбомов?", answer: "Да. Минимальный тираж — 10 альбомов одного выбранного формата." },
  { question: "Сколько съёмочных дней входит в альбом?", answer: "В зависимости от выбранного формата проводим от одного до трёх съёмочных дней. Точное количество заранее указывается в предложении и договоре." },
  { question: "Что делать, если ребёнок пропустил съёмку?", answer: "Для отсутствующих детей бесплатно организуем дополнительную съёмку. Дату и место согласовываем с ответственным родителем, а срок проведения досъёмки фиксируем в договоре." },
  { question: "Фотографируете ли вы воспитателей и учителей?", answer: "Да. В альбом можно добавить портреты воспитателей или учителя и совместные фотографии с детьми." },
  { question: "Получит ли воспитатель или учитель бесплатный альбом?", answer: "Один альбом для воспитателя или учителя предоставляется бесплатно. На второй альбом для второго воспитателя действует скидка 50%." },
  { question: "Как родители выбирают портрет ребёнка?", answer: "После съёмки каждый родитель самостоятельно выбирает основной портрет ребёнка в закрытой галерее Seenday. Общие и игровые фотографии для оформления альбома отбирает наша команда." },
  { question: "Когда будет готов первый макет?", answer: "Первый макет готовим в течение 14 дней после завершения всех запланированных съёмок." },
  { question: "Как проходит проверка макетов?", answer: "Каждый родитель проверяет данные и фотографии своего ребёнка. Ответственный родитель собирает замечания всей группы или класса и передаёт их нам одним списком. На проверку предоставляется 7 дней. В стоимость входят до трёх согласованных этапов корректировок." },
  { question: "Сколько занимает печать?", answer: "После окончательного утверждения макетов печать тиража занимает до одного месяца." },
  { question: "Когда будут готовы альбомы?", answer: "Первый макет готовим до 14 дней после завершения съёмок, на проверку предоставляем 7 дней, а печать после утверждения занимает до одного месяца. Основные даты фиксируем в договоре." },
  { question: "Как доставляются готовые альбомы?", answer: "Готовый тираж бесплатно доставляем СДЭК до выбранного пункта выдачи." },
  { question: "Входят ли электронные фотографии в стоимость?", answer: "Да. Во всех пакетах все удачные обработанные электронные фотографии предоставляются в подарок." },
] as const;

const FAQ = () => {
  const [faqType, setFaqType] = useState<FaqType>("photo-day");
  const [visibleCount, setVisibleCount] = useState(8);
  const faqs = faqType === "photo-day" ? photoDayFaqs : albumFaqs;

  useEffect(() => setVisibleCount(8), [faqType]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...photoDayFaqs, ...albumFaqs].map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } as const;

  return (
    <section id="faq" className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">Часто задаваемые вопросы</h2>
          <p className="mt-5 text-xl text-muted-foreground">Выберите продукт — покажем ответы на самые важные вопросы.</p>
          <div className="mt-8 inline-flex rounded-xl border border-border bg-background p-1 shadow-soft">
            <button type="button" onClick={() => setFaqType("photo-day")} className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors sm:px-6 ${faqType === "photo-day" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>
              <Camera className="h-4 w-4" /> Фотодни
            </button>
            <button type="button" onClick={() => setFaqType("album")} className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors sm:px-6 ${faqType === "album" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>
              <GraduationCap className="h-4 w-4" /> Выпускные альбомы
            </button>
          </div>
        </header>

        <div className="mx-auto mt-12 max-w-4xl">
          <Accordion key={faqType} type="single" collapsible className="space-y-4">
            {faqs.slice(0, visibleCount).map((faq, index) => (
              <AccordionItem key={faq.question} value={`${faqType}-${index}`} className="rounded-xl bg-gradient-card px-6 shadow-soft transition-all duration-300 hover:shadow-glow">
                <AccordionTrigger className="py-6 text-left hover:no-underline"><span className="pr-4 text-lg font-semibold text-foreground">{faq.question}</span></AccordionTrigger>
                <AccordionContent className="pb-6"><p className="leading-relaxed text-muted-foreground">{faq.answer}</p></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            {visibleCount < faqs.length ? (
              <Button variant="outline" size="lg" onClick={() => setVisibleCount((current) => Math.min(current + 6, faqs.length))} className="border-primary/20 bg-gradient-card text-foreground shadow-soft transition-all hover:shadow-glow">Смотреть ещё</Button>
            ) : faqs.length > 8 ? (
              <Button variant="ghost" size="lg" onClick={() => setVisibleCount(8)} className="border border-border text-muted-foreground hover:bg-accent/40 hover:text-foreground">Свернуть</Button>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-xl bg-gradient-card p-8 text-center shadow-soft">
          <h3 className="text-2xl font-semibold text-foreground">Остались вопросы?</h3>
          <p className="mb-6 mt-4 text-muted-foreground">Напишите нам в MAX по рабочему номеру или оставьте заявку на консультацию.</p>
          <Button variant="default" size="lg" onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>Связаться с поддержкой</Button>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
};

export default FAQ;
