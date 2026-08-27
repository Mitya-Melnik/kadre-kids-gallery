import { Building2, Check, Heart, ShieldCheck } from "lucide-react";

const audiences = [
  {
    label: "Ребёнку",
    title: "Комфортно быть собой",
    description: "Съёмка проходит в знакомой обстановке, без давления и сложного позирования.",
    icon: Heart,
    accent: "bg-primary/10 text-primary",
    points: [
      "Игра и общение вместо команд",
      "Бережный подход к характеру ребёнка",
      "Живые эмоции и естественные кадры",
    ],
  },
  {
    label: "Родителю",
    title: "Понятно и безопасно",
    description: "Все условия известны заранее, а фотографии доступны только своей семье.",
    icon: ShieldCheck,
    accent: "bg-secondary-accent/15 text-secondary-accent",
    points: [
      "Закрытый доступ к фотографиям",
      "Удобный просмотр и онлайн-оплата",
      "На фотоднях — покупка только понравившихся кадров",
    ],
  },
  {
    label: "Учреждению",
    title: "Минимум организационной работы",
    description: "Берём процесс на себя — от подготовки родителей до передачи готового результата.",
    icon: Building2,
    accent: "bg-foreground/10 text-foreground",
    points: [
      "Готовые сообщения и материалы для групп",
      "Не нужно собирать оплату за фотодни",
      "Понятный график, документы и ответственная команда",
    ],
  },
] as const;

const Advantages = () => {
  return (
    <section id="advantages" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Почему выбирают нас</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Удобно всем участникам
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Хорошая детская съёмка — это не только красивые фотографии. Важно, как чувствует себя ребёнок,
            насколько спокойно родителю и сколько работы остаётся учреждению.
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <article key={audience.label} className="flex h-full flex-col rounded-2xl border border-border bg-gradient-card p-6 shadow-soft md:p-8">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${audience.accent}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary-dark">{audience.label}</p>
                <h3 className="mt-2 text-2xl font-bold text-foreground">{audience.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{audience.description}</p>
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {audience.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
