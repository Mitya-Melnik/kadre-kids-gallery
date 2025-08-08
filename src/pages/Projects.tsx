import React, { useState } from 'react';
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Phone, Mail, MessageCircle } from "lucide-react";

interface Project {
  id: number;
  name: string;
  image: string;
  status: 'available' | 'custom';
  standardPrice: number;
  premiumPrice: number;
  description: string;
  gallery: string[];
  standardIncludes: string[];
  premiumIncludes: string[];
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const { toast } = useToast();

  // Моковые данные проектов
  const projects: Project[] = [
    {
      id: 1,
      name: "Весенняя фотозона",
      image: "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
      status: 'available',
      standardPrice: 15000,
      premiumPrice: 25000,
      description: "Нежная весенняя декорация с цветами и пастельными тонами",
      gallery: [
        "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
        "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
        "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png"
      ],
      standardIncludes: [
        "3 фона в высоком разрешении",
        "Ссылки на покупку реквизита",
        "Готовый шаблон для печати образцов",
        "Инструкция по сборке"
      ],
      premiumIncludes: [
        "3 фона в высоком разрешении",
        "Ссылки на покупку реквизита", 
        "Готовый шаблон для печати образцов",
        "Инструкция по сборке",
        "Весь реквизит под ключ",
        "Доставка до фотостудии",
        "Помощь в установке"
      ]
    },
    // Добавляем еще 11 проектов для демонстрации
    ...Array.from({ length: 11 }, (_, i) => ({
      id: i + 2,
      name: `Декорация ${i + 2}`,
      image: "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
      status: Math.random() > 0.5 ? 'available' : 'custom' as 'available' | 'custom',
      standardPrice: 12000 + Math.floor(Math.random() * 8000),
      premiumPrice: 20000 + Math.floor(Math.random() * 10000),
      description: `Описание декорации ${i + 2}`,
      gallery: [
        "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
        "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png"
      ],
      standardIncludes: [
        "3 фона в высоком разрешении",
        "Ссылки на покупку реквизита",
        "Готовый шаблон для печати образцов"
      ],
      premiumIncludes: [
        "3 фона в высоком разрешении",
        "Ссылки на покупку реквизита",
        "Готовый шаблон для печати образцов",
        "Весь реквизит под ключ",
        "Доставка до фотостудии"
      ]
    }))
  ];

  const testimonials = [
    {
      image: "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
      text: "Потрясающие декорации! Дети были в восторге от съёмки.",
      author: "Анна, фотограф"
    },
    {
      image: "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png", 
      text: "Качество реквизита превзошло все ожидания. Рекомендую!",
      author: "Марина, студия 'Солнечный кадр'"
    },
    {
      image: "/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png",
      text: "Отличный сервис и быстрая доставка. Будем заказывать ещё!",
      author: "Елена, фотограф-freelancer"
    }
  ];

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.gallery.length - 1 : prev - 1
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    // Здесь должна быть интеграция с amoCRM
    toast({
      title: "Заявка отправлена!",
      description: "Наш менеджер свяжется с вами в ближайшее время",
    });
    
    setFormData({ name: '', email: '', phone: '', comment: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      {/* Заголовок страницы */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Проекты под ключ
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Готовые декорации для детской фотосъёмки. Выберите подходящий пакет: 
              стандартный с материалами или премиум под ключ с реквизитом
            </p>
          </div>
        </div>
      </section>

      {/* Каталог проектов */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id}
                className="hover-lift cursor-pointer overflow-hidden border-border bg-card"
                onClick={() => openModal(project)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-card-foreground line-clamp-2">
                      {project.name}
                    </h3>
                    <Badge 
                      variant={project.status === 'available' ? 'default' : 'secondary'}
                      className="ml-2 flex-shrink-0"
                    >
                      {project.status === 'available' ? 'В наличии' : 'Под заказ'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Стандартный:</span>
                      <span className="font-semibold text-primary">
                        {project.standardPrice.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Под ключ:</span>
                      <span className="font-semibold text-secondary-accent">
                        {project.premiumPrice.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(project);
                    }}
                  >
                    Оставить заявку
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Социальное доказательство */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Наши декорации в работе
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={`Работа ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <blockquote className="text-muted-foreground italic mb-2">
                  "{testimonial.text}"
                </blockquote>
                <cite className="text-sm font-medium text-foreground">
                  — {testimonial.author}
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Футер каталога */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Быстрые ссылки
              </h3>
              <div className="space-y-2">
                <a href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                  Главная
                </a>
                <a href="#gallery" className="block text-muted-foreground hover:text-primary transition-colors">
                  Галерея
                </a>
                <a href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                  Цены
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Контакты менеджера
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+7 (999) 123-45-67</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>manager@detivkadre.ru</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Telegram: @detivkadre_manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Модальное окно */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedProject.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Галерея */}
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <img 
                      src={selectedProject.gallery[currentImageIndex]} 
                      alt={selectedProject.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProject.gallery.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {selectedProject.gallery.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedProject.gallery.map((image, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            index === currentImageIndex ? 'border-primary' : 'border-border'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img 
                            src={image} 
                            alt={`${selectedProject.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Информация и форма */}
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    {selectedProject.description}
                  </p>

                  {/* Табы с пакетами */}
                  <Tabs defaultValue="standard" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="standard">Стандартный пакет</TabsTrigger>
                      <TabsTrigger value="premium">Пакет «Под ключ»</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="standard" className="space-y-4">
                      <div className="text-2xl font-bold text-primary">
                        {selectedProject.standardPrice.toLocaleString()} ₽
                      </div>
                      <ul className="space-y-2">
                        {selectedProject.standardIncludes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="premium" className="space-y-4">
                      <div className="text-2xl font-bold text-secondary-accent">
                        {selectedProject.premiumPrice.toLocaleString()} ₽
                      </div>
                      <ul className="space-y-2">
                        {selectedProject.premiumIncludes.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>

                  {/* Форма заказа */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Имя *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label>Выберите пакет</Label>
                      <RadioGroup 
                        value={selectedPackage} 
                        onValueChange={setSelectedPackage}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard">
                            Стандартный пакет — {selectedProject.standardPrice.toLocaleString()} ₽
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="premium" id="premium" />
                          <Label htmlFor="premium">
                            Пакет «Под ключ» — {selectedProject.premiumPrice.toLocaleString()} ₽
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="comment">Комментарий</Label>
                      <Textarea
                        id="comment"
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Дополнительные пожелания или вопросы..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Отправить заявку
                    </Button>
                  </form>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;