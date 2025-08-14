import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { analyzeGalleryLayout, type GalleryAnalysis } from "@/lib/imageUtils";

// Helper that creates responsive images with mobile/desktop versions
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

  // Create candidates for both mobile and desktop versions
  const mobileWebp = `${basePath}-mobile.webp`;
  const desktopWebp = `${basePath}.webp`;
  
  // Fallback sources if webp versions don't exist
  const fallbackSources = [
    `${basePath}.jpg`,
    `${basePath}.jpeg`, 
    `${basePath}.png`
  ];

  // Different responsive sizes for covers vs gallery photos
  const isCover = type === "cover";
  const mobileWidth = isCover ? "600w" : "800w";
  const desktopWidth = isCover ? "1200w" : "1600w";
  const mobileSizes = isCover ? "600px" : "800px";
  const desktopSizes = isCover ? "1200px" : "1600px";

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

const MAX_IMAGES_PER_ALBUM = 20; // You can change this if needed

const albums = [
  { slug: "suhocvety", title: "Сухоцветы" },
  { slug: "tykvennoe", title: "Тыквенное настроение" },
  { slug: "osenkach", title: "Осенние качели" },
  { slug: "osenskazka", title: "Осенняя сказка" },
  { slug: "zimaskazka", title: "Зимняя сказка" },
  { slug: "paravoz", title: "В объятиях зимы" },
  { slug: "olen", title: "Легенда севера" },
  { slug: "okno", title: "Зимний вечер" },
  { slug: "provance", title: "Прованс" },
  { slug: "italy", title: "Италия" },
  { slug: "biker", title: "Байкер" },
  { slug: "vderevne", title: "В деревне" },
];

const Gallery = () => {
  const [galleryAnalyses, setGalleryAnalyses] = useState<Record<string, GalleryAnalysis>>({});

  // Analyze galleries on component mount
  useEffect(() => {
    const analyzeAllGalleries = async () => {
      const analyses: Record<string, GalleryAnalysis> = {};
      
      // Analyze each album
      for (const album of albums) {
        try {
          const analysis = await analyzeGalleryLayout(album.slug, MAX_IMAGES_PER_ALBUM);
          analyses[album.slug] = analysis;
        } catch (error) {
          console.warn(`Failed to analyze ${album.title}:`, error);
          // Use masonry as fallback
          analyses[album.slug] = {
            layoutType: 'masonry',
            verticalCount: 0,
            horizontalCount: 0,
            totalCount: 0,
            verticalPercentage: 0,
          };
        }
      }
      
      setGalleryAnalyses(analyses);
    };

    analyzeAllGalleries();
  }, []);

  return (
    <section id="gallery" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Наши съемки
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Загрузите свои фото в папки в public — и галерея автоматически их подхватит.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {albums.map((album) => {
            const coverBase = `/galleries/${album.slug}/cover`;

            return (
              <Dialog key={album.slug}>
                <DialogTrigger asChild>
                  <article className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                      <ResponsiveImage
                        basePath={coverBase}
                        type="cover"
                        alt={`${album.title} — обложка фотосессии`}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-semibold drop-shadow">
                          {album.title}
                        </h3>
                      </div>
                    </div>
                  </article>
                </DialogTrigger>

                <DialogContent className="max-w-5xl md:max-w-6xl max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-foreground">
                        {album.title}
                      </h3>
                      {galleryAnalyses[album.slug] && (
                        <div className="text-sm text-muted-foreground">
                          {galleryAnalyses[album.slug].layoutType === 'grid' 
                            ? '📐 Сохранен порядок' 
                            : '🎨 Красивое распределение'
                          }
                        </div>
                      )}
                    </div>
                    <div 
                      className={
                        galleryAnalyses[album.slug]?.layoutType === 'grid'
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                          : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
                      }
                    >
                      {Array.from({ length: MAX_IMAGES_PER_ALBUM }, (_, i) => i + 1).map((n) => {
                        const base = `/galleries/${album.slug}/${n}`;
                        return (
                          <ResponsiveImage
                            key={`${album.slug}-${n}`}
                            basePath={base}
                            type="gallery"
                            alt={`${album.title} — фото ${n}`}
                            className="mb-4 w-full h-auto rounded-lg shadow-soft break-inside-avoid"
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

export default Gallery;
