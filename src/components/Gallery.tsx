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
    }
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Наши работы
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-semibold mb-2">
                          {gallery.title}
                        </h3>
                        <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                          Посмотреть все фото
                        </Button>
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