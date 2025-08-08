import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Gallery = () => {
  const [selectedGallery, setSelectedGallery] = useState(null);
  
  const galleries = [
    {
      id: 1,
      title: "Космическая тематика",
      cover: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1614314107768-6018061b5cc1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 2,
      title: "Сказочный лес",
      cover: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 3,
      title: "Морские приключения",
      cover: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582515073490-39981397c445?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574782293711-11c4d3b4cc5c?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 4,
      title: "Принцессы и феи",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616c27de95d?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 5,
      title: "Супергерои",
      cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 6,
      title: "Животные",
      cover: "https://images.unsplash.com/photo-1415604934674-561df9abf539?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1415604934674-561df9abf539?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 7,
      title: "Весенняя сказка",
      cover: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 8,
      title: "Новогодняя",
      cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544273677-6e0d999a1ffa?w=800&h=600&fit=crop"
      ]
    },
    {
      id: 9,
      title: "Пираты",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop"
      ]
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Наши съемки
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Примеры тематических фотосессий. Нажмите на любую съемку, чтобы посмотреть больше фотографий
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {galleries.map((gallery) => (
            <Dialog key={gallery.id}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                    <img
                      src={gallery.cover}
                      alt={gallery.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-semibold">
                          {gallery.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    {gallery.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gallery.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${gallery.title} ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg shadow-soft"
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

export default Gallery;