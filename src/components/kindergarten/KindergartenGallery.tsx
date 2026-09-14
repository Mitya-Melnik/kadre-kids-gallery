import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { KindergartenResponsiveImage } from "./KindergartenResponsiveImage";

type KindergartenStoryImage = {
  imageNumber: number;
  alt: string;
  kind: "portrait" | "group" | "life";
};

const kindergartenStoryImages: KindergartenStoryImage[] = [
  { imageNumber: 1, alt: "Портрет выпускницы детского сада", kind: "portrait" },
  { imageNumber: 2, alt: "Портрет выпускника детского сада", kind: "portrait" },
  { imageNumber: 25, alt: "Портрет выпускницы в светлом образе", kind: "portrait" },
  { imageNumber: 40, alt: "Живой портрет выпускницы", kind: "portrait" },
  { imageNumber: 4, alt: "Выпускники детского сада фотографируются вместе", kind: "group" },
  { imageNumber: 5, alt: "Подруги из выпускной группы", kind: "group" },
  { imageNumber: 8, alt: "Дети вместе во время игровой съёмки", kind: "group" },
  { imageNumber: 27, alt: "Друзья из выпускной группы", kind: "group" },
  { imageNumber: 32, alt: "Фотография выпускниц с подругами", kind: "group" },
  { imageNumber: 36, alt: "Дружеская фотография выпускников детского сада", kind: "group" },
  { imageNumber: 15, alt: "Две подруги на осенней прогулке", kind: "life" },
  { imageNumber: 11, alt: "Дети играют вместе в группе", kind: "life" },
  { imageNumber: 21, alt: "Занятие и чтение в детском саду", kind: "life" },
  { imageNumber: 23, alt: "Подвижная игра детей в детском саду", kind: "life" },
];

const PhotoButton = ({ image, onOpen }: { image: KindergartenStoryImage; onOpen: () => void }) => (
  <button
    type="button"
    onClick={onOpen}
    className="group block w-full overflow-hidden rounded-2xl bg-secondary/20 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    aria-label={`Увеличить фотографию: ${image.alt}`}
  >
    <KindergartenResponsiveImage
      imageNumber={image.imageNumber}
      alt={image.alt}
      className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] ${image.kind === "portrait" ? "aspect-[2/3]" : "aspect-[3/2]"}`}
      loading="lazy"
    />
  </button>
);

const SwipeRow = ({ images, onOpen }: { images: KindergartenStoryImage[]; onOpen: (image: KindergartenStoryImage) => void }) => (
  <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
    {images.map((image) => (
      <div key={image.imageNumber} className={`shrink-0 snap-center ${image.kind === "portrait" ? "w-[68vw]" : "w-[88vw]"}`}>
        <PhotoButton image={image} onOpen={() => onOpen(image)} />
      </div>
    ))}
  </div>
);

const KindergartenGallery = () => {
  const [selectedGallery, setSelectedGallery] = useState<KindergartenStoryImage[] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const portraits = kindergartenStoryImages.filter((image) => image.kind === "portrait");
  const groups = kindergartenStoryImages.filter((image) => image.kind === "group");
  const groupLife = kindergartenStoryImages.filter((image) => image.kind === "life");

  useEffect(() => {
    if (!carouselApi) return;

    const updateSelectedImage = () => setSelectedImageIndex(carouselApi.selectedScrollSnap());
    updateSelectedImage();
    carouselApi.on("select", updateSelectedImage);

    return () => {
      carouselApi.off("select", updateSelectedImage);
    };
  }, [carouselApi]);

  const openGallery = (images: KindergartenStoryImage[], image: KindergartenStoryImage) => {
    setSelectedImageIndex(images.findIndex((item) => item.imageNumber === image.imageNumber));
    setSelectedGallery(images);
  };

  return (
    <section id="gallery" className="bg-secondary/50 py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">Примеры съёмки для выпускного альбома</p>
          <h2 className="text-3xl font-bold md:text-5xl">Живые фотографии для выпускных альбомов</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Портреты, друзья, игры и знакомые моменты из жизни группы — всё, что делает альбом личной историей детей.
          </p>
        </header>

        <div className="mx-auto max-w-6xl">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">Портреты выпускников</h3>
              <span className="text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={portraits} onOpen={(image) => openGallery(portraits, image)} />
            <div className="hidden grid-cols-4 gap-4 md:grid">
              {portraits.map((image) => <PhotoButton key={image.imageNumber} image={image} onOpen={() => openGallery(portraits, image)} />)}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold text-foreground md:text-3xl">Друзья и группа</h3>
              <span className="text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={groups} onOpen={(image) => openGallery(groups, image)} />
            <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-3">
              {groups.map((image) => <PhotoButton key={image.imageNumber} image={image} onOpen={() => openGallery(groups, image)} />)}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground md:text-3xl">Жизнь группы</h3>
                <p className="mt-2 text-muted-foreground">
                  Игры, занятия и прогулки сохраняют атмосферу группы, которую дети будут узнавать спустя годы.
                </p>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground md:hidden">Листайте →</span>
            </div>
            <SwipeRow images={groupLife} onOpen={(image) => openGallery(groupLife, image)} />
            <div className="hidden grid-cols-2 gap-4 md:grid">
              {groupLife.map((image) => <PhotoButton key={image.imageNumber} image={image} onOpen={() => openGallery(groupLife, image)} />)}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedGallery)} onOpenChange={(open) => !open && setSelectedGallery(null)}>
        <DialogContent className="max-w-6xl border-0 bg-black/95 p-2 sm:p-4">
          <DialogHeader>
            <DialogTitle className="sr-only">Фотографии выпускников детского сада</DialogTitle>
            <DialogDescription className="sr-only">Галерея фотографий со съёмки выпускной группы детского сада</DialogDescription>
          </DialogHeader>
          {selectedGallery && (
            <div className="relative">
              <Carousel key={selectedGallery[0]?.kind} setApi={setCarouselApi} opts={{ startIndex: selectedImageIndex, loop: true }} className="w-full">
                <CarouselContent className="ml-0">
                  {selectedGallery.map((image) => (
                    <CarouselItem key={image.imageNumber} className="pl-0">
                      <div className="flex min-h-[55vh] items-center justify-center px-1 pb-9 sm:px-12">
                        <KindergartenResponsiveImage
                          imageNumber={image.imageNumber}
                          alt={image.alt}
                          className="max-h-[78vh] w-full rounded-lg object-contain"
                          loading="eager"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 hidden h-12 w-12 border-white/30 bg-black/60 text-white hover:bg-black/80 hover:text-white md:inline-flex" />
                <CarouselNext className="right-3 hidden h-12 w-12 border-white/30 bg-black/60 text-white hover:bg-black/80 hover:text-white md:inline-flex" />
              </Carousel>
              <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                {selectedImageIndex + 1} из {selectedGallery.length}
                <span className="ml-2 md:hidden">· листайте</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default KindergartenGallery;
