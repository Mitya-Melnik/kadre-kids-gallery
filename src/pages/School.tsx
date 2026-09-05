import { Helmet } from "react-helmet";
import { Camera, Check, FileCheck2, Images, Users } from "lucide-react";
import TopBar from "@/components/TopBar";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { albumPackages } from "@/config/albumPackages";

const schoolPackages = albumPackages.map((album) => ({
  ...album,
  description: album.description.replace("выпускной группы", "выпускного класса").replace("событий группы", "событий класса"),
  suitableFor: album.suitableFor.replace("группы", "класса").replace("воспитателей", "учителя"),
  features: album.features.map((feature) => feature.replace(/одногруппниками/g, "одноклассниками").replace(/воспитателей/g, "учителя").replace(/воспитатели/g, "учитель").replace(/группы/g, "класса")),
}));

const advantages = [
  { icon: Camera, title: "Живые фотографии", text: "Снимаем не только портреты, но и дружбу, общение и настоящую атмосферу класса." },
  { icon: Images, title: "Более 10 дизайнов", text: "Класс выбирает оформление, которое подходит детям и не выглядит шаблонно." },
  { icon: Users, title: "Выбор портрета родителями", text: "Каждая семья самостоятельно выбирает основной портрет ребёнка на сайте." },
  { icon: FileCheck2, title: "Работа по договору", text: "Заранее фиксируем стоимость, комплектацию, сроки и порядок согласования." },
];

const faq = [
  ["Какие альбомы можно заказать?", "Доступно пять вариантов: альбом-папка, альбом-трио, «Наша группа» на 6 страниц, «История детства» на 10 страниц и «Большая история» на 14 страниц. Наполнение и цены показаны в каталоге."],
  ["Сколько должно быть учеников?", "Минимальный тираж — 10 альбомов. Точную стоимость рассчитываем по выбранному формату и количеству экземпляров."],
  ["Кто выбирает фотографии?", "Каждый родитель самостоятельно выбирает основной портрет ребёнка на сайте. Общие и репортажные фотографии для макета отбирает наша команда."],
  ["Можно ли доснять отсутствовавшего ребёнка?", "Да. Бесплатную досъёмку заболевших или отсутствовавших детей проводим по договорённости."],
  ["Как согласовывается макет?", "Каждая семья проверяет данные и фотографии своего ребёнка, а ответственный родитель передаёт общий список замечаний. В стоимость входит до трёх этапов правок."],
  ["Сколько занимает изготовление?", "Первый макет готовим до 14 дней после съёмки, на проверку отводится 7 дней, печать после утверждения занимает до одного месяца."],
  ["Входят ли электронные фотографии?", "Да. Все удачные обработанные фотографии со съёмок предоставляются в подарок в электронном виде во всех пакетах."],
  ["Как доставляются готовые альбомы?", "Доставка готового тиража до пункта выдачи СДЭК входит в стоимость."],
];

const PhotoPlaceholder = ({ title, text, className = "" }: { title: string; text: string; className?: string }) => (
  <div className={`flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center ${className}`}>
    <Images className="mb-4 h-10 w-10 text-primary/70" />
    <p className="font-bold text-foreground">{title}</p>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{text}</p>
  </div>
);

