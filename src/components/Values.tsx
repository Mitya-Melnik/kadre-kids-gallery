import { CreditCard, Shield, Clock, MessageCircle, CheckCircle, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Values = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  const values = [
    {
      icon: CreditCard,
      title: "0 ₽ предоплаты",
      description: "Заказываете только понравившиеся фотографии — никаких лишних расходов."
    },
    {
      icon: Shield,
      title: "100% безопасность и прозрачность", 
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
    <section id="values" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Почему мы
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы создаем ценные воспоминания, которые будут радовать семьи долгие годы, 
            с акцентом на качество и эмоциональность
          </p>
        </div>
        
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className={`bg-gradient-card p-8 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-2 text-center group ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: gridVisible ? `${index * 100}ms` : '0ms',
                transitionDuration: '700ms'
              }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;