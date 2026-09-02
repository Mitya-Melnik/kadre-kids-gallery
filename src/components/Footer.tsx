import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { contacts } from "@/config/contacts";
import { business } from "@/config/business";

interface FooterProps {
  hideQuickLinks?: boolean;
  hideSchoolAlbumLink?: boolean;
  kindergartenPage?: boolean;
}

const Footer = ({ hideQuickLinks = false, hideSchoolAlbumLink = false, kindergartenPage = false }: FooterProps) => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = kindergartenPage
    ? [
        { name: "Каталог альбомов", href: "#albums" },
        { name: "Реальный проект", href: "#case-kindergarten-108" },
        { name: "Как создаётся альбом", href: "#process" },
        { name: "Макеты", href: "#layouts" },
        { name: "Галерея", href: "#gallery" },
        { name: "Вопросы и ответы", href: "#kindergarten-faq" },
        { name: "Оставить заявку", href: "#cta" },
      ]
    : [
        { name: "О нас", href: "#hero" },
        { name: "Преимущества", href: "#advantages" },
        { name: "Галерея", href: "#gallery" },
        { name: "Как проходит съемка", href: "#process" },
        { name: "Стоимость", href: "#pricing" },
        { name: "Вопросы и ответы", href: "#faq" },
        { name: "Обсудить съёмку", href: "#cta" },
      ];

  return (
    <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Контакты с соцсетями */}
          <div className="lg:col-span-2">
            <div className="mb-6 inline-flex items-center gap-3 rounded-xl border border-slate-700 bg-white/5 px-4 py-3 text-slate-200">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-white">Написать в MAX</div>
                <div className="text-xs text-slate-400">Найдите нас по номеру {contacts.max.display}</div>
              </div>
            </div>
            <div className="mb-6">
              {contacts.max.channelUrl ? (
                <a
                  href={contacts.max.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg border border-primary/40 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/20"
                >
                  Подписаться на канал в MAX
                </a>
              ) : (
                <span className="inline-flex cursor-default rounded-lg border border-dashed border-slate-700 px-4 py-2 text-sm text-slate-400">
                  Канал в MAX — скоро
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Контакты
              </h3>
            </div>
            
            {/* Контакты */}
            <div className="space-y-3">
              <a 
                href={contacts.phone.href}
                className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{contacts.phone.display}</span>
              </a>
              
              <a 
                href={contacts.email.href}
                className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{contacts.email.display}</span>
              </a>
              
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Санкт-Петербург и область</span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Ежедневно с 9:00 до 18:00</span>
              </div>
            </div>
          </div>

          {/* Быстрые ссылки */}
          {!hideQuickLinks && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Быстрые ссылки</h4>
              <nav className="space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-300 hover:text-primary transition-colors text-sm block w-full text-left"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Выпускные альбомы */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Выпускные альбомы</h4>
            <nav className="space-y-2">
              {kindergartenPage ? (
                <>
                  <span className="text-primary text-sm block font-semibold">Для детского сада</span>
                  <Link to="/" className="text-slate-300 hover:text-primary transition-colors text-sm block">
                    Вернуться на главную
                  </Link>
                </>
              ) : (
                <Link
                  to="/kindergarten"
                  className="text-primary hover:text-primary-glow transition-colors text-sm block font-semibold"
                >
                  Детский сад
                </Link>
              )}
              {!hideSchoolAlbumLink && <span className="text-slate-500 text-sm block">Для школы — раздел готовится</span>}
            </nav>
          </div>

        </div>
        
        {/* Нижняя часть футера */}
        <div className="pt-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center text-sm text-slate-400 md:text-left">
              <p><span className="font-semibold text-white">Фотостудия «Дети в кадре»</span> © 2026</p>
              <p className="mt-1 text-xs">{business.legalName} · ИНН {business.inn} · ОГРНИП {business.ogrnip}</p>
            </div>
            <div className="flex gap-6 text-xs text-slate-500">
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Политика обработки данных</Link>
              <Link to="/personal-data-consent" className="hover:text-slate-300 transition-colors">Согласие на обработку данных</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