const School = () => (
  <div className="min-h-screen overflow-x-clip bg-background pb-16 md:pb-0">
    <Helmet>
      <title>Выпускные альбомы для школы в СПб | Дети в кадре</title>
      <meta name="description" content="Выпускные альбомы для школ Санкт-Петербурга: живая фотосъёмка класса, выбор портрета родителями, договор, макеты, печать и доставка СДЭК." />
      <link rel="canonical" href="https://detivkadre.spb.ru/school" />
      <meta property="og:title" content="Выпускные альбомы для школы — Дети в кадре" />
      <meta property="og:description" content="Сохраняем не только портреты, но и настоящую историю класса." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://detivkadre.spb.ru/school" />
    </Helmet>
    <TopBar />
    <main>
      <section id="hero" className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
        <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Выпускные альбомы для школы</p>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">История класса, которую захочется пересматривать</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Портреты, друзья, школьные будни и общие события — в современном выпускном альбоме с понятными условиями и сроками.</p>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
              {["Все удачные фотографии — в подарок", "Более 10 вариантов дизайна", "Работаем по договору", "Доставка СДЭК включена"].map((item) => <p key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</p>)}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><a href="#cta">Рассчитать стоимость</a></Button><Button asChild variant="outline" size="lg"><a href="#albums">Посмотреть альбомы</a></Button></div>
          </div>
          <PhotoPlaceholder title="Главная школьная фотография" text="Здесь появится сильный кадр со школьниками или готовым альбомом." className="min-h-[430px]" />
        </div>
      </section>

      <section id="albums" className="py-20">
        <div className="container mx-auto px-4">
          <header className="mx-auto mb-12 max-w-3xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Альбомы и цены</p><h2 className="text-3xl font-bold text-foreground md:text-5xl">Пять форматов для выпускного класса</h2><p className="mt-4 text-muted-foreground">Единая понятная линейка альбомов — от компактной папки до большой истории класса.</p></header>
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {schoolPackages.map((album) => <article key={album.id} className={`flex flex-col rounded-2xl border bg-card p-6 shadow-soft ${album.popular ? "border-primary ring-1 ring-primary" : "border-border"}`}>{album.popular && <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Популярный</span>}<h3 className="text-xl font-bold text-foreground">{album.title}</h3><p className="mt-2 text-sm text-muted-foreground">{album.description}</p><p className="mt-5 text-3xl font-bold text-primary">{album.price}</p><p className="text-xs text-muted-foreground">за 1 альбом при тираже от 10 экземпляров</p><ul className="my-6 space-y-2 text-sm">{album.features.slice(0, 5).map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{feature}</span></li>)}</ul><Button asChild variant={album.popular ? "default" : "outline"} className="mt-auto"><a href="#cta">Рассчитать для класса</a></Button></article>)}
          </div>
          <div id="layouts" className="scroll-mt-24"><PhotoPlaceholder title="Фотографии и видео школьных альбомов" text="После подготовки материалов здесь добавим обложки, развороты и видео перелистывания для каждого формата." className="mx-auto mt-8 max-w-6xl" /></div>
        </div>
      </section>

      <Process initialType="album" fixedType="album" />

      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Реальные съёмки</p><h2 className="text-3xl font-bold md:text-5xl">Школьные истории</h2><p className="mt-4 text-muted-foreground">Покажем портреты, друзей, уроки, перемены, прогулки и важные события класса.</p></header><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2"><PhotoPlaceholder title="Школьная фотогалерея" text="Место подготовлено под 10–15 лучших кадров из проведённых школьных съёмок." /><PhotoPlaceholder title="Реальный школьный кейс" text="Добавим задачу класса, организацию съёмки, готовый альбом и отзыв родителей." /></div></div>
      </section>

      <section id="advantages" className="bg-secondary/30 py-20"><div className="container mx-auto px-4"><h2 className="text-center text-3xl font-bold md:text-5xl">Почему классы выбирают нас</h2><div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">{advantages.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-background p-6 shadow-soft"><Icon className="h-8 w-8 text-primary" /><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></section>

      <section id="school-faq" className="py-20"><div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Вопросы и ответы</p><h2 className="text-3xl font-bold md:text-5xl">Что важно знать родителям</h2></header><div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">{faq.map(([question, answer]) => <article key={question} className="rounded-2xl border border-border bg-card p-6"><h3 className="font-bold text-foreground">{question}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p></article>)}</div></div></section>

      <CTA initialDirection="album" initialAudience="school" fixedDirection="album" fixedAudience="school" />
    </main>
    <Footer schoolPage />
    <FabContact />
    <BackToTop />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"><Button asChild className="w-full" size="lg"><a href="#cta">Рассчитать стоимость</a></Button></div>
  </div>
);

export default School;
