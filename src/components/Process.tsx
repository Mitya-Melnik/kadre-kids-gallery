import { useState } from "react";
import {
  CalendarCheck,
  Camera,
  CheckCircle2,
  FileSignature,
  Images,
  LayoutTemplate,
  PackageCheck,
  Printer,
  Sparkles,
} from "lucide-react";

type ProcessType = "photo-day" | "album";

const photoDaySteps = [
  {
    title: "Запись на съёмку",
    description: "Запись занимает 1 минуту: родителям достаточно отметиться в опросе в чате своей группы или класса.",
    timing: "1 минута",
    icon: CalendarCheck,
  },
  {
    title: "Фотосъёмка",
    description: "Съёмка начинается в 9:00. Фотографируем детей в знакомой обстановке — через игру и общение.",
    timing: "начало в 9:00",
    icon: Camera,
  },
  {
    title: "Обработка",
    description: "В течение 7 дней обрабатываем фотографии и размещаем их в закрытой галерее.",
    timing: "до 7 дней",
    icon: Sparkles,
  },
  {
    title: "Выбор и оплата",
    description: "Родители выбирают только понравившиеся кадры. На выбор и заказ печатных фотографий — 7 дней.",
    timing: "7 дней на выбор и заказ",
    icon: Images,
  },
  {
    title: "Получение фотографий",
    description: "Электронные файлы доступны сразу после оплаты. Печатные фотографии доставляем в учреждение в течение 10 дней после закрытия заказа.",
    timing: "файлы — сразу · печать — до 10 дней",
    icon: PackageCheck,
  },
] as const;

const albumSteps = [
  {
    title: "Выбор альбома",
    description: "Выбираем формат, дизайн и комплектацию для группы или класса.",
    icon: LayoutTemplate,
  },
  {
    title: "Подписание договора",
    description: "Фиксируем стоимость, состав заказа, сроки и ответственность сторон.",
    icon: FileSignature,
  },
  {
    title: "Подготовка",
    description: "Согласовываем график и заранее рассказываем, как подготовиться к съёмке.",
    icon: CalendarCheck,
  },
  {
    title: "Фотосъёмка",
    description: "Проводим запланированные съёмки детей и группы.",
    icon: Camera,
  },
  {
    title: "Макет и проверка",
    description: "Готовим альбомы, родители проверяют данные и утверждают макеты.",
    icon: CheckCircle2,
  },
  {
    title: "Печать и выдача",
    description: "После утверждения печатаем тираж и передаём готовые альбомы.",
    icon: Printer,
  },
] as const;

const Process = () => {
  const [processType, setProcessType] = useState<ProcessType>("photo-day");
  const steps = processType === "photo-day" ? photoDaySteps : albumSteps;

  return (
    <section id="process" className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Понятный процесс</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Как всё проходит</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Выберите продукт — покажем путь от записи до готового результата.
          </p>
          <div className="mt-8 inline-flex rounded-xl border border-border bg-background p-1 shadow-soft">
            <button
              type="button"
              onClick={() => setProcessType("photo-day")}
              className={`rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
                processType === "photo-day" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
              }`}
            >
              Фотодень
            </button>
            <button
              type="button"
              onClick={() => setProcessType("album")}
              className={`rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
                processType === "album" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
              }`}
            >
              Выпускной альбом
            </button>
          </div>
        </header>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const timing = "timing" in step ? step.timing : undefined;

            return (
              <article key={step.title} className="relative rounded-2xl border border-border bg-background p-5 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-primary-dark">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                {timing && (
                  <p className="mt-4 inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-soft">
                    {timing}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
