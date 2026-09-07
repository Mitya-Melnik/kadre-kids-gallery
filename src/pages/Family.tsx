import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BookHeart, Camera, Check, Clock3, Heart, Home, Images, MapPin, ShieldCheck, Shirt, Sparkles, Trees, Users } from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { reachGoal } from "@/lib/analytics";
import { rememberEntryTracking } from "@/lib/tracking";
import { toast } from "sonner";

const packages = [
  {
    name: "Семейная прогулка",
    price: "8 000 ₽",
    duration: "до 1,5 часа",
    description: "Живая съёмка на прогулке по понятному сценарию — легко начать и не нужно ничего придумывать.",
    features: ["Прогулочная съёмка в Санкт-Петербурге", "Помощь с выбором места и подготовкой", "Вся семья и отдельные сочетания", "До 50 отобранных и обработанных кадров", "Файлы для печати и социальных сетей", "Готовность через 10 дней"],
  },
  {
    name: "Семейная история",
    price: "10 000 ₽",
    duration: "до 1,5 часа · в студии — 1 час",
    description: "Персональная история дома, на прогулке или в студии с подготовкой под вашу семью.",
    badge: "Основной формат",
    features: ["Мини-анкета и персональный план съёмки", "Помощь с одеждой, местом и студией", "Живые моменты и общий семейный портрет", "До 50 отобранных и обработанных кадров", "Закрытая онлайн-галерея на 1 месяц", "Готовность через 10 дней"],
  },
  {
    name: "История в фотокниге",
    price: "16 000 ₽",
    duration: "до 1,5 часа · в студии — 1 час",
    description: "Полная семейная история в цифровом виде и фотокнига, которую можно передать детям.",
    features: ["Всё из пакета «Семейная история»", "До 50 отобранных и обработанных кадров", "Фотокнига 20×20 см, 10 страниц", "Макет книги из фотографий вашей съёмки", "Закрытая онлайн-галерея на 1 месяц", "Цифровые фотографии через 10 дней"],
  },
] as const;

const process = [
  ["Заявка", "Уточняем состав семьи, возраст детей, пожелания и свободные даты."],
  ["Подготовка", "Выбираем место, обсуждаем одежду и заранее продумываем сценарий."],
  ["Знакомство", "Не начинаем с команд: даём детям освоиться и привыкнуть к фотографу."],
  ["Съёмка", "Мягко направляем взрослых, а детям оставляем движение, игру и паузы."],
  ["Отбор и обработка", "Отбираем сильную цельную серию и сохраняем естественность семьи."],
  ["Готовая история", "Через 10 дней открываем закрытую галерею с фотографиями."],
] as const;

