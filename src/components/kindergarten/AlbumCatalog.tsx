import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Plus } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AlbumCatalog = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: catalogRef, isVisible: catalogVisible } = useScrollAnimation(0.1);
  
  const [selectedSize, setSelectedSize] = useState("Mini");

  const albumSizes = {
    "Small": {
      price: "1890 ₽",
      originalPrice: "2200 ₽",
      description: "Компактный альбом 15×15 см",
      pages: "20 страниц",
      image: "/placeholder.svg",
      popular: false
    },
    "Small+": {
      price: "2290 ₽", 
      originalPrice: "2600 ₽",
      description: "Увеличенный альбом 18×18 см",
      pages: "24 страницы",
      image: "/placeholder.svg",
      popular: false
    },
    "Mini": {
      price: "2690 ₽",
      originalPrice: "3100 ₽", 
      description: "Стандартный альбом 20×20 см",
      pages: "28 страниц",
      image: "/placeholder.svg",
      popular: true
    },
    "Extra": {
      price: "3290 ₽",
      originalPrice: "3800 ₽",
      description: "Большой альбом 25×25 см", 
      pages: "32 страницы",
      image: "/placeholder.svg",
      popular: false
    },
    "Max": {
      price: "4290 ₽",
      originalPrice: "4900 ₽",
      description: "Максимальный альбом 30×30 см",
      pages: "40 страниц", 
      image: "/placeholder.svg",
      popular: false
    }
  };

  const includedFeatures = [
    "Один съемочный день",
    "Индивидуальный разворот владельца",
    "Общая фотография всей группы", 
    "3 разворота групповых фотографий",
    "Разворот с фотографиями одногрупников",
    "5 дизайнов на выбор (выбрать 1 на группу)"
  ];

  const handleVideoClick = () => {
    // Handle video modal or redirect
    console.log("Opening video for size:", selectedSize);
  };

  const currentAlbum = albumSizes[selectedSize as keyof typeof albumSizes];

  return (
    <section id="albums" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Каталог пакетов альбомов
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий размер выпускного альбома для вашей группы
          </p>
        </div>

        <div 
          ref={catalogRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${catalogVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Size Switcher */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {Object.keys(albumSizes).map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 transition-all duration-200 relative ${
                  selectedSize === size 
                    ? 'bg-primary hover:bg-primary/90 scale-105' 
                    : 'hover:bg-accent hover:text-foreground hover:scale-105'
                }`}
              >
                {size}
                {albumSizes[size as keyof typeof albumSizes].popular && (
                  <span className="absolute -top-2 -right-2 bg-secondary-accent text-secondary-accent-foreground text-xs px-2 py-1 rounded-full font-semibold">
                    Популярный
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Selected Album Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Album preview */}
            <div className="relative">
              <div className="bg-gradient-card p-8 rounded-xl shadow-glow">
                <img
                  src={currentAlbum.image}
                  alt={`Разворот альбома ${selectedSize}`}
                  className="w-full h-80 object-cover rounded-lg shadow-soft"
                />
                <div className="mt-6 text-center">
                  <Button
                    variant="secondary"
                    onClick={handleVideoClick}
                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 px-6 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Смотреть видео
                  </Button>
                </div>
              </div>
            </div>

            {/* Right side - Details */}
            <div className="space-y-8">
              <Card className="bg-gradient-card border-primary/20 shadow-glow">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center justify-between">
                    {selectedSize}
                    {currentAlbum.popular && (
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        Популярный
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground">{currentAlbum.description}</p>
                  <p className="text-muted-foreground font-medium">{currentAlbum.pages}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-primary">
                      {currentAlbum.price}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {currentAlbum.originalPrice}
                    </span>
                    <span className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Скидка 15%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Included features */}
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    Что включено:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {includedFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg">✓</span>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 p-4 bg-accent-soft rounded-lg">
                    <div className="flex items-start gap-3">
                      <Plus className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Можно добавить индивидуальные развороты
                        </p>
                        <p className="text-muted-foreground text-sm">
                          +350 ₽ за разворот
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlbumCatalog;