import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Building2, Check, UserCheck, UsersRound } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import TopBar from "@/components/TopBar";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import AlbumCatalog from "@/components/kindergarten/AlbumCatalog";
import KindergartenAdvantages from "@/components/kindergarten/KindergartenAdvantages";
import KindergartenFAQ from "@/components/kindergarten/KindergartenFAQ";
import SchoolLayouts from "@/components/school/SchoolLayouts";
import SchoolStories from "@/components/school/SchoolStories";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const schoolHeroImages = [
  { basePath: "/layouts-school/modern/1", alt: "Школьный альбом в дизайне «Ритм» — обложка" },
  { basePath: "/layouts-school/light/2", alt: "Школьный альбом в дизайне «Свобода» — обложка" },
  { basePath: "/layouts-school/modern/8", alt: "Школьный альбом в дизайне «Ритм» — разворот класса" },
  { basePath: "/layouts-school/modern/7", alt: "Школьный альбом в дизайне «Ритм» — разворот с выпускниками" },
] as const;

const SchoolHeroGallery = () => {
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
        aria-label="Примеры школьных выпускных альбомов"
      >
        <CarouselContent className="ml-0">
          {schoolHeroImages.map((image, index) => (
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
          {schoolHeroImages.map((image, index) => (
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

      <div className="hidden grid-cols-2 gap-4 rounded-3xl bg-background/70 p-4 shadow-glow lg:grid" aria-label="Примеры школьных выпускных альбомов">
        {schoolHeroImages.map((image, index) => (
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
    icon: UserCheck,
    title: "Выпускнику",
    text: "Современная съёмка без неловких поз. Свой портрет, имя и персональный разворот каждый выпускник подтверждает до печати.",
  },
  {
    icon: UsersRound,
    title: "Ответственному за класс",
    text: "Помогаем выбрать формат и пройти все этапы. Родители подтверждают персональные страницы, а замечания передаются нам одним общим списком.",
  },
  {
    icon: Building2,
    title: "Школе",
    text: "Заранее согласуем даты и график съёмок. Комплектацию, сроки и ответственность сторон фиксируем в договоре.",
  },
] as const;

const School = () => (
  <div className="min-h-screen overflow-x-clip bg-background pb-16 md:pb-0">
    <Helmet>
      <title>Выпускные альбомы для 9 и 11 классов в СПб | Дети в кадре</title>
      <meta name="description" content="Современные выпускные альбомы для 9 и 11 классов Санкт-Петербурга: личный выбор портрета, бесплатная досъёмка, проверка макетов, договор, печать и доставка СДЭК." />
      <link rel="canonical" href="https://detivkadre.spb.ru/school/9-11" />
      <meta property="og:title" content="Выпускные альбомы для 9 и 11 классов — Дети в кадре" />
      <meta property="og:description" content="Живые портреты, друзья и важные события школьной жизни — в современном выпускном альбоме с понятными условиями и сроками." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://detivkadre.spb.ru/school/9-11" />
    </Helmet>
    <TopBar />
    <main>
      <section id="hero" className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
        <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-primary">Выпускные альбомы для 9 и 11 классов</p>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">История класса, которую захочется пересматривать</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Живые портреты, друзья и важные события школьной жизни — в современном выпускном альбоме с понятными условиями и сроками.</p>
            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
              {["Личный выбор портрета и разворота", "Бесплатная досъёмка отсутствующих", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"].map((item) => <p key={item} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</p>)}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><a href="#cta">Рассчитать стоимость</a></Button><Button asChild variant="outline" size="lg"><a href="#albums">Посмотреть альбомы</a></Button></div>
          </div>
          <SchoolHeroGallery />
        </div>
      </section>

      <AlbumCatalog audience="school" />

      <section id="participants" className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <header className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">У каждого своя задача</p>
            <h2 className="text-3xl font-bold text-foreground md:text-5xl">Понятный процесс для класса и школы</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Выпускники участвуют в выборе, родители контролируют персональные страницы, а школа заранее знает график и условия работы.</p>
          </header>
          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
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

      <Process initialType="album" fixedType="album" audience="school" />

      <SchoolLayouts />

      <SchoolStories />

      <KindergartenAdvantages audience="school" />

      <KindergartenFAQ audience="school" />

      <CTA initialDirection="album" initialAudience="school" fixedDirection="album" fixedAudience="school" schoolLevel="grade9_11" />
    </main>
    <Footer schoolPage schoolLevel="grade9_11" />
    <FabContact />
    <BackToTop />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"><Button asChild className="w-full" size="lg"><a href="#cta">Рассчитать стоимость</a></Button></div>
  </div>
);

export default School;
