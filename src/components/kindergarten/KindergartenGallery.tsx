import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getKindergartenGalleryNumbers, analyzeKindergartenGallery, type GalleryAnalysis } from "@/lib/imageUtils";
import { KindergartenResponsiveImage } from "./KindergartenResponsiveImage";

const KindergartenGallery = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation(0.1);
  
  const [imageNumbers, setImageNumbers] = useState<number[]>([]);
  const [galleryAnalysis, setGalleryAnalysis] = useState<GalleryAnalysis | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const [numbers, analysis] = await Promise.all([
          getKindergartenGalleryNumbers(),
          analyzeKindergartenGallery()
        ]);
        
        setImageNumbers(numbers);
        setGalleryAnalysis(analysis);
      } catch (error) {
        console.error('Error loading kindergarten gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);
  
  const visibleImages = imageNumbers.slice(0, visibleCount);
  const hasMore = visibleCount < imageNumbers.length;
  
  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, imageNumbers.length));
  };

  const openImageDialog = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setIsDialogOpen(true);
  };

  const getGridClasses = () => {
    if (!galleryAnalysis) return "grid grid-cols-2 md:grid-cols-4 gap-4";
    
    return galleryAnalysis.layoutType === 'masonry' 
      ? "columns-2 md:columns-4 gap-4 space-y-4"
      : "grid grid-cols-2 md:grid-cols-4 gap-4";
  };

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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Посмотрите примеры наших работ в детских садах
          </p>
        </div>

        <div 
          ref={gridRef}
          className="max-w-6xl mx-auto"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Загрузка галереи...</p>
            </div>
          ) : imageNumbers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Фотографии пока не загружены</p>
            </div>
          ) : (
            <>
              <div className={`${getGridClasses()} mb-8`}>
                {visibleImages.map((imageNumber, index) => (
                  <div
                    key={imageNumber}
                    onClick={() => openImageDialog(index)}
                    className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${
                      galleryAnalysis?.layoutType === 'masonry' ? 'break-inside-avoid mb-4' : ''
                    } ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ 
                      transitionDelay: gridVisible ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-glow transition-all duration-300">
                      <KindergartenResponsiveImage
                        imageNumber={imageNumber}
                        alt={`Фотография детского сада ${imageNumber}`}
                        className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                          galleryAnalysis?.layoutType === 'masonry' ? 'h-auto' : 'h-48 md:h-64'
                        }`}
                        loading={index < 8 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-6xl h-fit p-2 sm:p-4">
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      Галерея детского сада
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Слайдер с фотографиями из галереи детского сада
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="relative max-h-[90vh]">
                    <Carousel className="w-full h-fit" opts={{ startIndex: selectedImageIndex, loop: true }}>
                      <CarouselContent>
                        {visibleImages.map((imageNumber, index) => (
                          <CarouselItem key={imageNumber}>
                            <div className="flex items-center justify-center p-2">
                              <KindergartenResponsiveImage
                                imageNumber={imageNumber}
                                alt={`Фотография детского сада ${imageNumber}`}
                                className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                                loading="eager"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 sm:left-4 h-10 w-10 sm:h-12 sm:w-12" />
                      <CarouselNext className="right-2 sm:right-4 h-10 w-10 sm:h-12 sm:w-12" />
                    </Carousel>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} из {visibleImages.length}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {hasMore && (
                <div className="text-center">
                  <Button
                    onClick={showMore}
                    variant="outline"
                    className="px-8 py-3 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    Смотреть еще
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default KindergartenGallery;