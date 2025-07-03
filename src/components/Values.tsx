import { Star, Shield, Heart, Smartphone, Camera } from "lucide-react";

const Values = () => {
  const values = [
    {
      icon: Heart,
      title: "Естественные эмоции",
      description: "Игровой подход для живых и искренних снимков"
    },
    {
      icon: Shield,
      title: "Забота о клиенте", 
      description: "Полная поддержка через Telegram-бот на любом этапе"
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Доступ к фото по уникальному паролю — только ваши кадры"
    },
    {
      icon: Smartphone,
      title: "Удобство",
      description: "Простой личный кабинет, мгновенная загрузка и гибкая оплата"
    },
    {
      icon: Camera,
      title: "Атмосфера",
      description: "Тематический декор и проф-свет делают съёмку праздником"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Наши ценности
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Мы создаем ценные воспоминания, которые будут радовать семьи долгие годы, 
            с акцентом на качество и эмоциональность
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-card p-8 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-2 text-center group"
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