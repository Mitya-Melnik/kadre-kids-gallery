import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type SchoolLayout = {
  slug: string;
  title: string;
  imageCount: number;
};

const schoolLayouts: SchoolLayout[] = [
  { slug: "antik", title: "Вне времени", imageCount: 11 },
  { slug: "belyy", title: "Воздух", imageCount: 7 },
  { slug: "light", title: "Свобода", imageCount: 11 },
  { slug: "modern", title: "Ритм", imageCount: 11 },
  { slug: "portrety", title: "Характер", imageCount: 11 },
  { slug: "chernyy", title: "Графит", imageCount: 7 },
];

const SchoolLayoutImage = ({
  layout,
  imageNumber,
  className,
  eager = false,
}: {
  layout: SchoolLayout;
  imageNumber: number;
  className: string;
  eager?: boolean;
}) => {
  const basePath = `/layouts-school/${layout.slug}/${imageNumber}`;

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={`${basePath}-mobile.webp`} />
      <img
        src={`${basePath}.webp`}
        alt={`${layout.title} — пример оформления школьного альбома, страница ${imageNumber}`}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
};

const SchoolLayouts = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);

  return (
    <section id="layouts" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <header
          ref={titleRef}
          className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-700 ${titleVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">6 вариантов оформления</p>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">Макеты школьных альбомов</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Выберите стиль, который подходит вашему классу. Нажмите на обложку, чтобы посмотреть альбом целиком.
          </p>
        </header>

        <div ref={gridRef} className="mx-auto grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {schoolLayouts.map((layout, index) => (
            <Dialog key={layout.slug}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={`group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${gridVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  style={{ transitionDelay: gridVisible ? `${index * 60}ms` : "0ms" }}
                  aria-label={`Посмотреть макет «${layout.title}»`}
                >
                  <div className="overflow-hidden bg-secondary/20">
                    <SchoolLayoutImage
                      layout={layout}
                      imageNumber={1}
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{layout.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Обложка и развороты</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">Открыть →</span>
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-h-[88vh] max-w-6xl overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Макет «{layout.title}»</DialogTitle>
                  <DialogDescription>
                    Обложка и примеры разворотов. Фотографии, имена и данные выпускников заменяются на материалы вашего класса.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Array.from({ length: layout.imageCount }, (_, imageIndex) => (
                    <SchoolLayoutImage
                      key={`${layout.slug}-${imageIndex + 1}`}
                      layout={layout}
                      imageNumber={imageIndex + 1}
                      className="h-auto w-full rounded-xl bg-secondary/20 object-contain shadow-soft"
                    />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolLayouts;
