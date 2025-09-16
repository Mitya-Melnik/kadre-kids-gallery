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
      price: "2700 ₽",
      subtitle: "Альбом папка",
      image: "/placeholder.svg",
      popular: false,
      features: [
        "1 съемочный день",
        "Индивидуальный портрет ребенка",
        "Разворот с владельцем альбома, воспитателями и одногруппниками",
        "12 дизайнов на выбор (выбрать 1 на группу)"
      ]
    },
    "Small+": {
      price: "2950 ₽", 
      subtitle: "Альбом трио",
      image: "/placeholder.svg",
      popular: false,
      features: [
        "1 съемочный день",
        "Индивидуальный портрет ребенка",
        "Трио с владельцем альбома, воспитателями и одногруппниками",
        "Общая фотография всей группы",
        "12 дизайнов на выбор (выбрать 1 на группу)"
      ]
    },
    "Mini": {
      price: "3300 ₽",
      subtitle: "Альбом на 6 страниц",
      image: "/placeholder.svg",
      popular: true,
      features: [
        "1 съемочный день",
        { text: "Фотография на обложке (по желанию группы)", bold: true },
        "Индивидуальный портрет ребенка",
        "Разворот с воспитателями и одногруппниками",
        "Общая фотография всей группы",
        { text: "Разворот с групповыми фотографиями", bold: true },
        "12 дизайнов на выбор (выбрать 1 на группу)"
      ],
      additionalInfo: "Можно добавить индивидуальные развороты (+350₽/разворот)"
    },
    "Extra": {
      price: "3900 ₽",
      subtitle: "Альбом на 5 страниц",
      image: "/placeholder.svg",
      popular: false,
      features: [
        "1 съемочный день",
        { text: "Индивидуальный разворот ребенка", bold: true },
        { text: "3 индивидуальных портрета ребенка", bold: true },
        { text: "3 разворота групповых фотографий", bold: true },
        { text: "Фотография на обложке (по желанию группы)", bold: true },
        "Разворот с воспитателями и одногруппниками",
        "Общая фотография всей группы",
        "12 дизайнов на выбор (выбрать 1 на группу)"
      ],
      additionalInfo: "Можно добавить индивидуальные развороты (+350₽/разворот)"
    },
    "Max": {
      price: "6500 ₽",
      subtitle: "Альбом на 5 страниц",
      image: "/placeholder.svg",
      popular: false,
      features: [
        { text: "До 3 съемочных дня", bold: true },
        { text: "Индивидуальный разворот ребенка", bold: true },
        { text: "3 индивидуальных портрета ребенка", bold: true },
        { text: "5 разворотов групповых фотографий", bold: true },
        { text: "Фотография на обложке (по желанию группы)", bold: true },
        "Разворот с воспитателями и одногруппниками",
        "Общая фотография всей группы",
        { text: "Фотосъемка выпускного", bold: true },
        { text: "Уникальные грамоты/медали на выпускной", bold: true },
        "12 дизайнов на выбор (выбрать 1 на группу)"
      ],
      additionalInfo: "Можно добавить индивидуальные развороты (+350₽/разворот)"
    }
  } as const;

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
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Album preview - Third on mobile, left side on desktop */}
            <div className="order-3 lg:order-1 flex-1 lg:max-w-[55%]">
              <div className="bg-gradient-card p-6 lg:p-8 rounded-xl shadow-glow">
                <img
                  src={currentAlbum.image}
                  alt={`Разворот альбома ${selectedSize}`}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-soft"
                />
                <div className="mt-4 lg:mt-6 text-center">
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

            {/* Right column with price and features */}
            <div className="order-1 lg:order-2 flex-1 lg:max-w-[45%] space-y-6">
              {/* Price Card - First on mobile, top of right column on desktop */}
              <Card className="bg-gradient-card border-primary/20 shadow-glow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-foreground flex items-center justify-between">
                    {selectedSize}
                    {currentAlbum.popular && (
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        Популярный
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <p className="text-lg text-muted-foreground">{currentAlbum.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl lg:text-3xl font-bold text-primary">
                      {currentAlbum.price}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Included features - Second on mobile, bottom of right column on desktop */}
              <Card className="bg-gradient-card shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg lg:text-xl text-foreground">
                    Что включено:
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 lg:space-y-3">
                    {currentAlbum.features.map((feature, index) => {
                      const isFeatureObject = typeof feature === 'object';
                      const featureText = isFeatureObject ? feature.text : feature;
                      const isBold = isFeatureObject && feature.bold;
                      
                      return (
                        <li key={index} className="flex items-start gap-2 lg:gap-3">
                          <span className="text-primary font-bold text-base lg:text-lg">✓</span>
                          <span className={`text-foreground text-sm lg:text-base ${isBold ? 'font-bold' : ''}`}>
                            {featureText}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  
                  {('additionalInfo' in currentAlbum) && (
                    <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-accent-soft rounded-lg">
                      <div className="flex items-start gap-2 lg:gap-3">
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground text-sm lg:text-base">
                            {(currentAlbum as any).additionalInfo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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