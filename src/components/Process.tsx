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

export type ProcessType = "photo-day" | "album";

const photoDaySteps = [
  {
    title: "Запись на съёмку",
    description: "Запись занимает 1 минуту: родителям достаточно отметиться в опросе в своей группе или классе.",
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
    description: "Электронные файлы — сразу после оплаты. Печатные фото доставим за 10 дней после закрытия заказа.",
    timing: "файлы — сразу · печать — до 10 дней",
    icon: PackageCheck,
  },
] as const;

export const albumSteps = [
  {
    title: "Выбор альбома",
    description: "Выбираем формат и комплектацию. Для группы готовим два полноценных дизайна — отдельно для мальчиков и девочек.",
    icon: LayoutTemplate,
  },
  {
    title: "Подписание договора",
    description: "Фиксируем 4 главных условия: стоимость, комплектацию, сроки и ответственность сторон.",
    icon: FileSignature,
  },
  {
    title: "Подготовка",
    description: "Согласовываем график и заранее рассказываем, как подготовиться к съёмке.",
    icon: CalendarCheck,
  },
  {
    title: "Фотосъёмка",
    description: "Проводим от 1 до 3 съёмочных дней. Заболевших детей бесплатно доснимаем по договорённости.",
    timing: "1–3 съёмочных дня",
    icon: Camera,
  },
  {
    title: "Макет и проверка",
    description: "Каждый родитель выбирает портрет на сайте. Ответственный родитель собирает проверку макета; включено до 3 этапов правок.",
    timing: "макет — до 14 дней · проверка — 7 дней",
    icon: CheckCircle2,
  },
  {
    title: "Печать и выдача",
    description: "После утверждения макета вносится вторая часть оплаты. Печатаем тираж и доставляем его до пункта выдачи СДЭК.",
    timing: "печать — до 1 месяца · доставка СДЭК",
    icon: Printer,
  },
] as const;

const Process = ({ initialType = "photo-day", fixedType }: { initialType?: ProcessType; fixedType?: ProcessType }) => {
  const [processType, setProcessType] = useState<ProcessType>(fixedType ?? initialType);
  const steps = processType === "photo-day" ? photoDaySteps : albumSteps;

  return (
    <section id="process" className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Понятный процесс</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">Как всё проходит</h2>
          {!fixedType && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Выберите продукт — покажем путь от записи до готового результата.
          </p>}
          {!fixedType && <div className="mt-8 inline-flex rounded-xl border border-border bg-background p-1 shadow-soft">
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
          </div>}
        </header>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const timing = "timing" in step ? step.timing : undefined;

            return (
              <article key={step.title} className="relative flex flex-col rounded-2xl border border-border bg-background p-5 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-primary-dark">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                {timing && (
                  <div className="mt-auto pt-4">
                    <p className="inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-soft">
                      {timing}
                    </p>
                  </div>
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
