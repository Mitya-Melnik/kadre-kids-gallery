import { Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#E9E9E9] text-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Контакты */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">Контакты</h3>
            <div className="space-y-3">
              <a 
                href="tel:+79956002111" 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +7 995 600 2111
              </a>
              <a 
                href="mailto:info@detivkadre.ru" 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                info@detivkadre.ru
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Санкт-Петербург и область
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-4 h-4" />
                Ежедневно с 9:00 до 18:00
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2 text-foreground">Руководитель: Дмитрий</h4>
              <p className="text-sm text-muted-foreground">
                15 лет опыта, 2100+ фотосессий, 168000+ купленных фотографий
              </p>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Меню</h3>
            <nav className="space-y-2">
              <a href="#advantages" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Преимущества</a>
              <a href="#gallery" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Галерея</a>
              <a href="#process" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Как проходит съемка</a>
              <a href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Стоимость</a>
              <a href="#faq" className="block text-muted-foreground hover:text-primary transition-colors text-sm">Вопросы и ответы</a>
            </nav>
          </div>

          {/* Социальные сети */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Мы в соцсетях</h3>
            <div className="flex gap-4 mb-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center text-foreground hover:text-primary hover:bg-foreground/20 transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.886 6.728-1.253 8.928-.156.93-.462 1.244-.759 1.274-.644.059-1.133-.424-1.757-.83-1.768-1.146-2.765-1.86-4.481-2.977-1.983-1.289-0.696-1.998 0.432-3.157 0.293-.301 5.383-4.929 5.483-5.35 0.013-.053 0.024-.252-.094-.357-.118-.105-.292-.069-.417-.04-.177.04-2.977 1.886-8.407 5.541-.793.552-1.512.821-2.156.807-.71-.015-2.077-.401-3.093-.731-1.245-.405-2.236-.618-2.15-1.306.045-.357.545-.723 1.501-1.099C6.112 9.016 10.069 7.42 12 6.686c5.231-2.175 6.312-2.554 7.029-2.565.156-.002.504.036.73.219.189.154.241.362.267.509.025.147.057.483.032.747z"/>
                </svg>
              </a>
              
              <a 
                href="#" 
                className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center text-foreground hover:text-primary hover:bg-foreground/20 transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              
              <a 
                href="#" 
                className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center text-foreground hover:text-primary hover:bg-foreground/20 transition-colors"
                aria-label="VKontakte"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.131-.427.131-.427s-.019-1.306.587-1.496c.597-.187 1.36.263 2.17.757.616.376 1.083.293 1.083.293l2.175-.03s1.139-.071.599-.965c-.044-.072-.31-.652-1.597-1.846-1.347-1.249-1.167-.1.456-1.655 1.005-1.649 1.483-2.139 1.35-2.486-.127-.331-.91-.244-.91-.244l-2.448.015s-.182-.024-.315.056-.218.183-.218.183-.41 1.09-.958 2.015c-1.156 1.952-1.617 2.056-1.805 1.934-.438-.284-.328-1.14-.328-1.748 0-1.902.288-2.696-.563-2.899-.282-.067-.49-.112-1.21-.119-.925-.009-1.708.003-2.15.22-.295.145-.523.467-.384.486.171.023.559.105.765.385.265.36.255 1.169.255 1.169s.151 2.24-.353 2.516c-.346.189-.822-.197-1.843-1.985-.522-.9-.917-1.896-.917-1.896s-.076-.186-.212-.286c-.164-.121-.394-.159-.394-.159l-2.324.015s-.35.01-.478.161c-.114.135-.009.413-.009.413s1.924 4.506 4.101 6.778c1.994 2.081 4.259 1.945 4.259 1.945z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            Фотостудия "Дети в кадре" © 2025. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;