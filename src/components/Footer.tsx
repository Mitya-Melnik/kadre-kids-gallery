import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";

const Footer = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { name: "О нас", href: "#hero" },
    { name: "Преимущества", href: "#advantages" },
    { name: "Галерея", href: "#gallery" },
    { name: "Как проходит съемка", href: "#process" },
    { name: "Стоимость", href: "#pricing" },
    { name: "Вопросы и ответы", href: "#faq" },
    { name: "Заказать презентацию", href: "#cta" },
  ];

  return (
    <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Основная информация */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Контакты
              </h3>
            </div>
            
            {/* Контакты */}
            <div className="space-y-3">
              <a 
                href="tel:+79956002111" 
                className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+7 995 600 2111</span>
              </a>
              
              <a 
                href="mailto:info@detivkadre.ru" 
                className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@detivkadre.ru</span>
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
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Быстрые ссылки</h4>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors text-sm group w-full text-left"
                >
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Социальные сети */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Мы в соцсетях</h4>
            <div className="flex gap-3 mb-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary/20 transition-all duration-200 hover:scale-110"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.886 6.728-1.253 8.928-.156.93-.462 1.244-.759 1.274-.644.059-1.133-.424-1.757-.83-1.768-1.146-2.765-1.86-4.481-2.977-1.983-1.289-0.696-1.998 0.432-3.157 0.293-.301 5.383-4.929 5.483-5.35 0.013-.053 0.024-.252-.094-.357-.118-.105-.292-.069-.417-.04-.177.04-2.977 1.886-8.407 5.541-.793.552-1.512.821-2.156.807-.71-.015-2.077-.401-3.093-.731-1.245-.405-2.236-.618-2.15-1.306.045-.357.545-.723 1.501-1.099C6.112 9.016 10.069 7.42 12 6.686c5.231-2.175 6.312-2.554 7.029-2.565.156-.002.504.036.73.219.189.154.241.362.267.509.025.147.057.483.032.747z"/>
                </svg>
              </a>
              
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary/20 transition-all duration-200 hover:scale-110"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-primary/20 transition-all duration-200 hover:scale-110"
                aria-label="VKontakte"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.131-.427.131-.427s-.019-1.306.587-1.496c.597-.187 1.36.263 2.17.757.616.376 1.083.293 1.083.293l2.175-.03s1.139-.071.599-.965c-.044-.072-.31-.652-1.597-1.846-1.347-1.249-1.167-.1.456-1.655 1.005-1.649 1.483-2.139 1.35-2.486-.127-.331-.91-.244-.91-.244l-2.448.015s-.182-.024-.315.056-.218.183-.218.183-.41 1.09-.958 2.015c-1.156 1.952-1.617 2.056-1.805 1.934-.438-.284-.328-1.14-.328-1.748 0-1.902.288-2.696-.563-2.899-.282-.067-.49-.112-1.21-.119-.925-.009-1.708.003-2.15.22-.295.145-.523.467-.384.486.171.023.559.105.765.385.265.36.255 1.169.255 1.169s.151 2.24-.353 2.516c-.346.189-.822-.197-1.843-1.985-.522-.9-.917-1.896-.917-1.896s-.076-.186-.212-.286c-.164-.121-.394-.159-.394-.159l-2.324.015s-.35.01-.478.161c-.114.135-.009.413-.009.413s1.924 4.506 4.101 6.778c1.994 2.081 4.259 1.945 4.259 1.945z"/>
                </svg>
              </a>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h5 className="text-sm font-semibold mb-1 text-white">Дети в кадре</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Выездные фотосессии<br/>
                в Санкт-Петербурге
              </p>
            </div>
          </div>
        </div>
        
        {/* Нижняя часть футера */}
        <div className="pt-6 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">Фотостудия "Дети в кадре"</span> © 2025
            </p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Пользовательское соглашение</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;