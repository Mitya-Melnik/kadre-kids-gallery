import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images, Play, Plus } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import VideoModal from "./VideoModal";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { albumPackages } from "@/config/albumPackages";

const schoolText = (text: string) => text
  .replace(/Наша группа/g, "Наш класс")
  .replace(/одногруппниками/g, "одноклассниками")
  .replace(/воспитателей/g, "учителя")
  .replace(/воспитатели/g, "учитель")
  .replace(/группы/g, "класса")
  .replace(/группа/g, "класс")
  .replace(/детском саде/g, "школе")
  .replace(/Более 10 дизайнов/g, "6 дизайнов")
  .replace(/История детства/g, "Школьные годы");

const AlbumCatalog = ({ audience = "kindergarten" }: { audience?: "kindergarten" | "school" }) => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: catalogRef, isVisible: catalogVisible } = useScrollAnimation(0.1);
  
  const [selectedId, setSelectedId] = useState("ten-pages");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  const isSchool = audience === "school";
  const packages = albumPackages.map((album) => isSchool ? {
    ...album,
    title: schoolText(album.title),
    shortTitle: schoolText(album.shortTitle),
    description: schoolText(album.description),
    suitableFor: schoolText(album.suitableFor),
    features: ["Формат альбома — 21×30 см", ...album.features.map(schoolText)],
    items: album.items.map((item) => ({ ...item, note: schoolText(item.note) })),
  } : album);
  const currentAlbum = packages.find((album) => album.id === selectedId) ?? packages[3];
  const seniorPackageComparison = [
    { format: "6 страниц", diploma: false, certificate: false, futureLetter: false, copy: "Полная стоимость" },
    { format: `${isSchool ? "Школьные годы" : "История детства"} — 10 страниц`, diploma: true, certificate: false, futureLetter: false, copy: "Скидка 25%" },
    { format: "Большая история — 14 страниц", diploma: true, certificate: true, futureLetter: true, copy: "Скидка 50%" },
  ];
  const catalogScenarios = isSchool
    ? [
        {
          title: "Доступная память о классе",
          description: "Три компактных формата для главных портретов и фотографий класса.",
          options: packages.slice(0, 3),
        },
        {
          title: "Школьные годы",
          description: "Оптимальный баланс личных кадров, друзей и событий школьной жизни.",
          options: packages.slice(3, 4),
          badge: "Рекомендуем",
        },
        {
          title: "Большая история",
          description: "Максимальная версия с несколькими съёмками и выпускным.",
          options: packages.slice(4, 5),
        },
      ]
    : [
        {
          title: "Память о группе",
          description: "Три компактных формата для главных портретов, друзей и воспитателей.",
          options: packages.slice(0, 3),
        },
        {
          title: "История детства",
          description: "Оптимальный баланс личных кадров, событий группы и стоимости.",
          options: packages.slice(3, 4),
          badge: "Рекомендуем",
        },
        {
          title: "Большая история",
          description: "История года в детском саду с несколькими съёмками и выпускным.",
          options: packages.slice(4, 5),
        },
      ];

  return (
    <section id="albums" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Каталог
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {isSchool
              ? "Три понятных уровня — от компактных форматов до большой истории школьных лет. Внутри доступны пять точных комплектаций."
              : "Три понятных варианта — от компактной памяти о группе до большой истории года в детском саду. Все альбомы имеют формат 21×30 см."}
          </p>
        </div>

        <div 
          ref={catalogRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${catalogVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-10 grid gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <p><strong className="block text-foreground">Электронные фотографии</strong><span className="text-muted-foreground">Все удачные кадры — в подарок</span></p>
            <p><strong className="block text-foreground">Минимальный тираж</strong><span className="text-muted-foreground">От {isSchool ? "15" : "10"} альбомов</span></p>
            <p><strong className="block text-foreground">{isSchool ? "Для учителя" : "Для воспитателей"}</strong><span className="text-muted-foreground">{isSchool ? "1 альбом для учителя — бесплатно" : "1 альбом бесплатно, второй — со скидкой 50%"}</span></p>
            <p><strong className="block text-foreground">Доставка</strong><span className="text-muted-foreground">До пункта выдачи СДЭК включена</span></p>
          </div>

          <div className="mb-12 grid gap-4 lg:grid-cols-3">
            {catalogScenarios.map((scenario) => {
              const active = scenario.options.some((album) => album.id === selectedId);
              return (
                <article key={scenario.title} className={`relative rounded-2xl border p-5 transition-all ${active ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-background shadow-soft"}`}>
                  {scenario.badge && <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{scenario.badge}</span>}
                  <h3 className="text-xl font-bold text-foreground">{scenario.title}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">{scenario.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {scenario.options.map((album) => (
                      <Button key={album.id} type="button" size="sm" variant={selectedId === album.id ? "default" : "outline"} onClick={() => setSelectedId(album.id)}>
                        {album.shortTitle} · {album.price}
                      </Button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Selected Album Display */}
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Left column - Album preview */}
            <div className="order-2 lg:order-1 flex-1 lg:max-w-[55%]">
              {/* Album preview */}
              <div className="bg-gradient-card p-6 lg:p-8 rounded-xl shadow-glow">
                {isSchool ? <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/25 bg-primary/5 p-8 text-center">
                  <Images className="h-12 w-12 text-primary/60" />
                  <p className="mt-4 font-semibold text-foreground">Пример школьного альбома</p>
                  <p className="mt-2 text-sm text-muted-foreground">Добавим обложку и развороты этого формата после подготовки фотографий.</p>
                </div> : <ResponsiveImage
                  basePath={currentAlbum.image.replace(/\.(webp|jpg|jpeg|png)$/, '')}
                  alt={`Разворот альбома ${currentAlbum.title}`}
                  className="w-full aspect-square object-cover rounded-lg shadow-soft"
                  loading="lazy"
                  type="cover"
                />}
                <div className="mt-4 lg:mt-6 text-center">
                  {!isSchool && <Button
                    variant="secondary"
                    onClick={handleVideoClick}
                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 px-6 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Смотреть видео
                  </Button>}
                </div>
              </div>
            </div>

            {/* Right column - Price card and features */}
            <div className="order-1 lg:order-2 flex-1 lg:max-w-[45%] space-y-6">
              {/* Price Card */}
              <Card className="bg-gradient-card border-primary/20 shadow-glow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-foreground flex items-center justify-between">
                    {currentAlbum.title}
                    {currentAlbum.popular && (
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        Популярный
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <p className="text-lg text-muted-foreground">{currentAlbum.description}</p>
                    <p className="mt-3 rounded-lg bg-primary/5 p-3 text-sm leading-relaxed text-foreground">
                      <strong>Подойдёт, если:</strong> {currentAlbum.suitableFor}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl lg:text-3xl font-bold text-primary">
                      {currentAlbum.price}
                    </span>
                    <span className="text-sm text-muted-foreground">за 1 альбом</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">При тираже от {isSchool ? "15" : "10"} экземпляров</p>
                </CardContent>
              </Card>

              {/* Included features */}
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg lg:text-xl text-foreground">
                    Что включено:
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 lg:space-y-3">
                    {currentAlbum.features.map((feature, index) => {
                      return (
                        <li key={index} className="flex items-start gap-2 lg:gap-3">
                          <span className="text-primary font-bold text-base lg:text-lg">✓</span>
                          <span className="text-foreground text-sm lg:text-base">
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  
                  {"additionalInfo" in currentAlbum && (
                    <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-accent-soft rounded-lg">
                      <div className="flex items-start gap-2 lg:gap-3">
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground text-sm lg:text-base">
                            {currentAlbum.additionalInfo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5">
            <div className="border-b border-primary/15 px-5 py-4">
              <h3 className="text-xl font-bold text-foreground">Цена без сюрпризов</h3>
              <p className="mt-1 text-sm text-muted-foreground">Заранее показываем, что входит в заказ и какие дополнения можно выбрать.</p>
            </div>
            <div className="grid gap-5 p-5 md:grid-cols-3">
              <div>
                <h4 className="font-bold text-foreground">Входит в стоимость</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Съёмка, обработка, макет и его проверка, печать альбома 21×30 см, все удачные электронные фотографии и доставка до пункта выдачи СДЭК.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground">Можно добавить</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Дополнительные развороты. Копию альбома для близких со скидкой до 50%.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground">Без дополнительной оплаты</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Досъёмка отсутствовавших детей по договорённости и до трёх согласованных этапов корректировок макета.</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            {!isSchool && <>
            <div className="mb-7 text-center">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">Сравните форматы</h3>
              <p className="mt-2 text-muted-foreground">Главные различия всех пяти вариантов на одном экране</p>
            </div>

            <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-muted/70 text-foreground">
                  <tr>
                    <th className="p-4 font-semibold">Альбом</th>
                    <th className="p-4 font-semibold">Формат</th>
                    <th className="p-4 font-semibold">Съёмка</th>
                    <th className="p-4 font-semibold">Цена за альбом</th>
                    <th className="p-4 font-semibold">Лучше всего подходит</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((album) => (
                    <tr key={album.id} className={`border-t border-border ${album.popular ? "bg-primary/5" : "bg-background"}`}>
                      <td className="p-4 font-semibold text-foreground">{album.title}{album.popular && <span className="ml-2 text-xs text-primary">Оптимальный выбор</span>}</td>
                      <td className="p-4 text-muted-foreground">{album.comparisonFormat}</td>
                      <td className="p-4 text-muted-foreground">{album.shootingDays}</td>
                      <td className="p-4 font-bold text-primary">{album.price}</td>
                      <td className="max-w-xs p-4 text-muted-foreground">{album.suitableFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {packages.map((album) => (
                <article key={album.id} className={`rounded-xl border p-4 ${album.popular ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-foreground">{album.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{album.comparisonFormat} · {album.shootingDays}</p>
                    </div>
                    <p className="shrink-0 font-bold text-primary">{album.price}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{album.suitableFor}</p>
                  {album.popular && <p className="mt-2 text-xs font-bold text-primary">Оптимальный выбор</p>}
                </article>
              ))}
            </div>
            </>}

            <div className={`${isSchool ? "" : "mt-8"} overflow-hidden rounded-2xl border border-primary/20 bg-primary/5`}>
              <div className="border-b border-primary/15 px-5 py-4">
                <h4 className="font-bold text-foreground">Особые дополнения старших форматов</h4>
                <p className="mt-1 text-sm text-muted-foreground">Коротко о том, чем отличаются три полноценных альбома.</p>
              </div>
              <div className="hidden md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-background/70 text-foreground">
                    <tr>
                      <th className="p-4 font-semibold">Формат</th>
                      <th className="p-4 font-semibold">Диплом</th>
                      <th className="p-4 font-semibold">Персональная грамота</th>
                      <th className="p-4 font-semibold">«Письмо в будущее»</th>
                      <th className="p-4 font-semibold">Копия для близких</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seniorPackageComparison.map((item) => (
                      <tr key={item.format} className="border-t border-primary/10 bg-background/50">
                        <td className="p-4 font-semibold text-foreground">{item.format}</td>
                        <td className="p-4 text-muted-foreground">{item.diploma ? "✓" : "—"}</td>
                        <td className="p-4 text-muted-foreground">{item.certificate ? "✓" : "—"}</td>
                        <td className="p-4 text-muted-foreground">{item.futureLetter ? "✓" : "—"}</td>
                        <td className="p-4 font-medium text-foreground">{item.copy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 p-4 md:hidden">
                {seniorPackageComparison.map((item) => (
                  <article key={item.format} className="rounded-xl border border-primary/15 bg-background p-4">
                    <h5 className="font-bold text-foreground">{item.format}</h5>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {[item.diploma && "диплом", item.certificate && "персональная грамота", item.futureLetter && "«Письмо в будущее»"].filter(Boolean).join(" · ") || "Без дополнительных материалов"}
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">Копия для близких: {item.copy.toLowerCase()}</p>
                  </article>
                ))}
              </div>
              <p className="border-t border-primary/15 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {isSchool
                  ? "«Письмо в будущее» — персональный разворот с фотографией выпускника, важными воспоминаниями о классе, планами после школы и коротким посланием себе через несколько лет."
                  : "«Письмо в будущее» — персональный разворот с фотографией ребёнка и его ответами на вопросы о мечтах, любимых занятиях и детском саде."}
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <a href={`${isSchool ? "/school" : "/kindergarten"}#cta`} onClick={(event) => { event.preventDefault(); document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" }); }}>
                Рассчитать стоимость для {isSchool ? "класса" : "группы"}
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc={currentAlbum.video}
        title={`Видео альбома ${currentAlbum.title}`}
      />
    </section>
  );
};

export default AlbumCatalog;
