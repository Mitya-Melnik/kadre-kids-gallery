import { ArrowRight, BookOpen, Camera, Images } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToGallery = () => {
    document.querySelector("#gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-hero py-14 md:py-20 lg:py-24">
      <div className="absolute inset-0 bg-pattern opacity-40" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-soft">
              <Camera className="h-4 w-4 text-primary" />
              Детские сады и школы Санкт-Петербурга
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl">
              Сохраняем память о детстве
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Фотодни и выпускные альбомы, к которым хочется возвращаться. Детям комфортно,
              родителям удобно, учреждению — минимум организационной работы.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/kindergarten">
                <Button size="xl" className="w-full gap-2 shadow-glow sm:w-auto">
                  Выпускные альбомы
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="xl" variant="outline" className="gap-2 bg-white/80" onClick={scrollToGallery}>
                Выбрать фотосъёмку
                <Images className="h-5 w-5" />
              </Button>
            </div>

            <a
              href="https://seenday.com/ru/login"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary"
            >
              Я родитель — перейти к своим фотографиям
              <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              <div className="rounded-xl border border-border/80 bg-white/75 p-3 shadow-soft backdrop-blur-sm sm:p-4">
                <div className="text-xl font-bold text-primary-dark sm:text-2xl">15 лет</div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">снимаем детство бережно</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-white/75 p-3 shadow-soft backdrop-blur-sm sm:p-4">
                <div className="text-xl font-bold text-primary-dark sm:text-2xl">2100+</div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">проведённых фотосессий</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-white/75 p-3 shadow-soft backdrop-blur-sm sm:p-4">
                <div className="text-xl font-bold text-primary-dark sm:text-2xl">168 тыс.+</div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">фотографий куплено</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-white/75 p-3 shadow-soft backdrop-blur-sm sm:p-4">
                <div className="text-xl font-bold text-primary-dark sm:text-2xl">75+</div>
                <div className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">учреждений доверились нам</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-secondary-accent/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              <img
                src="/kindergarten/hero-square/slide-1.webp"
                alt="Выпускной альбом ребёнка"
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-glow"
                loading="eager"
              />
              <div className="grid gap-3 pt-8 sm:gap-4 sm:pt-12">
                <img
                  src="/galleries/paravoz/cover.webp"
                  alt="Детская фотосъёмка"
                  className="aspect-square w-full rounded-2xl object-cover shadow-soft"
                  loading="eager"
                />
                <div className="rounded-2xl bg-foreground p-5 text-white shadow-soft">
                  <BookOpen className="mb-3 h-7 w-7 text-primary-glow" />
                  <p className="font-semibold leading-snug">
                    Не просто фотографии — история детства вашей семьи
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
