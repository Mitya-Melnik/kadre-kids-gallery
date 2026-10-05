import { Link } from "react-router-dom";
import { ArrowRight, Camera, BookOpen } from "lucide-react";
import { contacts } from "@/config/contacts";
import { reachGoal } from "@/lib/analytics";

export default function HomeMobileHero() {
  return <section id="hero" className="home-hero">
    <p className="home-eyebrow">Детские сады и школы · Санкт-Петербург</p>
    <h1>Сохраняем память<br /> о детстве</h1>
    <p className="home-intro">Фотодни и выпускные альбомы, к которым хочется возвращаться.</p>
    <div className="home-hero-images">
      <img src="/kindergarten/hero-square/slide-1-mobile.webp" alt="Выпускной альбом ребёнка" fetchPriority="high" />
      <img src="/galleries/paravoz/cover-mobile.webp" alt="Детская фотосъёмка" />
    </div>
    <div className="home-choices">
      <Link to="/albums" onClick={() => reachGoal("product_select", { product: "albums", placement: "hero" })}><BookOpen aria-hidden="true" /><span>Выпускные альбомы<small>Сад · 4 класс · 9–11 классы</small></span><ArrowRight aria-hidden="true" /></Link>
      <a href="#gallery" onClick={() => reachGoal("product_select", { product: "photo-day", placement: "hero" })}><Camera aria-hidden="true" /><span>Тематические фотодни<small>Выберите съёмку для группы</small></span><ArrowRight aria-hidden="true" /></a>
    </div>
    <a className="home-parent" href={contacts.seendayUrl} target="_blank" rel="noopener noreferrer">Уже были на съёмке? Получить фотографии <ArrowRight size={16} aria-hidden="true" /></a>
    <div className="home-trust"><span><strong>15 лет</strong>снимаем детство бережно</span><span><strong>75+</strong>учреждений доверились нам</span></div>
    <details className="home-facts"><summary>Больше о нашем опыте</summary><div><span><strong>2100+</strong> проведённых фотосессий</span><span><strong>168 тыс.+</strong> фотографий куплено</span></div></details>
  </section>;
}
