import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center py-20">
      <div className="absolute inset-0 bg-pattern opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Дети в{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              кадре
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Выездная фотостудия в детских садах Санкт-Петербурга. 
            Яркие, живые кадры в тематических декорациях через игру и знакомство.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15</div>
              <div className="text-sm text-muted-foreground">лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2100+</div>
              <div className="text-sm text-muted-foreground">фотосессий</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">168k+</div>
              <div className="text-sm text-muted-foreground">фотографий куплено</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">75+</div>
              <div className="text-sm text-muted-foreground">учреждений оформлено</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="xl">
              Получить презентацию
            </Button>
            <Button variant="outline" size="xl">
              Наши работы
            </Button>
          </div>
          
          <p className="text-muted-foreground mt-8 italic">
            "Ценим моменты и создаем их для вас"
          </p>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">Руководитель Дмитрий</p>
            <p className="text-primary font-semibold text-lg">+7 911 706 1782</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;