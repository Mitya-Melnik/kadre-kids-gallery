import { ArrowRight, CalendarDays, Camera, CheckCircle2, Images, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reachGoal } from "@/lib/analytics";

const caseRoot = "/cases/kindergarten-108";

const facts = [
  { value: "19 из 19", label: "семей заказали альбом", icon: Users },
  { value: "3 дня", label: "съёмок в течение года", icon: Camera },
  { value: "14–20", label: "страниц в готовых альбомах", icon: Images },
  { value: "2025", label: "год выпуска группы", icon: CalendarDays },
];

const albumImages = [
  { src: `${caseRoot}/group-spread.jpg`, alt: "Групповой разворот выпускного альбома с воспитателями" },
  { src: `${caseRoot}/individual-spread.jpg`, alt: "Индивидуальный разворот выпускного альбома" },
  { src: `${caseRoot}/graduation-spread.jpg`, alt: "Разворот выпускного альбома с праздника" },
  { src: `${caseRoot}/winter-spread.jpg`, alt: "Зимняя прогулка в выпускном альбоме" },
  { src: `${caseRoot}/autumn-spread.jpg`, alt: "Осенняя прогулка в выпускном альбоме" },
];

const storyImages = [
  { src: `${caseRoot}/autumn-play.jpg`, alt: "Дети играют на осенней прогулке", label: "Осенняя прогулка" },
  { src: `${caseRoot}/winter-friends.jpg`, alt: "Дети вместе на зимней прогулке", label: "Зимняя съёмка" },
  { src: `${caseRoot}/holiday.jpg`, alt: "Детский праздник в течение учебного года", label: "Праздники группы" },
  { src: `${caseRoot}/graduation.jpg`, alt: "Выпускница детского сада с дипломом", label: "Выпускной" },
];

const scrollToForm = () => {
  document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" });
  reachGoal("consultation_click", { page: "kindergarten", placement: "case_108" });
};

const KindergartenCase = () => (
  <section id="case-kindergarten-108" className="bg-background py-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Реальный проект</p>
            <h2 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Один учебный год — в одном выпускном альбоме
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Детский сад №108, группа «Звёздочки». Родители задумались об альбоме в начале года, поэтому мы смогли сохранить не только портреты, но и настоящую жизнь группы: прогулки, игры, праздники и выпускной.
            </p>
            <div className="mt-6 space-y-3 text-foreground">
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />Каждый родитель самостоятельно выбрал портрет ребёнка на сайте.</p>
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />Все 19 семей заказали альбомы «Большая история».</p>
              <p className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />Часть семей добавила развороты и получила альбомы на 20 страниц.</p>
            </div>
          </div>

          <figure className="overflow-hidden rounded-2xl bg-secondary shadow-soft">
            <img
              src={`${caseRoot}/cover.jpg`}
              alt="Обложка выпускного альбома группы Звёздочки"
              className="aspect-[1.45/1] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="px-5 py-4 text-sm text-muted-foreground">Обложка альбома группы «Звёздочки», выпуск 2025 года</figcaption>
          </figure>
        </div>

        <div className="mb-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {facts.map(({ value, label, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <p className="text-2xl font-bold text-foreground md:text-3xl">{value}</p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-14">
          <div className="mb-7 max-w-3xl">
            <h3 className="text-3xl font-bold text-foreground">История группы внутри альбома</h3>
            <p className="mt-3 text-lg text-muted-foreground">Портреты, воспитатели, друзья и события года собраны в одной цельной истории — не в наборе одинаковых постановочных кадров.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {albumImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={`w-full rounded-xl border border-border bg-secondary object-contain shadow-sm ${index === 0 ? "md:col-span-2" : ""}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <div className="mb-14">
          <h3 className="text-3xl font-bold text-foreground">Съёмки в течение года</h3>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">Так альбом сохраняет характер группы и показывает, какими дети были в обычной жизни, с друзьями и на важных событиях.</p>
          <div className="mt-7 grid grid-cols-2 gap-3 md:gap-5">
            {storyImages.map((image) => (
              <figure key={image.src} className="group overflow-hidden rounded-2xl bg-card shadow-sm">
                <img src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
                <figcaption className="px-4 py-3 text-sm font-medium text-foreground md:text-base">{image.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="grid gap-6 rounded-2xl border border-primary/20 bg-primary/5 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Нашли решение</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">Даже когда ребёнок не захотел сниматься на групповую фотографию</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Для одного ребёнка родители передали групповую фотографию прошлого года. Мы отсканировали её в хорошем разрешении и аккуратно добавили в персональный экземпляр — ребёнок остался частью общей истории.
            </p>
          </div>
          <Button size="lg" onClick={scrollToForm} className="w-full md:w-auto">
            Узнать свободные даты <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default KindergartenCase;
