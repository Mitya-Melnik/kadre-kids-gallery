import { CreditCard, Shield, Clock, MessageCircle, CheckCircle, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Advantages = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  const { ref: extraRef, isVisible: extraVisible } = useScrollAnimation(0.2);
  const advantages = [
    {
      icon: CreditCard,
      title: "0 ₽ предоплаты",
      description: "Заказываете только понравившиеся фотографии — никаких лишних расходов."
    },
    {
      icon: Shield,
      title: "Безопасно и прозрачно", 
      description: "Доступ только по паролю, онлайн-оплата, все фотографы с медкнижками."
    },
    {
      icon: Clock,
      title: "7 дней — готовые фото",
      description: "Обработанные снимки в личном кабинете уже через неделю."
    },
    {
      icon: MessageCircle,
      title: "Поддержка 24/7",
      description: "Удобный Telegram-бот: статус заказа всегда доступен в Telegram-боте."
    },
    {
      icon: CheckCircle,
      title: "Удобство организации",
      description: "Мы берём на себя съёмку, работу с детьми, оплату, доставку и взаимодействие с родителями."
    },
    {
      icon: Heart,
      title: "Уют и игра",
      description: "Дети в знакомой обстановке с декорациями, которые увлекают."
    }
  ];

  return (
    <section id="advantages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Почему мы
          </h2>
        </div>
        
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`group bg-gradient-card p-8 rounded-xl transition-all duration-300 ease-out hover:shadow-glow hover:-translate-y-1 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: gridVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out">
                  <advantage.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {advantage.title}
                  </h3>
                   <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: advantage.description }}></p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div ref={extraRef} className={`mt-16 bg-accent-soft p-8 rounded-xl max-w-4xl mx-auto transition-all duration-700 ${extraVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Дополнительные возможности
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Оформление помещений</h4>
              <p className="text-muted-foreground text-sm">Баннеры, стенды, фотосъемка сотрудников</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Подробный отчёт</h4>
              <p className="text-muted-foreground text-sm">По каждому ребёнку для администрации сада</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;