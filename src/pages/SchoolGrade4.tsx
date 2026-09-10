import { Helmet } from "react-helmet";
import { Building2, Check, Images, Smile, UserCheck, UsersRound } from "lucide-react";
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

const PhotoPlaceholder = ({ title, text, className = "" }: { title: string; text: string; className?: string }) => (
  <div className={`flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center ${className}`}>
    <Images className="mb-4 h-10 w-10 text-primary/70" />
    <p className="font-bold text-foreground">{title}</p>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{text}</p>
  </div>
);

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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><a href="#cta">Рассчитать стоимость</a></Button><Button asChild variant="outline" size="lg"><a href="#albums">Посмотреть альбомы</a></Button></div>
          </div>
          <PhotoPlaceholder title="Главная фотография 4 класса" text="Здесь появится живой кадр четвероклассников с первой учительницей и готовым альбомом." className="min-h-[430px]" />
        </div>
      </section>

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

      <section id="case-school" className="bg-primary/5 py-20"><div className="container mx-auto px-4"><PhotoPlaceholder title="Реальный проект 4 класса" text="Добавим задачу класса, съёмочные сюжеты, готовый альбом и отзыв родителей после подготовки материалов." className="mx-auto max-w-6xl" /></div></section>

      <Process initialType="album" fixedType="album" audience="grade4" />

      <section id="layouts" className="bg-background pb-20"><div className="container mx-auto px-4"><PhotoPlaceholder title="Макеты альбомов для 4 класса" text="Здесь появятся обложки, развороты и видео перелистывания после подготовки школьных материалов." className="mx-auto max-w-6xl" /></div></section>

      <section id="gallery" className="py-20">
        <div className="container mx-auto px-4"><header className="mx-auto mb-10 max-w-3xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Реальные съёмки</p><h2 className="text-3xl font-bold md:text-5xl">Первые школьные годы</h2><p className="mt-4 text-muted-foreground">Покажем портреты, друзей, первую учительницу, уроки, перемены и важные события класса.</p></header><PhotoPlaceholder title="Фотогалерея 4 класса" text="Место подготовлено под 10–15 лучших кадров из проведённых съёмок начальной школы." className="mx-auto max-w-6xl" /></div>
      </section>

      <KindergartenAdvantages audience="grade4" />

      <KindergartenFAQ audience="grade4" />

      <CTA initialDirection="album" initialAudience="school" fixedDirection="album" fixedAudience="school" schoolLevel="grade4" />
    </main>
    <Footer schoolPage schoolLevel="grade4" />
    <FabContact />
    <BackToTop />
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"><Button asChild className="w-full" size="lg"><a href="#cta">Рассчитать стоимость</a></Button></div>
  </div>
);

export default SchoolGrade4;
