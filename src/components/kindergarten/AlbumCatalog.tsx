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
      image: "/placeholder.svg",
      popular: false
    },
    "Small+": {
      price: "2290 ₽", 
      originalPrice: "2600 ₽",
      image: "/placeholder.svg",
      popular: false
    },
    "Mini": {
      price: "2690 ₽",
      originalPrice: "3100 ₽", 
      image: "/placeholder.svg",
      popular: true
    },
    "Extra": {
      price: "3290 ₽",
      originalPrice: "3800 ₽",
      image: "/placeholder.svg",
      popular: false
    },
    "Max": {
      price: "4290 ₽",
      originalPrice: "4900 ₽",
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
            Каталог
          </h2>
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
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:items-center">
            {/* Price Card - First on mobile, right side on desktop */}
            <div className="order-1 lg:order-2">
              <Card className="bg-gradient-card border-primary/20 shadow-glow mb-8 lg:mb-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center justify-between">
                    {selectedSize}
                    {currentAlbum.popular && (
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        Популярный
                      </span>
                    )}
                  </CardTitle>
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
            </div>

            {/* Album preview - Second on mobile, left side on desktop */}
            <div className="order-2 lg:order-1 relative">
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

            {/* Included features - Third on mobile, continues right column on desktop */}
            <div className="order-3 lg:order-2 lg:col-start-2">
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