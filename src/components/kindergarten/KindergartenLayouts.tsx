import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { countLayoutImages } from "@/lib/imageUtils";

// Helper that creates responsive images with mobile/desktop versions optimized for square layouts
function ResponsiveImage({
  basePath,
  alt,
  className,
  loading = "lazy",
  type = "gallery",
}: {
  basePath: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  type?: "cover" | "gallery";
}) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  // Create candidates for both mobile and desktop versions (square format)
  const mobileWebp = `${basePath}-mobile.webp`;
  const desktopWebp = `${basePath}.webp`;
  
  // Fallback sources if webp versions don't exist
  const fallbackSources = [
    `${basePath}.jpg`,
    `${basePath}.jpeg`, 
    `${basePath}.png`
  ];

  // Optimized sizes for square images: covers vs gallery photos
  const isCover = type === "cover";
  const mobileWidth = isCover ? "600w" : "600w";
  const desktopWidth = isCover ? "1000w" : "1000w";
  const mobileSizes = isCover ? "600px" : "600px";
  const desktopSizes = isCover ? "1000px" : "1000px";

  return (
    <img
      srcSet={`${mobileWebp} ${mobileWidth}, ${desktopWebp} ${desktopWidth}`}
      sizes={`(max-width: 768px) ${mobileSizes}, ${desktopSizes}`}
      src={desktopWebp}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        // Try fallback sources in sequence
        const currentSrc = e.currentTarget.src;
        const currentSrcSet = e.currentTarget.srcset;
        
        if (currentSrcSet && currentSrcSet.includes('-mobile.webp')) {
          // If srcset failed, try just the desktop webp
          e.currentTarget.srcset = '';
          e.currentTarget.src = desktopWebp;
        } else if (currentSrc.endsWith('.webp')) {
          // If webp failed, try other formats
          e.currentTarget.src = fallbackSources[0] || '/placeholder.svg';
        } else {
          // Try next fallback or hide
          const currentIndex = fallbackSources.indexOf(currentSrc);
          if (currentIndex < fallbackSources.length - 1) {
            e.currentTarget.src = fallbackSources[currentIndex + 1];
          } else {
            setHidden(true);
          }
        }
      }}
    />
  );
}

const layoutDesigns = [
  { slug: "classic", title: "Классический дизайн" },
  { slug: "modern", title: "Современный стиль" },
  { slug: "vintage", title: "Винтажный дизайн" },
  { slug: "minimalist", title: "Минималистичный" },
  { slug: "colorful", title: "Яркий и красочный" },
  { slug: "elegant", title: "Элегантный дизайн" },
  { slug: "playful", title: "Игривый стиль" },
  { slug: "nature", title: "Природный дизайн" },
  { slug: "fairy-tale", title: "Сказочный мир" },
  { slug: "seasons", title: "Времена года" },
  { slug: "animals", title: "Мир животных" },
  { slug: "space", title: "Космические приключения" },
];

const KindergartenLayouts = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  
  // State to store image counts for each layout
  const [layoutCounts, setLayoutCounts] = useState<Record<string, number>>({});

  // Load image counts for all layouts on mount
  useEffect(() => {
    const loadLayoutCounts = async () => {
      const counts: Record<string, number> = {};
      
      for (const design of layoutDesigns) {
        try {
          const count = await countLayoutImages(design.slug);
          counts[design.slug] = count;
        } catch (error) {
          console.warn(`Failed to count images for ${design.slug}:`, error);
          counts[design.slug] = 0;
        }
      }
      
      setLayoutCounts(counts);
    };
    
    loadLayoutCounts();
  }, []);

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
            Все макеты подходят к любому пакету из каталога. Нажмите на макет, чтобы посмотреть больше вариантов.
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {layoutDesigns.map((design, index) => {
            const coverBase = `/layouts/${design.slug}/cover`;

            return (
              <Dialog key={design.slug}>
                <DialogTrigger asChild>
                  <article 
                    className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ 
                      transitionDelay: gridVisible ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                      <ResponsiveImage
                        basePath={coverBase}
                        type="cover"
                        alt={`${design.title} — обложка макета`}
                        className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-xl font-semibold drop-shadow">
                          {design.title}
                        </h3>
                      </div>
                    </div>
                  </article>
                </DialogTrigger>

                <DialogContent className="max-w-5xl md:max-w-6xl max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground">
                        {design.title}
                      </h3>
                    </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: layoutCounts[design.slug] || 0 }, (_, i) => i + 1).map((n) => {
                        const base = `/layouts/${design.slug}/${n}`;
                        return (
                          <ResponsiveImage
                            key={`${design.slug}-${n}`}
                            basePath={base}
                            type="gallery"
                            alt={`${design.title} — макет ${n}`}
                            className="w-full aspect-square object-cover rounded-lg shadow-soft"
                            loading="lazy"
                          />
                        );
                      })}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KindergartenLayouts;