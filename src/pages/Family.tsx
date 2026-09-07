import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BookHeart, Camera, Check, Clock3, Download, Images, MapPin, MessageCircle, Shirt, Sparkles, Users } from "lucide-react";
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
    description: "Спокойная прогулка в любимом месте без сложного позирования.",
    features: ["До 50 обработанных фотографий", "Галерея на 1 месяц", "Файлы для печати и соцсетей", "Памятка по подготовке"],
  },
  {
    name: "Семейная история",
    price: "10 000 ₽",
    duration: "до 1,5 часа · в студии — 1 час",
    description: "Прогулка, домашняя история или съёмка в выбранной студии.",
    badge: "Выбирают чаще",
    features: ["До 50 обработанных фотографий", "Вся семья и отдельные портреты", "Галерея на 1 месяц", "Аренда студии оплачивается отдельно"],
  },
  {
    name: "История в фотокниге",
    price: "16 000 ₽",
    duration: "до 1,5 часа · в студии — 1 час",
    description: "Семейная съёмка и готовая история, которую можно держать в руках.",
    features: ["До 50 обработанных фотографий", "Фотокнига 20×20 см, 10 страниц", "Галерея на 1 месяц", "Аренда студии оплачивается отдельно"],
  },
] as const;

const process = [
  ["Знакомимся", "Узнаём состав семьи, возраст детей и ваши пожелания."],
  ["Выбираем формат", "Подбираем дату, место и подходящий сценарий съёмки."],
  ["Готовимся", "Отправляем короткую памятку и помогаем с вопросами."],
  ["Фотографируем", "Не требуем сложного позирования и оставляем детям время освоиться."],
  ["Обрабатываем", "Сохраняем естественные цвета, эмоции и узнаваемость семьи."],
  ["Передаём результат", "Через 10 дней фотографии появляются в закрытой галерее."],
] as const;

const faq = [
  ["Что делать, если ребёнок стесняется?", "Не торопим ребёнка и начинаем с общения. Опыт детской съёмки помогает мягко вовлечь его в процесс без давления."],
  ["Нужно ли уметь позировать?", "Нет. Мы подсказываем простые действия и больше внимания уделяем общению семьи, а не заученным позам."],
  ["Где может проходить съёмка?", "На прогулке, дома или в студии. Основной формат — прогулочная семейная история. Студию поможем подобрать и забронировать."],
  ["Можно ли пригласить бабушек и дедушек?", "Да. Стоимость не зависит от количества участников, но состав семьи нужно сообщить заранее, чтобы подобрать подходящее место и план съёмки."],
  ["Что будет при плохой погоде?", "Заранее обсудим запасной вариант: перенос, домашнюю съёмку или подходящую студию."],
  ["Когда будут готовы фотографии?", "Готовые обработанные фотографии передаём через 10 дней в закрытой онлайн-галерее. Галерея доступна 1 месяц."],
  ["Как забронировать дату?", "Оставьте заявку. Мы свяжемся в течение дня, уточним формат и свободные даты. Для бронирования вносится предоплата 2 000 ₽."],
] as const;

const PhotoPlaceholder = ({ index }: { index: number }) => (
  <div className={`flex min-h-60 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-primary/5 to-secondary p-6 text-center ${index === 0 ? "sm:col-span-2 sm:min-h-80" : ""}`}>
    <Images className="mb-3 h-9 w-9 text-primary/60" />
    <p className="font-bold">Семейная история №{index + 1}</p>
    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Добавим настоящие фотографии после подготовки и согласования серии.</p>
  </div>
);

