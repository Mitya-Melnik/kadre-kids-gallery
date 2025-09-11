import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Check, Star, Clock, MessageCircle, Palette, Camera, FileCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import FabContact from "@/components/FabContact";
import BackToTop from "@/components/BackToTop";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Kindergarten = () => {
  const [selectedSize, setSelectedSize] = useState("Small");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("Все");
  
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: galleryRef, isVisible: galleryVisible } = useScrollAnimation();
  const { ref: advantagesRef, isVisible: advantagesVisible } = useScrollAnimation();

  const heroImages = [
    "/lovable-uploads/4ef3fe26-c30b-4201-af18-80c4222a2550.png",
    "/lovable-uploads/1c6b6a7b-f6f2-4a1a-b3d4-5e6f7a8b9c0d.png",
    "/lovable-uploads/2d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a.png"
  ];

  const advantages = [
    { icon: "📸", text: "Отдаем все фотографии со съемки" },
    { icon: "🏥", text: "Бесплатно доснимем если заболели" },
    { icon: "⏰", text: "100% заказов отдали вовремя" },
    { icon: "🎯", text: "Высокое качество в любых условиях" }
  ];

  const filters = ["Все", "Школа", "Студия", "Циклорама", "Тематические"];

  const packages = {
    "Small": { 
      price: "1200₽", 
      oldPrice: "1400₽",
      description: "16 страниц",
      includes: ["Один съемочный день", "Индивидуальный разворот владельца", "Общая фотография всей группы", "3 разворота групповых фотографий", "Разворот с фотографиями одногрупников", "5 дизайнов на выбор"]
    },
    "Small+": { 
      price: "1500₽", 
      oldPrice: "1700₽",
      description: "20 страниц",
      includes: ["Один съемочный день", "Индивидуальный разворот владельца", "Общая фотография всей группы", "4 разворота групповых фотографий", "Разворот с фотографиями одногрупников", "5 дизайнов на выбор"]
    },
    "Mini": { 
      price: "900₽", 
      oldPrice: "1100₽",
      description: "12 страниц",
      includes: ["Один съемочный день", "Индивидуальный разворот владельца", "Общая фотография всей группы", "2 разворота групповых фотографий", "5 дизайнов на выбор"]
    },
    "Extra": { 
      price: "2200₽", 
      oldPrice: "2500₽",
      description: "28 страниц",
      includes: ["Один съемочный день", "Индивидуальный разворот владельца", "Общая фотография всей группы", "6 разворотов групповых фотографий", "Разворот с фотографиями одногрупников", "5 дизайнов на выбор"]
    },
    "Max": { 
      price: "3200₽", 
      oldPrice: "3600₽",
      description: "40 страниц",
      includes: ["Один съемочный день", "Индивидуальный разворот владельца", "Общая фотография всей группы", "8 разворотов групповых фотографий", "2 разворота с фотографиями одногрупников", "5 дизайнов на выбор"]
    }
  };

  const benefits = [
    {
      icon: Star,
      title: "Высокое качество",
      description: "Печать происходит на цифровом оборудовании HP Indigo и Ricoh Pro. Твердая фотообложка, развороты на 180 градусов, ламинированная поверхность, плотные листы. Технология сборки — через склеивание цельных разворотов между собой."
    },
    {
      icon: Clock,
      title: "100% заказов вовремя",
      description: "Сроки соблюдаем и не срываем дедлайны."
    },
    {
      icon: MessageCircle,
      title: "Игра вместо позирования",
      description: "Ребёнок расслаблен и в кадре настоящий."
    },
    {
      icon: MessageCircle,
      title: "Быстрая коммуникация",
      description: "Отвечаем быстро в мессенджерах и всегда на связи с родителями."
    },
    {
      icon: Palette,
      title: "Живая ретушь + AI",
      description: "Совмещаем алгоритмы и ручную ретушь — кадры остаются живыми и натуральными."
    },
    {
      icon: Camera,
      title: "Техника",
      description: "Привозим собственное оборудование и создаём настоящую фотостудию прямо в детском саду."
    },
    {
      icon: FileCheck,
      title: "Все документы и разрешения",
      description: "У нас есть полный комплект документов и все разрешения на съёмку в соответствии с требованиями детских садов."
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Анна Петрова",
      role: "Мама Маши",
      text: "Потрясающие альбомы! Фотограф нашёл подход к каждому ребёнку, все фото получились живыми и естественными. Качество печати превзошло все ожидания.",
      avatar: "/lovable-uploads/avatar1.jpg"
    },
    {
      id: 2,
      name: "Елена Сидорова",
      role: "Заведующая детским садом №45",
      text: "Сотрудничаем уже третий год подряд. Профессиональная команда, всегда соблюдают сроки, у них все необходимые документы.",
      avatar: "/lovable-uploads/avatar2.jpg"
    },
    {
      id: 3,
      name: "Дмитрий Козлов",
      role: "Папа Артёма",
      text: "Альбом стал настоящим сокровищем нашей семьи. Каждая страница передаёт атмосферу детского сада и показывает, как рос наш сын.",
      avatar: "/lovable-uploads/avatar3.jpg"
    }
  ];

  const faqData = [
    {
      question: "💳 Вы работаете по предоплате?",
      answer: "Да, мы работаем по предоплате 50% для бронирования даты съёмки. Остальная сумма оплачивается при получении готовых альбомов."
    },
    {
      question: "🏢 Кто оплачивает и бронирует студию?",
      answer: "Всё оборудование мы привозим с собой и создаём студию прямо в детском саду. Никаких дополнительных трат на аренду помещений не требуется."
    },
    {
      question: "👩‍🏫 А альбом воспитателю?",
      answer: "Да, альбом для воспитателя входит в стоимость каждого пакета. Это наш подарок педагогу за труд и заботу о детях."
    },
    {
      question: "📅 Какие сроки изготовления альбомов?",
      answer: "Стандартный срок изготовления составляет 14 рабочих дней с момента утверждения макетов. Мы всегда соблюдаем обещанные сроки."
    },
    {
      question: "🎨 Можно ли выбрать дизайн альбома?",
      answer: "Конечно! У нас есть 5 различных дизайнов на выбор. Родители голосуют, и мы используем наиболее популярный вариант для всей группы."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Каждая страница — <span className="text-primary">кусочек детства</span>, который не вернуть
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                    <span className="text-2xl">{advantage.icon}</span>
                    <span className="text-sm text-muted-foreground">{advantage.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-glow">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Выпускник ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Action */}
      <section className="py-8 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">Скидка 15% до 1 октября</h3>
              <p className="text-white/90">Успейте забронировать съёмку по специальной цене</p>
            </div>
            <Button size="lg" variant="secondary" onClick={() => scrollToSection('cta')}>
              Получить консультацию
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section ref={galleryRef} id="gallery" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-700 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Галерея</h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="rounded-full"
                >
                  {filter}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-soft hover:shadow-glow transition-all cursor-pointer hover-lift">
                  <img
                    src={`/lovable-uploads/gallery-${i + 1}.jpg`}
                    alt={`Галерея ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages Catalog */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Каталог пакетов альбомов</h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.keys(packages).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className="rounded-full"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-glow">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="aspect-[4/3] bg-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground">Разворот альбома {selectedSize}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Смотреть видео
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {selectedSize}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {packages[selectedSize as keyof typeof packages].price}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          {packages[selectedSize as keyof typeof packages].oldPrice}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {packages[selectedSize as keyof typeof packages].description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {packages[selectedSize as keyof typeof packages].includes.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-6">
                      Можно добавить индивидуальные развороты (+350₽/разворот)
                    </p>
                    
                    <Button className="w-full" size="lg">
                      Заказать пакет {selectedSize}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section ref={advantagesRef} className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${advantagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Преимущества</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className={`bg-background border border-border hover:shadow-glow hover-lift transition-all duration-700 ${advantagesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Отзывы</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-background border border-border hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ответы на вопросы</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqData.slice(0, 3).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6 bg-background">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-foreground font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-8">
            <Button variant="outline">Смотреть ещё</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-accent-soft">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Готовы создать незабываемые воспоминания?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами для консультации и бронирования съёмки в детском саду
          </p>
          <Button size="xl" className="mb-4">
            Заказать съёмку
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
            <span>📞 +7 (999) 123-45-67</span>
            <span>📧 info@photostudio.ru</span>
          </div>
        </div>
      </section>

      <FabContact />
      <BackToTop />
      <Footer hideQuickLinks={true} />
    </div>
  );
};

export default Kindergarten;