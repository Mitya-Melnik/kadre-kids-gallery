import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const KindergartenLayouts = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  
  const [visibleRows, setVisibleRows] = useState(2);
  
  // Generate 32 layout designs (8 rows * 4 layouts each)
  const layouts = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    src: "/placeholder.svg",
    alt: `Макет альбома ${i + 1}`
  }));
  
  const layoutsPerRow = 4;
  const maxRows = 8;
  const visibleLayouts = layouts.slice(0, visibleRows * layoutsPerRow);
  
  const showMoreRows = () => {
    setVisibleRows(Math.min(visibleRows + 2, maxRows));
  };

  return (
    <section id="layouts" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Макеты
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Все макеты подходят к любому пакету из каталога
          </p>
        </div>

        <div 
          ref={gridRef}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {visibleLayouts.map((layout, index) => (
              <div
                key={layout.id}
                className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ 
                  transitionDelay: gridVisible ? `${index * 50}ms` : '0ms'
                }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                  <img
                    src={layout.src}
                    alt={layout.alt}
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
          
          {visibleRows < maxRows && (
            <div className="text-center">
              <Button
                onClick={showMoreRows}
                variant="outline"
                className="px-8 py-3 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Смотреть еще
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KindergartenLayouts;