const faq = [
  ["Что делать, если ребёнок стесняется или не хочет фотографироваться?", "Это нормально. Первые минуты оставляем на знакомство и не просим ребёнка сразу смотреть в камеру. Начинаем с общения, движения или привычной игры, меняем сценарий по состоянию ребёнка и при необходимости делаем паузу."],
  ["Нужно ли нам уметь позировать?", "Нет. Фотограф подсказывает простые действия, поправляет положение и мягко направляет взрослых. В результате будут и живые кадры, и красивый общий портрет всей семьи."],
  ["Что делать, если муж или другой член семьи не любит фотосессии?", "Мы не превращаем съёмку в долгое позирование и множество одинаковых дублей. Большая часть времени проходит в общении и простых действиях, поэтому процесс больше похож на совместную прогулку или спокойное время семьи."],
  ["Что надеть на съёмку?", "После бронирования отправим короткую памятку. Для пакетов «Семейная история» и «История в фотокниге» можно прислать варианты одежды — подскажем, что лучше сочетается в кадре."],
  ["Где лучше фотографироваться?", "Подберём формат под возраст детей, сезон и желаемое настроение. Прогулка даёт движение и живые эмоции, дом сохраняет привычную жизнь семьи, студия не зависит от погоды и даёт более собранную картинку."],
  ["Подойдёт ли для съёмки обычная квартира?", "Да. Для домашней истории важны не идеальный интерьер и площадь, а свет, отношения и привычные семейные занятия. До бронирования можно прислать несколько фотографий комнат — мы честно скажем, подходит ли пространство."],
  ["Что будет при плохой погоде или болезни?", "Для прогулки заранее обсуждаем запасной вариант: перенос, дом или студию. Если ребёнок заболел, сообщите как можно раньше — подберём решение индивидуально. При отмене менее чем за 2 дня предоплата не возвращается."],
  ["Какие фотографии мы получим?", "Цельную серию до 50 кадров: всю семью вместе, родителей вдвоём, каждого родителя с детьми, детей вместе, индивидуальные портреты детей и живое общение. Набор адаптируем под состав вашей семьи."],
  ["Как обрабатываются фотографии?", "Все отобранные кадры проходят авторскую цветокоррекцию и аккуратную естественную ретушь. Мы сохраняем черты лица, фактуру кожи и узнаваемость детей и взрослых — глубокая ретушь в стоимость не входит."],
  ["Можно ли пригласить бабушек и дедушек?", "Да. Стоимость не меняется от количества членов семьи. Сообщите состав заранее, чтобы мы подобрали подходящее место и обязательно сняли важные сочетания поколений."],
  ["Будут ли фотографии опубликованы?", "Только с вашего отдельного согласия. Готовые фотографии передаются в закрытой онлайн-галерее и доступны по персональной ссылке."],
  ["Есть ли дополнительные расходы?", "Выезд по Санкт-Петербургу входит в стоимость. Для съёмки в Ленинградской области доплата составляет 2 000 ₽. Аренда студии и дополнительные печатные продукты оплачиваются отдельно — их стоимость согласуем до бронирования."],
  ["Когда и как мы получим фотографии?", "Через 10 дней после съёмки откроем закрытую онлайн-галерею. Из неё можно скачать фотографии на телефон или компьютер в формате для печати и социальных сетей. Галерея хранится 1 месяц."],
  ["Как оплачивается съёмка?", "Для бронирования даты вносится предоплата 2 000 ₽ на расчётный счёт. Остаток оплачивается в день съёмки."],
] as const;

const PhotoPlaceholder = ({ index, label }: { index: number; label?: string }) => (
  <div className={`flex min-h-60 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-primary/5 to-secondary p-6 text-center ${index === 0 ? "sm:col-span-2 sm:min-h-80" : ""}`}>
    <Images className="mb-3 h-9 w-9 text-primary/60" />
    <p className="font-bold">{label ?? `Семейная история №${index + 1}`}</p>
    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Здесь будет настоящая серия после подготовки и согласования фотографий.</p>
  </div>
);

