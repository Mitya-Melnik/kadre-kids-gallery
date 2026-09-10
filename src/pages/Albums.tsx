import { Helmet } from "react-helmet";
import { ArrowRight, Baby, BookOpen, Check, GraduationCap, School } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { reachGoal } from "@/lib/analytics";

const directions = [
  {
    segment: "kindergarten",
    eyebrow: "Выпускной из детского сада",
    title: "Детский сад",
    description: "Последний год в группе, друзья, воспитатели и выпускной — в одной истории детства.",
    details: ["Портрет ребёнка выбираете вы", "Бесплатно доснимем отсутствовавших"],
    href: "/kindergarten",
    action: "Посмотреть альбомы",
    icon: Baby,
    accent: "from-primary/20 via-primary/5 to-background",
  },
  {
    segment: "grade4",
    eyebrow: "Выпускной из начальной школы",
    title: "4 класс",
    description: "Память о первой учительнице, друзьях и важных годах начальной школы.",
    details: ["Живые фотографии без шаблонных постановок", "Портрет ребёнка выбираете вы"],
    href: null,
    action: "Раздел готовится",
    icon: School,
    accent: "from-secondary-accent/20 via-secondary-accent/5 to-background",
  },
  {
    segment: "grade9_11",
    eyebrow: "Выпускной из школы",
    title: "9–11 классы",
    description: "Современный альбом о классе, дружбе и школьных годах — без шаблонных постановочных кадров.",
    details: ["Современный стиль без детских шаблонов", "Выпускник подтверждает портрет и разворот"],
    href: "/school/9-11",
    action: "Посмотреть альбомы",
    icon: GraduationCap,
    accent: "from-slate-200 via-slate-50 to-background",
  },
] as const;

const Albums = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Выпускные альбомы для детского сада и школы | Дети в кадре</title>
      <meta
        name="description"
        content="Выпускные альбомы для детского сада, 4, 9 и 11 классов в Санкт-Петербурге. Выберите направление и посмотрите варианты, цены и условия."
      />
      <link rel="canonical" href="https://detivkadre.spb.ru/albums" />
      <meta property="og:title" content="Выпускные альбомы — Дети в кадре" />
      <meta property="og:description" content="Выберите выпускной альбом для детского сада, 4, 9 или 11 класса." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://detivkadre.spb.ru/albums" />
    </Helmet>

    <TopBar />

    <main>
      <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
        <div className="absolute inset-0 bg-pattern opacity-30" aria-hidden="true" />
        <div className="container relative mx-auto px-4">
          <header className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-semibold text-primary-dark shadow-soft">
              <BookOpen className="h-4 w-4" />
              Сохраняем важный этап детства
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              Выпускные альбомы для разных этапов детства
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Выберите, для кого готовим альбом. На следующей странице покажем примеры, комплектацию, цены и весь путь до готового тиража.
            </p>
          </header>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
            {directions.map((direction) => {
              const Icon = direction.icon;

              return (
                <article
                  key={direction.segment}
                  className={`group flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${direction.accent} p-6 shadow-soft transition duration-300 md:p-8 ${direction.href ? "hover:-translate-y-1 hover:shadow-accent" : "opacity-90"}`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-primary shadow-soft">
                    <Icon className="h-7 w-7" />
                  </span>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">{direction.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground">{direction.title}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{direction.description}</p>
                  <ul className="mt-6 space-y-3">
                    {direction.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm font-medium text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    {direction.href ? (
                      <Button asChild size="lg" className="w-full gap-2">
                        <Link
                          to={direction.href}
                          onClick={() => reachGoal("album_segment_select", { segment: direction.segment })}
                        >
                          {direction.action}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <div className="rounded-xl border border-dashed border-border bg-background/75 px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
                        {direction.action}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-background/90 p-6 text-center shadow-soft sm:flex-row sm:text-left">
            <div>
              <h2 className="text-xl font-bold text-foreground">Не уверены, какой формат подойдёт?</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Расскажите, для кого нужен альбом — поможем сориентироваться и подскажем свободные даты.</p>
            </div>
            <Button asChild variant="outline" size="lg" className="shrink-0">
              <Link to="/?direction=album#cta" onClick={() => reachGoal("consultation_click", { page: "albums", placement: "selector" })}>
                Получить консультацию
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>

    <Footer hideQuickLinks />
    <FabContact />
    <BackToTop />
  </div>
);

export default Albums;
