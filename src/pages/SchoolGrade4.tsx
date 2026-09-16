import { type MouseEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Building2, Check, Smile, UserCheck, UsersRound } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import TopBar from "@/components/TopBar";
import AlbumPromoStrip from "@/components/AlbumPromoStrip";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import AlbumCatalog from "@/components/kindergarten/AlbumCatalog";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";
import Grade4Layouts from "@/components/school/Grade4Layouts";
import SchoolStories from "@/components/school/SchoolStories";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const grade4HeroImages = [
  { basePath: "/layouts-grade4/doodles/1", alt: "Альбом для 4 класса в дизайне «Каракули» — обложка" },
  { basePath: "/layouts-grade4/colored-pencils/2", alt: "Альбом для 4 класса в дизайне «Цветные карандаши» — разворот" },
  { basePath: "/layouts-grade4/calligraphy/4", alt: "Альбом для 4 класса в дизайне «Каллиграфия» — разворот" },
  { basePath: "/layouts-grade4/doodles/7", alt: "Альбом для 4 класса в дизайне «Каракули» — разворот" },
] as const;

const Grade4HeroGallery = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    updateCurrent();
    api.on("select", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
        className="w-full lg:hidden"
        aria-label="Примеры выпускных альбомов для 4 класса"
      >
        <CarouselContent className="ml-0">
          {grade4HeroImages.map((image, index) => (
            <CarouselItem key={image.basePath} className="pl-0">
              <div className="aspect-square overflow-hidden rounded-2xl bg-secondary/20 shadow-glow">
                <ResponsiveImage
                  basePath={image.basePath}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  type="cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm">
          {grade4HeroImages.map((image, index) => (
            <button
              key={image.basePath}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${current === index ? "w-7 bg-white" : "w-2.5 bg-white/60"}`}
              aria-label={`Показать фотографию ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
            />
          ))}
        </div>
      </Carousel>

      <div className="hidden grid-cols-2 gap-4 rounded-3xl bg-background/70 p-4 shadow-glow lg:grid" aria-label="Примеры выпускных альбомов для 4 класса">
        {grade4HeroImages.map((image, index) => (
          <div key={image.basePath} className="overflow-hidden rounded-2xl bg-secondary/20 shadow-soft">
            <ResponsiveImage
              basePath={image.basePath}
              alt={image.alt}
              className="aspect-square w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              type="cover"
            />
          </div>
        ))}
      </div>
    </>
  );
};

const participantBenefits = [
  {
    icon: Smile,
    title: "Ребёнку",
    text: "Живая съёмка без одинаковых поз: портреты, друзья, уроки, перемены и знакомая школьная жизнь.",
  },
  {
    icon: UserCheck,
    title: "Родителям",
    text: "Вы сами выбираете портрет и до печати лично подтверждаете имя и персональный разворот ребёнка.",
  },
  {
    icon: UsersRound,
    title: "Ответственному за класс",
    text: "Помогаем выбрать формат, объясняем каждый этап и принимаем замечания к макету одним общим списком.",
  },
  {
    icon: Building2,
    title: "Школе",
    text: "Заранее согласуем даты и график, а комплектацию, сроки и ответственность сторон фиксируем в договоре.",
  },
] as const;

const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
  event.preventDefault();
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${target}`);
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
};

const SchoolGrade4 = () => (
  <div className="min-h-screen overflow-x-clip bg-background pb-16 md:pb-0">
    <Helmet>
      <title>Выпускные альбомы для 4 класса в СПб | Дети в кадре</title>
      <meta name="description" content="Выпускные альбомы для 4 класса в Санкт-Петербурге: первая учительница, друзья и события начальной школы, выбор портрета родителями, бесплатная досъёмка, договор и доставка СДЭК." />
      <link rel="canonical" href="https://detivkadre.spb.ru/school/4" />
      <meta property="og:title" content="Выпускные альбомы для 4 класса — Дети в кадре" />
      <meta property="og:description" content="Четыре первых школьных года — в одной живой истории с понятными условиями и контролем родителей до печати." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://detivkadre.spb.ru/school/4" />
    </Helmet>
    <TopBar />
    <main>
      <section id="hero" className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
        <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Выпускные альбомы для 4 класса</p>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">Четыре первых школьных года — в одной живой истории</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Сохраним первую учительницу, друзей, уроки, перемены и события класса. Родители выбирают портрет ребёнка и подтверждают персональный разворот до печати.</p>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
              {["Портрет ребёнка выбираете вы", "Бесплатно доснимем отсутствовавших", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"].map((item) => <p key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</p>)}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><a href="/school/4#cta" onClick={(event) => scrollToSection(event, "#cta")}>Рассчитать стоимость</a></Button><Button asChild variant="outline" size="lg"><a href="/school/4#albums" onClick={(event) => scrollToSection(event, "#albums")}>Посмотреть альбомы</a></Button></div>
          </div>
          <Grade4HeroGallery />
        </div>
      </section>

      <AlbumPromoStrip />

      <AlbumCatalog audience="grade4" />

      <section id="participants" className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <header className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">У каждого своя задача</p>
            <h2 className="text-3xl font-bold text-foreground md:text-5xl">Понятный процесс для родителей, класса и школы</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Дети снимаются в знакомой школьной обстановке, родители контролируют персональный результат, а ответственный за класс ведёт согласование по понятным этапам.</p>
          </header>
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {participantBenefits.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Process initialType="album" fixedType="album" audience="grade4" />

      <Grade4Layouts />

      <SchoolStories audience="grade4" />

      <KindergartenAdvantages audience="grade4" />

      <KindergartenFAQ audience="grade4" />

      <CTA initialDirection="album" initialAudience="school" fixedDirection="album" fixedAudience="school" schoolLevel="grade4" />
    </main>
    <Footer schoolPage schoolLevel="grade4" />
    <FabContact aboveMobileBar />
    <BackToTop />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"><Button asChild className="w-full" size="lg"><a href="/school/4#cta" onClick={(event) => scrollToSection(event, "#cta")}>Рассчитать стоимость</a></Button></div>
  </div>
);

export default SchoolGrade4;
