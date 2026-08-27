import { ArrowRight, BookOpen, Camera, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const directions = [
  {
    eyebrow: "Главный выпускной продукт",
    title: "Выпускные альбомы",
    description: "Продуманная история группы: съёмка, дизайн, согласование и печать в одном процессе.",
    image: "/kindergarten/hero-square/slide-2.webp",
    imageAlt: "Пример выпускного альбома",
    features: ["Для детских садов и школ", "Несколько вариантов оформления", "Понятные сроки и согласование"],
    action: "Посмотреть альбомы",
    href: "/kindergarten",
    icon: BookOpen,
  },
  {
    eyebrow: "Можно планировать на весь год",
    title: "Тематические фотодни",
    description: "Готовые идеи съёмок для разных возрастов. Родители покупают только понравившиеся фотографии.",
    image: "/galleries/tykvennoe/cover.webp",
    imageAlt: "Пример тематического фотодня",
    features: ["Без обязательной покупки", "Все доступные съёмки сразу", "Для детских садов и школ"],
    action: "Выбрать съёмку",
    href: "#gallery",
    icon: Camera,
  },
] as const;

const ProductDirections = () => {
  const handleAnchor = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="products" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Наши основные продукты</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Один партнёр для важных моментов детства
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Можно провести одну съёмку или заранее составить план фотодней и выпускного альбома на учебный год.
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {directions.map((direction) => {
            const Icon = direction.icon;
            const button = (
              <Button size="lg" className="mt-auto w-full gap-2 sm:w-fit">
                {direction.action}
                <ArrowRight className="h-4 w-4" />
              </Button>
            );

            return (
              <article key={direction.title} className="flex overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="flex w-full flex-col">
                  <img src={direction.image} alt={direction.imageAlt} className="h-64 w-full object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold text-primary-dark">{direction.eyebrow}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">{direction.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{direction.description}</p>
                    <ul className="my-6 space-y-3">
                      {direction.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {direction.href.startsWith("#") ? (
                      <div className="mt-auto w-fit" onClick={() => handleAnchor(direction.href)}>{button}</div>
                    ) : (
                      <Link to={direction.href} className="mt-auto w-fit">{button}</Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductDirections;
