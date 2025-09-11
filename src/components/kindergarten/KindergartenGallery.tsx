import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenGallery = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  
  const [activeFilter, setActiveFilter] = useState("Все");
  
  const filters = ["Все", "Школа", "Студия", "Циклорама", "Тематические"];
  
  const galleryItems = [
    {
      id: 1,
      category: "Школа",
      title: "Школьная фотосессия",
      thumbnail: "/placeholder.svg",
      images: Array.from({ length: 8 }, (_, i) => `/placeholder.svg`)
    },
    {
      id: 2,
      category: "Студия", 
      title: "Студийная съемка",
      thumbnail: "/placeholder.svg",
      images: Array.from({ length: 6 }, (_, i) => `/placeholder.svg`)
    },
    {
      id: 3,
      category: "Циклорама",
      title: "Съемка на циклораме",
      thumbnail: "/placeholder.svg", 
      images: Array.from({ length: 10 }, (_, i) => `/placeholder.svg`)
    },
    {
      id: 4,
      category: "Тематические",
      title: "Новогодняя фотосессия",
      thumbnail: "/placeholder.svg",
      images: Array.from({ length: 12 }, (_, i) => `/placeholder.svg`)
    },
    {
      id: 5,
      category: "Тематические",
      title: "Осенняя сказка",
      thumbnail: "/placeholder.svg",
      images: Array.from({ length: 9 }, (_, i) => `/placeholder.svg`)
    },
    {
      id: 6,
      category: "Студия",
      title: "Портретная съемка",
      thumbnail: "/placeholder.svg",
      images: Array.from({ length: 7 }, (_, i) => `/placeholder.svg`)
    }
  ];

  const filteredItems = activeFilter === "Все" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Галерея
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Посмотрите примеры наших работ в детских садах
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 transition-all duration-200 ${
                  activeFilter === filter 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'hover:bg-accent hover:text-foreground'
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {filteredItems.map((item, index) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div 
                  className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ 
                    transitionDelay: gridVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-white text-xl font-semibold drop-shadow">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-5xl md:max-w-6xl max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4">
                    {item.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${item.title} - фото ${imgIndex + 1}`}
                        className="mb-4 w-full h-auto rounded-lg shadow-soft break-inside-avoid"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KindergartenGallery;