const Family = () => {
  const [consent, setConsent] = useState(false);
  useEffect(() => rememberEntryTracking(), []);

  const previewSubmit = (event: FormEvent) => {
    event.preventDefault();
    reachGoal("family_form_preview_submit");
    toast.info("Форма подготовлена. Подключим отправку после создания отдельной воронки семейных съёмок в amoCRM.");
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Helmet>
        <title>Семейная фотосессия в Санкт-Петербурге | Дети в кадре</title>
        <meta name="description" content="Живая семейная фотосессия в Санкт-Петербурге: прогулка, домашняя история или студия. Поможем подготовиться и передадим фотографии через 10 дней." />
        <link rel="canonical" href="https://detivkadre.spb.ru/family" />
        <meta property="og:title" content="Семейная съёмка, к которой хочется возвращаться" />
        <meta property="og:description" content="Живые фотографии всей семьи — без натянутых улыбок и сложного позирования." />
        <meta property="og:url" content="https://detivkadre.spb.ru/family" />
        <meta property="og:type" content="website" />
      </Helmet>
      <TopBar />

      <main>
        <section id="hero" className="bg-gradient-to-br from-primary/10 via-background to-secondary/70 py-14 md:py-24">
          <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Семейные съёмки · Санкт-Петербург</p>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">Семейная съёмка, к которой хочется возвращаться</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Живые фотографии всей семьи — без натянутых улыбок и сложного позирования. Подберём формат и место под вашу семью.</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />Фотографии через 10 дней</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />СПб и Ленинградская область</span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg"><a href="#family-cta" onClick={() => reachGoal("family_consultation_click", { placement: "hero" })}>Подобрать формат съёмки</a></Button>
                <Button asChild variant="outline" size="lg"><a href="#family-gallery" onClick={() => reachGoal("family_gallery_click")}>Посмотреть примеры</a></Button>
              </div>
            </div>
            <PhotoPlaceholder index={0} />
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Вся семья в кадре</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Не только портреты, а ваша жизнь сейчас</h2></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Users, "Все вместе", "В семейном архиве наконец появляется фотография, на которой есть и дети, и родители."],
                [Sparkles, "Живые моменты", "Сохраняем взгляды, прикосновения и общение — то, что со временем становится особенно ценным."],
                [Camera, "Без сложных поз", "Подсказываем простые действия и помогаем семье чувствовать себя естественно."],
                [BookHeart, "Память в печати", "Фотографии можно сохранить не только в телефоне, но и в семейной фотокниге."],
              ].map(([Icon, title, text]) => <article key={String(title)} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><Icon className="h-6 w-6 text-primary" /><h3 className="mt-4 font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{String(text)}</p></article>)}
            </div>
          </div>
        </section>

        <section id="family-gallery" className="bg-secondary/60 py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Настоящие семейные истории</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Примеры съёмок</h2><p className="mt-4 text-muted-foreground">Места под пять разных серий подготовлены. Добавим реальные фотографии без стоков.</p></header><div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4].map((index) => <PhotoPlaceholder key={index} index={index} />)}</div></div>
        </section>

        <section id="family-packages" className="py-16 md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Понятные форматы</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Выберите свою семейную историю</h2><p className="mt-4 text-muted-foreground">Все удачные фотографии проходят авторскую цветокоррекцию и аккуратную обработку с сохранением естественности.</p></header><div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">{packages.map((item) => <article key={item.name} className={`relative flex flex-col rounded-2xl border bg-card p-6 shadow-soft ${"badge" in item ? "border-primary shadow-accent" : "border-border"}`}>{"badge" in item && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">{item.badge}</span>}<h3 className="text-2xl font-bold">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p><p className="mt-5 text-3xl font-bold text-primary">{item.price}</p><p className="mt-1 text-sm font-medium">{item.duration}</p><ul className="mt-5 flex-1 space-y-3">{item.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{feature}</li>)}</ul><Button asChild className="mt-6 w-full" variant={"badge" in item ? "default" : "outline"}><a href="#family-cta" onClick={() => reachGoal("family_package_select", { package: item.name })}>Выбрать формат</a></Button></article>)}</div><div className="mx-auto mt-6 max-w-3xl rounded-xl bg-primary/5 p-4 text-center text-sm text-muted-foreground">Выезд по Санкт-Петербургу входит в стоимость. Ленинградская область — дополнительно 2 000 ₽. Аренда студии оплачивается отдельно.</div></div>
        </section>

        <section className="bg-slate-900 py-16 text-white md:py-20">
          <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-glow">Без лишней сложности</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Как проходит съёмка</h2></header><div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">{process.map(([title, text], index) => <article key={title} className="rounded-2xl border border-slate-700 bg-white/5 p-5"><span className="text-sm font-bold text-primary-glow">0{index + 1}</span><h3 className="mt-3 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p></article>)}</div></div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2 lg:items-start"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Подготовимся вместе</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Вам не нужно знать, как вести себя перед камерой</h2><div className="mt-7 space-y-4">{[[Shirt, "Поможем сочетать одежду семьи без сложных требований."], [MessageCircle, "Заранее обсудим характер и возраст детей."], [MapPin, "Подберём место и запасной вариант на случай погоды."], [Download, "После бронирования отправим короткую памятку."]].map(([Icon, text]) => <p key={String(text)} className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{String(text)}</span></p>)}</div></div><PhotoPlaceholder index={2} /></div>
        </section>

        <section className="bg-secondary/60 py-16 md:py-20"><div className="container mx-auto max-w-4xl px-4"><header className="mb-8 text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Вопросы и ответы</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Перед семейной съёмкой</h2></header><Accordion type="single" collapsible className="rounded-2xl border border-border bg-background px-5">{faq.map(([question, answer], index) => <AccordionItem key={question} value={`family-${index}`}><AccordionTrigger className="text-left font-semibold">{question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>

        <section id="family-cta" className="py-16 md:py-20">
          <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:items-start"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Подберём формат и дату</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Давайте сохраним вашу семейную историю</h2><p className="mt-5 leading-relaxed text-muted-foreground">Оставьте контакты — мы свяжемся в течение дня. Для бронирования даты понадобится предоплата 2 000 ₽, остаток оплачивается в день съёмки.</p><p className="mt-5 text-sm text-muted-foreground">Форма пока работает в режиме локального прототипа. Подключим её после создания отдельной воронки «Семейные съёмки» в amoCRM.</p></div><form onSubmit={previewSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-accent"><div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="family-name">Имя *</Label><Input id="family-name" required className="mt-2" autoComplete="name" /></div><div><Label htmlFor="family-phone">Телефон *</Label><Input id="family-phone" required className="mt-2" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" /></div><div><Label htmlFor="family-children">Возраст детей</Label><Input id="family-children" className="mt-2" placeholder="Например: 3 и 8 лет" /></div><div><Label htmlFor="family-format">Желаемый формат</Label><Input id="family-format" className="mt-2" placeholder="Прогулка, дом или студия" /></div></div><div className="mt-5"><Label htmlFor="family-comment">Комментарий</Label><Textarea id="family-comment" className="mt-2" placeholder="Расскажите, какую съёмку вы представляете" /></div><label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground"><Checkbox checked={consent} onCheckedChange={(value) => setConsent(value === true)} className="mt-0.5" /><span>Я согласен на <Link to="/personal-data-consent" className="text-primary underline">обработку персональных данных</Link> и ознакомлен с <Link to="/privacy" className="text-primary underline">политикой</Link>.</span></label><Button type="submit" size="lg" className="mt-6 w-full" disabled={!consent}>Подобрать формат съёмки</Button></form></div>
        </section>
      </main>

      <Footer hideQuickLinks />
      <FabContact />
      <BackToTop />
    </div>
  );
};

export default Family;