const Family = () => {
  const [consent, setConsent] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  useEffect(() => rememberEntryTracking(), []);

  const choosePackage = (packageName: string) => {
    setSelectedPackage(packageName);
    reachGoal("family_package_select", { package: packageName });
  };

  const previewSubmit = (event: FormEvent) => {
    event.preventDefault();
    reachGoal("family_form_preview_submit", { package: selectedPackage || "not_selected" });
    toast.info("Форма подготовлена. Подключим отправку после создания отдельной воронки семейных съёмок в amoCRM.");
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        <title>Семейная фотосессия без стресса в Санкт-Петербурге | Дети в кадре</title>
        <meta name="description" content="Семейная история без сложного позирования: поможем с одеждой и местом, найдём подход к детям, снимем живые моменты и общий портрет. Фотографии через 10 дней." />
        <link rel="canonical" href="https://detivkadre.spb.ru/family" />
        <meta property="og:title" content="Не позируйте. Просто побудьте семьёй" />
        <meta property="og:description" content="Организованная семейная фотосессия без стресса и натянутых улыбок в Санкт-Петербурге." />
        <meta property="og:url" content="https://detivkadre.spb.ru/family" />
        <meta property="og:type" content="website" />
      </Helmet>
      <TopBar />
      <main>
        <section id="hero" className="bg-gradient-to-br from-primary/10 via-background to-secondary/70 py-14 md:py-24">
          <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Семейная история от «Дети в кадре»</p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">Не позируйте.<br />Просто побудьте семьёй</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Семейная фотосессия без стресса и натянутых улыбок. Поможем с одеждой и местом, найдём подход к детям и мягко направим взрослых. У вас останутся живые моменты и красивый общий портрет.</p>
              <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
                <span className="flex items-center gap-2"><Heart className="h-4 w-4 shrink-0 text-primary" />Детям можно быть собой</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 shrink-0 text-primary" />Вся семья будет в кадре</span>
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0 text-primary" />Фотографии через 10 дней</span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg"><a href="#family-cta" onClick={() => reachGoal("family_consultation_click", { placement: "hero" })}>Узнать свободные даты</a></Button>
                <Button asChild variant="outline" size="lg"><a href="#family-result" onClick={() => reachGoal("family_result_click")}>Посмотреть, что получится</a></Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Ответим в течение дня · бронирование даты — 2 000 ₽</p>
            </div>
            <PhotoPlaceholder index={0} label="Главная фотография живой семейной серии" />
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Съёмка без напряжения</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Вам не нужно готовить идеальную семью для камеры</h2><p className="mt-4 text-muted-foreground">Наша задача — организовать процесс так, чтобы взрослым было спокойно, а дети оставались детьми.</p></header>
            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
              <article className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8"><Users className="h-8 w-8 text-primary" /><h3 className="mt-5 text-2xl font-bold">Ребёнку не нужно сидеть смирно</h3><p className="mt-3 leading-relaxed text-muted-foreground">Начинаем со знакомства, не заставляем улыбаться по команде и меняем темп по состоянию ребёнка. Движение, игра и паузы — нормальная часть съёмки.</p></article>
              <article className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8"><Camera className="h-8 w-8 text-primary" /><h3 className="mt-5 text-2xl font-bold">Взрослым не нужно уметь позировать</h3><p className="mt-3 leading-relaxed text-muted-foreground">Фотограф мягко направит, подскажет простые действия и поможет хорошо выглядеть в кадре. Даже если кто-то из семьи не любит фотосессии.</p></article>
            </div>
          </div>
        </section>

        <section id="family-result" className="bg-secondary/60 py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Не только красивые портреты</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Фотографии, в которых ваша семья останется собой</h2><p className="mt-4 text-muted-foreground">В одной серии соединяем настоящее общение и несколько важных портретов, которые обычно некому снять.</p></header><div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[[Users, "Вся семья вместе", "Общий портрет, на котором есть и дети, и родители."], [Heart, "Родители вдвоём", "Кадр пары — не только роли мамы и папы."], [BookHeart, "Родители с детьми", "Каждый родитель отдельно с ребёнком или детьми."], [Sparkles, "Дети вместе", "Общие и индивидуальные портреты детей."], [Camera, "Живые моменты", "Взгляды, объятия, движение, смех и ваши привычные жесты."], [Images, "Цельная история", "До 50 отобранных кадров, которые хочется пересматривать вместе."]].map(([Icon, title, text]) => <article key={String(title)} className="rounded-2xl border border-border bg-background p-6 shadow-soft"><Icon className="h-6 w-6 text-primary" /><h3 className="mt-4 text-lg font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{String(text)}</p></article>)}
          </div></div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Подберём место под вашу семью</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Прогулка, дом или студия</h2><p className="mt-4 text-muted-foreground">Вам не нужно заранее знать правильный вариант — предложим решение с учётом возраста детей, сезона и желаемого результата.</p></header><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {[[Trees, "Прогулка", "Больше движения, воздуха и естественных эмоций. Основной и самый свободный формат."], [Home, "Домашняя история", "Привычные занятия и ритуалы в месте, где детям легче всего оставаться собой."], [Sparkles, "Студия", "Не зависит от погоды и подходит для более собранной визуальной истории. Поможем выбрать и забронировать."]].map(([Icon, title, text]) => <article key={String(title)} className="rounded-2xl border border-border bg-card p-6 shadow-soft"><Icon className="h-7 w-7 text-primary" /><h3 className="mt-4 text-xl font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{String(text)}</p></article>)}
          </div></div>
        </section>

        <section id="family-gallery" className="bg-secondary/60 py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Настоящие семейные истории</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Не один удачный кадр, а полная серия</h2><p className="mt-4 text-muted-foreground">Здесь покажем пять реальных историй целиком: живые моменты, общий портрет и важные сочетания семьи.</p></header><div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4].map((index) => <PhotoPlaceholder key={index} index={index} />)}</div></div>
        </section>

        <section id="family-packages" className="py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Условия понятны заранее</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Выберите формат семейной истории</h2><p className="mt-4 text-muted-foreground">Без обязательной покупки дополнительных файлов: итоговая серия уже входит в стоимость.</p></header><div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">{packages.map((item) => <article key={item.name} className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-soft ${"badge" in item ? "border-primary shadow-accent" : "border-border"}`}>{"badge" in item && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">{item.badge}</span>}<h3 className="text-2xl font-bold">{item.name}</h3><p className="mt-2 min-h-16 text-sm leading-relaxed text-muted-foreground">{item.description}</p><p className="mt-5 text-3xl font-bold text-primary">{item.price}</p><p className="mt-1 text-sm font-medium">{item.duration}</p><ul className="mt-5 flex-1 space-y-3">{item.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{feature}</li>)}</ul><Button asChild className="mt-6 w-full" variant={"badge" in item ? "default" : "outline"}><a href="#family-cta" onClick={() => choosePackage(item.name)}>Узнать свободные даты</a></Button></article>)}</div><div className="mx-auto mt-6 grid max-w-5xl gap-3 rounded-2xl border border-border bg-primary/5 p-5 text-sm sm:grid-cols-3"><p><strong className="block text-foreground">Санкт-Петербург</strong><span className="text-muted-foreground">Выезд входит в стоимость</span></p><p><strong className="block text-foreground">Ленинградская область</strong><span className="text-muted-foreground">Доплата 2 000 ₽</span></p><p><strong className="block text-foreground">Студия</strong><span className="text-muted-foreground">Аренда оплачивается отдельно</span></p></div></div>
        </section>

        <section id="family-advantages" className="bg-slate-900 py-16 text-white md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-glow">Организацию берём на себя</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Вам останется просто быть вместе</h2></header><div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[[Shirt, "Поможем с одеждой", "Отправим памятку, а в основных пакетах посмотрим ваши варианты и подскажем сочетания."], [MapPin, "Предложим место", "Подберём прогулочный маршрут, оценим домашнее пространство или поможем со студией."], [Users, "Подстроимся под детей", "Заложим время на знакомство, движение и паузы — без давления и сравнения."], [Camera, "Мягко направим взрослых", "Не оставим вас один на один с камерой и не потребуем заучивать позы."], [Images, "Отдадим готовую серию", "До 50 кадров с естественной обработкой в форматах для телефона и печати."], [Clock3, "Соблюдаем понятный срок", "Цифровые фотографии будут готовы через 10 дней после съёмки."]].map(([Icon, title, text]) => <article key={String(title)} className="rounded-2xl border border-slate-700 bg-white/5 p-6"><Icon className="h-6 w-6 text-primary-glow" /><h3 className="mt-4 text-lg font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{String(text)}</p></article>)}
          </div></div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">От заявки до готовых фотографий</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Как всё проходит</h2><p className="mt-4 text-muted-foreground">На каждом этапе вы знаете, что будет дальше и когда получите результат.</p></header><div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">{process.map(([title, text], index) => <article key={title} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><span className="text-sm font-bold text-primary">0{index + 1}</span><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div>
        </section>

        <section className="bg-secondary/60 py-16 md:py-20">
          <div className="container mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-2"><article className="rounded-2xl border border-border bg-background p-6 shadow-soft md:p-8"><ShieldCheck className="h-8 w-8 text-primary" /><h2 className="mt-5 text-2xl font-bold">Фотографии остаются у вашей семьи</h2><p className="mt-3 leading-relaxed text-muted-foreground">Передаём результат в закрытой галерее по персональной ссылке. Не публикуем фотографии детей и взрослых без отдельного согласия.</p></article><article className="rounded-2xl border border-border bg-background p-6 shadow-soft md:p-8"><BookHeart className="h-8 w-8 text-primary" /><h2 className="mt-5 text-2xl font-bold">История не останется только в телефоне</h2><p className="mt-3 leading-relaxed text-muted-foreground">Можно сразу выбрать пакет с фотокнигой 20×20 см или позднее заказать дополнительные печатные фотографии и подарочные продукты.</p></article></div>
        </section>

        <section className="py-16 md:py-20"><div className="container mx-auto max-w-4xl px-4"><header className="mb-8 text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Честно отвечаем до бронирования</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Вопросы о семейной съёмке</h2></header><Accordion type="single" collapsible className="rounded-2xl border border-border bg-background px-5">{faq.map(([question, answer], index) => <AccordionItem key={question} value={`family-${index}`}><AccordionTrigger className="text-left font-semibold">{question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>

        <section id="family-cta" className="bg-gradient-to-br from-primary/10 via-background to-secondary/70 py-16 md:py-20">
          <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:items-start"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Подберём формат и дату</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Расскажите немного о вашей семье</h2><p className="mt-5 leading-relaxed text-muted-foreground">Оставьте контакты — в течение дня уточним возраст детей, предложим подходящий формат и подскажем свободные даты. Решение о бронировании можно принять после консультации.</p><div className="mt-6 space-y-3 text-sm"><p className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Предоплата для бронирования — 2 000 ₽</p><p className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Остаток оплачивается в день съёмки</p><p className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Консультация ни к чему не обязывает</p></div></div><form onSubmit={previewSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-accent"><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="family-name">Имя *</Label><Input id="family-name" required className="mt-2" autoComplete="name" /></div><div><Label htmlFor="family-phone">Телефон *</Label><Input id="family-phone" required className="mt-2" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></div><div><Label htmlFor="family-children">Возраст детей</Label><Input id="family-children" className="mt-2" placeholder="Например: 3 и 8 лет" /></div><div><Label htmlFor="family-format">Формат съёмки</Label><Input id="family-format" className="mt-2" value={selectedPackage} onChange={(event) => setSelectedPackage(event.target.value)} placeholder="Можно выбрать после консультации" /></div></div><div className="mt-5"><Label htmlFor="family-comment">Что важно сохранить?</Label><Textarea id="family-comment" className="mt-2" placeholder="Например: общую фотографию, отношения детей или встречу с бабушкой и дедушкой" /></div><label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground"><Checkbox checked={consent} onCheckedChange={(value) => setConsent(value === true)} className="mt-0.5" /><span>Я согласен на <Link to="/personal-data-consent" className="text-primary underline">обработку персональных данных</Link> и ознакомлен с <Link to="/privacy" className="text-primary underline">политикой</Link>.</span></label><Button type="submit" size="lg" className="mt-6 w-full" disabled={!consent}>Узнать свободные даты</Button><p className="mt-3 text-center text-xs text-muted-foreground">Менеджер свяжется с вами в течение дня.</p></form></div>
        </section>
      </main>
      <Footer hideQuickLinks />
      <FabContact />
      <BackToTop />
    </div>
  );
};

export default Family;
