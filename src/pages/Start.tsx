import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, Camera, ExternalLink, Images, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contacts } from "@/config/contacts";
import { reachGoal } from "@/lib/analytics";
import { rememberEntryTracking, withSavedTracking } from "@/lib/tracking";

const directions = [
  {
    title: "Получить фотографии",
    text: "Перейти в закрытую галерею и выбрать готовые фотографии.",
    icon: Images,
    href: contacts.seendayUrl,
    external: true,
    goal: "start_get_photos_click",
  },
  {
    title: "Выпускные альбомы",
    text: "Альбомы для выпускников детского сада и школы.",
    icon: BookOpen,
    href: "/kindergarten",
    goal: "start_kindergarten_album_click",
    secondaryHref: "/school",
  },
  {
    title: "Организовать фотодень",
    text: "Современная фотосъёмка для детского сада или школы.",
    icon: Camera,
    href: "/#cta",
    goal: "start_photo_day_click",
  },
  {
    title: "Семейные съёмки",
    text: "Сохранить вашу семью и ребёнка такими, какие они сейчас.",
    icon: Camera,
    href: "/family",
    goal: "start_family_click",
  },
] as const;

const Start = () => {
  useEffect(() => rememberEntryTracking(), []);

  return (
    <div className="min-h-screen overflow-x-clip bg-gradient-to-b from-primary/5 via-background to-secondary/60">
      <Helmet>
        <title>Дети в кадре — фотосъёмка для детских садов, школ и семей</title>
        <meta name="description" content="Выберите нужное направление компании «Дети в кадре»: получить фотографии, заказать выпускной альбом, организовать фотодень или семейную съёмку." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://detivkadre.spb.ru/start" />
      </Helmet>

      <header className="border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
          <Link to="/" aria-label="Дети в кадре — главная">
            <img src="/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png" alt="Дети в кадре" className="h-9 sm:h-11" />
          </Link>
          <a href={contacts.phone.href} onClick={() => reachGoal("start_phone_click")} className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold hover:text-primary">
            <Phone className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">{contacts.phone.display}</span>
            <span className="sm:hidden">Позвонить</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 sm:py-14">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Дети в кадре · сохраняем детство</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Сохраняем важные моменты детства и семьи</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Фотосъёмка для детских садов, школ и семей в Санкт-Петербурге и Ленинградской области</p>
        </section>

        <section className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2" aria-label="Направления компании">
          {directions.map((item) => {
            const Icon = item.icon;
            const card = (
              <div className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-accent">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{item.text}</p>
                {"secondaryHref" in item ? (
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Link to={withSavedTracking(item.href)} onClick={() => reachGoal(item.goal)} className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark">Детский сад</Link>
                    <Link to={withSavedTracking(item.secondaryHref)} onClick={() => reachGoal("start_school_album_click")} className="rounded-lg border border-border px-3 py-2.5 text-center text-sm font-semibold hover:bg-accent">Школа</Link>
                  </div>
                ) : (
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">Перейти <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                )}
              </div>
            );
            if ("secondaryHref" in item) return <article key={item.title}>{card}</article>;
            if (item.external) return <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => reachGoal(item.goal)}>{card}</a>;
            return <Link key={item.title} to={withSavedTracking(item.href)} onClick={() => reachGoal(item.goal)}>{card}</Link>;
          })}
        </section>

        <section className="mx-auto mt-8 max-w-4xl rounded-2xl bg-slate-900 px-6 py-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <div className="flex items-center gap-2 text-primary-glow"><Building2 className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-[0.14em]">Для учреждений</span></div>
            <h2 className="mt-3 text-2xl font-bold">Представляете детский сад или школу?</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">Обсудим фотодень, выпускные альбомы или сотрудничество. Менеджер свяжется с вами в течение дня.</p>
          </div>
          <Button asChild className="mt-5 w-full shrink-0 sm:mt-0 sm:w-auto" size="lg">
            <Link to={withSavedTracking("/#cta")} onClick={() => reachGoal("start_institution_contact_click")}>Обсудить съёмку</Link>
          </Button>
        </section>

        <section className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-background p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-lg font-bold">Нужна помощь с выбором?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Напишите нам в MAX по рабочему номеру или позвоните.</p>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row">
            <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold"><MessageCircle className="h-4 w-4 text-primary" />MAX: {contacts.max.display}</span>
            <a href={contacts.phone.href} onClick={() => reachGoal("start_phone_click")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"><Phone className="h-4 w-4" />Позвонить</a>
          </div>
        </section>

        <footer className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Санкт-Петербург и Ленинградская область</span>
          <Link to={withSavedTracking("/")} className="inline-flex items-center gap-1 font-medium hover:text-primary">Перейти на основной сайт <ExternalLink className="h-3.5 w-3.5" /></Link>
        </footer>
      </main>
    </div>
  );
};

export default Start;
